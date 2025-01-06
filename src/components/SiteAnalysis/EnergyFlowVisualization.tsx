import React, { useState, useCallback, useEffect } from "react";
import { ReactFlow, Controls, Edge, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Site } from "@/types/site";
import { TimeRange, EnergyFlow } from "@/types/flowComponents";
import TimeRangeSelector from "./TimeRangeSelector";
import FlowChartDialog from "./FlowChartDialog";
import { getInitialLayout, generateEdges } from "@/utils/flowLayout";
import { getEdgeStyle } from "@/utils/edgeUtils";
import { useToast } from "@/components/ui/use-toast";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";

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
  const [selectedNode, setSelectedNode] = useState<{ id: string; type: string } | null>(null);
  const [flowData, setFlowData] = useState<Record<string, EnergyFlow[]>>({});
  const [isPaused, setIsPaused] = useState(false);
  const [faults, setFaults] = useState<Record<string, { type: 'warning' | 'error'; message: string }[]>>({});

  // Mock function to generate flow data and faults
  const generateFlowData = useCallback((edgeId: string): EnergyFlow => {
    const now = new Date();
    const currentValue = Math.random() * 1000;
    
    // Randomly generate faults for demonstration
    if (Math.random() < 0.1) {
      const newFaults = [...(faults[edgeId] || [])];
      if (currentValue > 800) {
        newFaults.push({
          type: 'warning',
          message: 'High energy flow detected'
        });
      }
      if (currentValue < 200) {
        newFaults.push({
          type: 'error',
          message: 'Critical: Low energy flow'
        });
      }
      setFaults(prev => ({
        ...prev,
        [edgeId]: newFaults
      }));

      // Show toast for critical faults
      if (newFaults.some(f => f.type === 'error')) {
        toast({
          variant: "destructive",
          title: "Critical Fault Detected",
          description: `Edge ${edgeId} has reported critical faults`,
        });
      }
    }

    return {
      currentValue,
      maxValue: currentValue * 1.2,
      minValue: currentValue * 0.8,
      avgValue: currentValue,
      timestamp: now,
    };
  }, [faults, toast]);

  const { nodes, edges } = React.useMemo(() => {
    const layout = getInitialLayout(site.energySources.length);
    const edges = generateEdges(layout.nodes);
    return { nodes: layout.nodes, edges };
  }, [site.energySources.length]);

  // Update flow data periodically
  useEffect(() => {
    if (timeRange === 'realtime' && !isPaused) {
      const interval = setInterval(() => {
        setFlowData(prev => {
          const newData = { ...prev };
          edges.forEach(edge => {
            const newFlow = generateFlowData(edge.id);
            newData[edge.id] = [...(newData[edge.id] || []).slice(-50), newFlow];
          });
          return newData;
        });
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [timeRange, isPaused, generateFlowData, edges]);

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge({
      ...edge,
      data: {
        ...edge.data,
        faults: faults[edge.id] || []
      }
    });
    setSelectedNode(null);
  }, [faults]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode({ id: node.id, type: node.type });
    setSelectedEdge(null);
  }, []);

  const handleTimeRangeChange = (newRange: TimeRange) => {
    setTimeRange(newRange);
    toast({
      title: "Time Range Updated",
      description: `Showing data for: ${newRange}`,
    });
  };

  // Custom edge styles with animations and fault indicators
  const edgeOptions = {
    style: { strokeWidth: 2 },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#888',
    },
    animated: true,
  };

  return (
    <div className="relative h-[600px] bg-background/50 rounded-lg p-6 border">
      <div className="absolute top-4 left-4 z-10">
        <TimeRangeSelector value={timeRange} onChange={handleTimeRangeChange} />
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={edges.map(edge => ({
          ...edge,
          ...edgeOptions,
          style: {
            ...edgeOptions.style,
            ...getEdgeStyle(flowData[edge.id]?.[flowData[edge.id].length - 1]?.currentValue || 0),
            stroke: faults[edge.id]?.some(f => f.type === 'error') ? '#ef4444' : 
                   faults[edge.id]?.some(f => f.type === 'warning') ? '#f59e0b' : 
                   undefined,
          },
          label: flowData[edge.id]?.[flowData[edge.id].length - 1]?.currentValue.toFixed(1) + ' kW',
          labelStyle: { fill: 'black', fontWeight: 500 },
          labelBgStyle: { fill: 'white', opacity: 0.8 },
        }))}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={true}
        onEdgeClick={handleEdgeClick}
        onNodeClick={handleNodeClick}
        proOptions={{ hideAttribution: true }}
      >
        <Controls />
      </ReactFlow>

      {selectedEdge && (
        <EdgeDialog
          open={true}
          onClose={() => setSelectedEdge(null)}
          edgeData={{
            id: selectedEdge.id,
            source: selectedEdge.source,
            target: selectedEdge.target,
            energyFlow: flowData[selectedEdge.id]?.[flowData[selectedEdge.id].length - 1]?.currentValue || 0,
            efficiency: 95,
            status: faults[selectedEdge.id]?.some(f => f.type === 'error') ? 'error' : 'active',
            faults: faults[selectedEdge.id] || [],
          }}
        />
      )}

      {selectedNode && (
        <NodeDialog
          open={true}
          onClose={() => setSelectedNode(null)}
          nodeType={selectedNode.type}
          nodeId={selectedNode.id}
        />
      )}
    </div>
  );
};

export default EnergyFlowVisualization;
