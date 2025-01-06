import React, { useCallback, DragEvent } from "react";
import { 
  ReactFlow,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import { getEdgeOptions } from "../FlowEdgeOptions";
import { nodeTypes } from "./FlowNodeTypes";
import { useReactFlow } from "@xyflow/react";

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  flowData: any;
  faults: any;
  efficiencyMetrics: any;
  onEdgeClick: (event: React.MouseEvent, edge: Edge) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  isEditMode: boolean;
}

const FlowCanvas: React.FC<FlowCanvasProps> = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  flowData,
  faults,
  efficiencyMetrics,
  onEdgeClick,
  onNodeClick,
  isEditMode,
}) => {
  const reactFlowInstance = useReactFlow();

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      if (!isEditMode) return;
      
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const sourceType = event.dataTransfer.getData('sourceType');
      const { clientX, clientY } = event;
      const position = reactFlowInstance.screenToFlowPosition({
        x: clientX,
        y: clientY,
      });

      const newNode = {
        id: `node_${nodes.length + 1}`,
        type,
        position,
        data: { 
          label: sourceType === 'solar' 
            ? 'Solar Array' 
            : `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`,
          type,
          specs: {
            capacity: 500,
            power: 350,
            efficiency: 95,
          },
          status: 'active',
          onNodeClick: (id: string, type: string) => onNodeClick(event, { id, type } as any),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes, setNodes, onNodeClick, isEditMode]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!isEditMode) return;
      setEdges((eds) => eds.concat({ ...params, id: `edge_${eds.length}` }));
    },
    [setEdges, isEditMode]
  );

  const enhancedEdges = getEdgeOptions({ flowData, faults, efficiencyMetrics, edges });

  return (
    <ReactFlow
      nodes={nodes}
      edges={enhancedEdges}
      nodeTypes={nodeTypes}
      onNodesChange={(changes) => isEditMode && setNodes((nds) => applyNodeChanges(changes, nds))}
      onEdgesChange={(changes) => isEditMode && setEdges((eds) => applyEdgeChanges(changes, eds))}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      fitView
      nodesDraggable={isEditMode}
      nodesConnectable={isEditMode}
      elementsSelectable={isEditMode}
      onEdgeClick={onEdgeClick}
      onNodeClick={onNodeClick}
      proOptions={{ hideAttribution: true }}
      minZoom={0.5}
      maxZoom={2}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      className="touch-none"
    >
      <Background />
      <Controls showInteractive={false} />
    </ReactFlow>
  );
};

export default FlowCanvas;