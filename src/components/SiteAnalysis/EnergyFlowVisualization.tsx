import React, { useState, useCallback } from "react";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Site } from "@/types/site";
import { TimeRange } from "@/types/flowComponents";
import { Edge, Node } from "@xyflow/react";
import TimeRangeSelector from "./TimeRangeSelector";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";
import { useFlowData } from "@/hooks/useFlowData";
import NodePalette from "./FlowComponents/NodePalette";
import FlowControls from "./FlowComponents/FlowControls";
import FlowCanvas from "./FlowComponents/FlowCanvas";
import { getInitialNodes, getInitialEdges } from "@/utils/initialFlowTemplate";

interface EnergyFlowVisualizationProps {
  site: Site;
}

const Flow: React.FC<EnergyFlowVisualizationProps> = ({ site }) => {
  const [nodes, setNodes] = useState<Node[]>(getInitialNodes());
  const [edges, setEdges] = useState<Edge[]>(getInitialEdges());
  const [timeRange, setTimeRange] = useState<TimeRange>("realtime");
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<{ id: string; type: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const { flowData, faults, efficiencyMetrics } = useFlowData(timeRange, isPaused, edges);

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.stopPropagation();
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

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode({ id: node.id, type: node.type });
    setSelectedEdge(null);
  }, []);

  const handleTimeRangeChange = (newRange: TimeRange) => {
    setTimeRange(newRange);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleFitView = () => {
    setZoomLevel(1);
  };

  return (
    <div className="relative h-[600px] bg-background/50 rounded-lg p-6 border">
      <div className="absolute top-4 left-4 z-10">
        <TimeRangeSelector value={timeRange} onChange={handleTimeRangeChange} />
      </div>

      <NodePalette onDragStart={(event, nodeType, sourceType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('sourceType', sourceType || '');
        event.dataTransfer.effectAllowed = 'move';
      }} />
      
      <FlowCanvas
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        flowData={flowData}
        faults={faults}
        efficiencyMetrics={efficiencyMetrics}
        onEdgeClick={handleEdgeClick}
        onNodeClick={handleNodeClick}
      />

      <FlowControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onFitView={handleFitView}
      />

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

const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = (props) => {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
};

export default EnergyFlowVisualization;