import React, { useCallback, DragEvent, useState } from "react";
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
import { FlowNodeData, NodeStatus } from "@/types/flowComponents";
import { Card } from "@/components/ui/card";
import { Sun, Wind, Battery, Factory, Grid, Zap, Cable } from "lucide-react";
import SidePanel from "./SidePanel";

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

const FlowLegend = () => (
  <Card className="absolute bottom-4 right-4 p-4 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <h4 className="text-sm font-medium mb-2">Legend</h4>
    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
      <div className="flex items-center gap-2">
        <Sun className="w-4 h-4 text-yellow-500" />
        <span>Solar Generation</span>
      </div>
      <div className="flex items-center gap-2">
        <Wind className="w-4 h-4 text-blue-500" />
        <span>Wind Generation</span>
      </div>
      <div className="flex items-center gap-2">
        <Battery className="w-4 h-4 text-green-500" />
        <span>Energy Storage</span>
      </div>
      <div className="flex items-center gap-2">
        <Factory className="w-4 h-4 text-purple-500" />
        <span>Consumption</span>
      </div>
      <div className="flex items-center gap-2">
        <Grid className="w-4 h-4 text-red-500" />
        <span>Power Grid</span>
      </div>
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-orange-500" />
        <span>Inverter</span>
      </div>
      <div className="flex items-center gap-2">
        <Cable className="w-4 h-4 text-indigo-500" />
        <span>Transformer</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-0.5 bg-green-500" />
        <span>High Flow (&gt;500kW)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-0.5 bg-yellow-500" />
        <span>Medium Flow (200-500kW)</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-0.5 bg-red-500" />
        <span>Low Flow (&lt;200kW)</span>
      </div>
    </div>
  </Card>
);

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
  const [selectedNode, setSelectedNode] = useState<FlowNodeData | null>(null);

  const handleNodeClick = (event: React.MouseEvent, node: Node) => {
    event.stopPropagation();
    const nodeData: FlowNodeData = {
      id: node.id,
      type: node.type as FlowNodeData['type'],
      label: node.data.label as string,
      specs: node.data.specs || {},
      status: (node.data.status || 'active') as NodeStatus,
      onNodeClick: (node.data.onNodeClick as (id: string, type: string) => void) || (() => {}),
    };
    setSelectedNode(nodeData);
    if (onNodeClick) {
      onNodeClick(event, node);
    }
  };

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
      const specs = JSON.parse(event.dataTransfer.getData('specs') || '{}');
      
      const { clientX, clientY } = event;
      const position = reactFlowInstance.screenToFlowPosition({
        x: clientX,
        y: clientY,
      });

      const newNode = {
        id: `${type}_${nodes.length + 1}`,
        type,
        position,
        data: { 
          id: `${type}_${nodes.length + 1}`,
          type,
          label: sourceType === 'solar' 
            ? 'Solar Array' 
            : sourceType === 'wind'
            ? 'Wind Farm'
            : `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`,
          specs,
          status: 'active',
          onNodeClick: (id: string, type: string) => handleNodeClick(event, { id, type } as any),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodes, setNodes, handleNodeClick, isEditMode]
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
    <>
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
        onNodeClick={handleNodeClick}
        proOptions={{ hideAttribution: true }}
        minZoom={0.5}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        className="touch-none"
      >
        <Background />
        <Controls showInteractive={false} />
        <FlowLegend />
      </ReactFlow>
      <SidePanel 
        open={!!selectedNode} 
        onClose={() => setSelectedNode(null)}
        nodeData={selectedNode}
      />
    </>
  );
};

export default FlowCanvas;