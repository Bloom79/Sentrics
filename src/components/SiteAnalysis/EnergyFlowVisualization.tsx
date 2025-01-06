import React, { useState, useCallback, useEffect } from "react";
import { ReactFlow, Controls, Edge, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Site } from "@/types/site";
import { TimeRange, EnergyFlow } from "@/types/flowComponents";
import TimeRangeSelector from "./TimeRangeSelector";
import FlowChartDialog from "./FlowChartDialog";
import FlowEdgeTooltip from "./FlowEdgeTooltip";
import { getInitialLayout, getEdgeStyle } from "@/utils/flowLayout";
import { useToast } from "@/components/ui/use-toast";

// Import your node components
import SourceNode from "./FlowNodes/SourceNode";
import StorageNode from "./FlowNodes/StorageNode";
import ConsumerNode from "./FlowNodes/ConsumerNode";
import GridNode from "./FlowNodes/GridNode";
import CellNode from "./FlowNodes/CellNode";
import StringNode from "./FlowNodes/StringNode";
import InverterNode from "./FlowNodes/InverterNode";
import TransformerNode from "./FlowNodes/TransformerNode";

const nodeTypes = {
  source: SourceNode,
  storage: StorageNode,
  consumer: ConsumerNode,
  grid: GridNode,
  cell: CellNode,
  string: StringNode,
  inverter: InverterNode,
  transformer: TransformerNode,
};

interface EnergyFlowVisualizationProps {
  site: Site;
}

const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = ({ site }) => {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRange>("realtime");
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [flowData, setFlowData] = useState<Record<string, EnergyFlow[]>>({});
  const [isPaused, setIsPaused] = useState(false);

  // Mock function to generate flow data
  const generateFlowData = useCallback((edgeId: string): EnergyFlow => {
    const now = new Date();
    const currentValue = Math.random() * 1000;
    return {
      currentValue,
      maxValue: currentValue * 1.2,
      minValue: currentValue * 0.8,
      avgValue: currentValue,
      timestamp: now,
    };
  }, []);

  // Update flow data periodically
  useEffect(() => {
    if (timeRange === 'realtime' && !isPaused) {
      const interval = setInterval(() => {
        setFlowData(prev => {
          const newData = { ...prev };
          Object.keys(newData).forEach(edgeId => {
            const newFlow = generateFlowData(edgeId);
            newData[edgeId] = [...(newData[edgeId] || []), newFlow].slice(-50);
          });
          return newData;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [timeRange, isPaused, generateFlowData]);

  const { nodes, edges } = React.useMemo(() => {
    const layout = getInitialLayout(site.energySources.length);
    
    const edges = layout.nodes.flatMap((node, index) => {
      const edgeConnections = [];
      
      // Add your edge generation logic here based on node types
      // Example:
      if (node.type === 'cell') {
        edgeConnections.push({
          id: `${node.id}-to-string`,
          source: node.id,
          target: `string-${Math.floor(index / 3)}`,
          animated: true,
          style: getEdgeStyle(250),
          data: {
            energyFlow: generateFlowData(`${node.id}-to-string`),
            efficiency: 98,
            status: 'active' as const,
            type: 'solar' as const,
          },
        });
      }
      
      return edgeConnections;
    });

    return {
      nodes: layout.nodes,
      edges,
    };
  }, [site.energySources.length, generateFlowData]);

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
  }, []);

  const handleTimeRangeChange = (newRange: TimeRange) => {
    setTimeRange(newRange);
    toast({
      title: "Time Range Updated",
      description: `Showing data for: ${newRange}`,
    });
  };

  return (
    <div className="relative h-[600px] bg-background/50 rounded-lg p-6 border">
      <div className="absolute top-4 left-4 z-10">
        <TimeRangeSelector value={timeRange} onChange={handleTimeRangeChange} />
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        onEdgeClick={handleEdgeClick}
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
      </ReactFlow>

      {selectedEdge && (
        <FlowChartDialog
          open={true}
          onClose={() => setSelectedEdge(null)}
          data={flowData[selectedEdge.id] || []}
          sourceLabel={nodes.find(n => n.id === selectedEdge.source)?.data.label || ''}
          targetLabel={nodes.find(n => n.id === selectedEdge.target)?.data.label || ''}
        />
      )}
    </div>
  );
};

export default EnergyFlowVisualization;