import React, { useState, useCallback } from "react";
import { ReactFlow, Controls, Edge, Panel } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Site } from "@/types/site";
import { TimeRange } from "@/types/flowComponents";
import TimeRangeSelector from "./TimeRangeSelector";
import FlowChartDialog from "./FlowChartDialog";
import { getInitialLayout, generateEdges } from "@/utils/flowLayout";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";
import { useFlowData } from "@/hooks/useFlowData";
import { getEdgeOptions } from "./FlowEdgeOptions";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

// Import node components
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
  const [timeRange, setTimeRange] = useState<TimeRange>("realtime");
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<{ id: string; type: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const { nodes, edges } = React.useMemo(() => {
    const layout = getInitialLayout(site.energySources.length);
    const edges = generateEdges(layout.nodes);
    return { nodes: layout.nodes, edges };
  }, [site.energySources.length]);

  const { flowData, faults, efficiencyMetrics } = useFlowData(timeRange, isPaused, edges);

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    const currentFlow = flowData[edge.id]?.[flowData[edge.id].length - 1]?.currentValue || 0;
    const metrics = efficiencyMetrics[edge.id] || {
      efficiency: 95,
      losses: []
    };

    setSelectedEdge({
      ...edge,
      data: {
        ...edge.data,
        faults: faults[edge.id] || [],
        energyFlow: currentFlow,
        efficiency: metrics.efficiency,
        losses: metrics.losses,
      }
    });
    setSelectedNode(null);
  }, [faults, flowData, efficiencyMetrics]);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode({ id: node.id, type: node.type });
    setSelectedEdge(null);
  }, []);

  const handleTimeRangeChange = (newRange: TimeRange) => {
    setTimeRange(newRange);
  };

  const handleZoomIn = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomIn();
      setZoomLevel(prev => Math.min(prev + 0.2, 2));
    }
  };

  const handleZoomOut = () => {
    if (reactFlowInstance) {
      reactFlowInstance.zoomOut();
      setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
    }
  };

  const handleFitView = () => {
    if (reactFlowInstance) {
      reactFlowInstance.fitView({ padding: 0.2 });
      setZoomLevel(1);
    }
  };

  const enhancedEdges = getEdgeOptions({ flowData, faults, efficiencyMetrics, edges });

  return (
    <div className="relative h-[600px] bg-background/50 rounded-lg p-6 border">
      <div className="absolute top-4 left-4 z-10">
        <TimeRangeSelector value={timeRange} onChange={handleTimeRangeChange} />
      </div>
      
      <ReactFlow
        nodes={nodes}
        edges={enhancedEdges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        onEdgeClick={handleEdgeClick}
        onNodeClick={handleNodeClick}
        proOptions={{ hideAttribution: true }}
        onInit={setReactFlowInstance}
        minZoom={0.5}
        maxZoom={2}
      >
        <Controls showInteractive={false} />
        <Panel position="top-right" className="bg-background/95 p-2 rounded-lg shadow-sm border flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleFitView}
            className="h-8 w-8"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </Panel>
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
            efficiency: efficiencyMetrics[selectedEdge.id]?.efficiency || 95,
            status: faults[selectedEdge.id]?.some(f => f.type === 'error') ? 'error' : 'active',
            faults: faults[selectedEdge.id] || [],
            losses: efficiencyMetrics[selectedEdge.id]?.losses || [],
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