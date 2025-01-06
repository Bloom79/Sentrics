import React, { useState, useCallback, DragEvent } from "react";
import { 
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  Connection,
  Edge,
  useReactFlow,
  Node,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Site } from "@/types/site";
import { TimeRange } from "@/types/flowComponents";
import TimeRangeSelector from "./TimeRangeSelector";
import FlowChartDialog from "./FlowChartDialog";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";
import { useFlowData } from "@/hooks/useFlowData";
import { getEdgeOptions } from "./FlowEdgeOptions";
import NodePalette from "./FlowComponents/NodePalette";
import FlowControls from "./FlowComponents/FlowControls";

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

let id = 0;
const getId = () => `node_${id++}`;

const Flow: React.FC<EnergyFlowVisualizationProps> = ({ site }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("realtime");
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<{ id: string; type: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const reactFlowInstance = useReactFlow();

  const { flowData, faults, efficiencyMetrics } = useFlowData(timeRange, isPaused, edges);

  const onDragStart = (event: DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const { clientX, clientY } = event;
      const position = reactFlowInstance.screenToFlowPosition({
        x: clientX,
        y: clientY,
      });

      const newNode = {
        id: getId(),
        type,
        position,
        data: { 
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`,
          onNodeClick: (id: string, type: string) => setSelectedNode({ id, type }),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => eds.concat({ ...params, id: `edge_${eds.length}` }));
    },
    []
  );

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
    reactFlowInstance.zoomIn();
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    reactFlowInstance.zoomOut();
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleFitView = () => {
    reactFlowInstance.fitView({ padding: 0.2 });
    setZoomLevel(1);
  };

  const enhancedEdges = getEdgeOptions({ flowData, faults, efficiencyMetrics, edges });

  return (
    <div className="relative h-[600px] bg-background/50 rounded-lg p-6 border">
      <div className="absolute top-4 left-4 z-10">
        <TimeRangeSelector value={timeRange} onChange={handleTimeRangeChange} />
      </div>

      <NodePalette onDragStart={onDragStart} />
      
      <ReactFlow
        nodes={nodes}
        edges={enhancedEdges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes) => setNodes((nds) => applyNodeChanges(changes, nds))}
        onEdgesChange={(changes) => setEdges((eds) => applyEdgeChanges(changes, eds))}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        fitView
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        onEdgeClick={handleEdgeClick}
        onNodeClick={handleNodeClick}
        proOptions={{ hideAttribution: true }}
        minZoom={0.5}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        className="touch-none"
      >
        <Background />
        <Controls showInteractive={false} />
        <FlowControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitView={handleFitView}
        />
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

// Wrap the Flow component with ReactFlowProvider
const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = (props) => {
  return (
    <ReactFlowProvider>
      <Flow {...props} />
    </ReactFlowProvider>
  );
};

export default EnergyFlowVisualization;