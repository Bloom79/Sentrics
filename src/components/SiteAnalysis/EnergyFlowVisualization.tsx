import React, { useState, useCallback, DragEvent } from "react";
import { 
  ReactFlow, 
  Controls, 
  Edge, 
  Panel, 
  Background, 
  Connection, 
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges
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
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Maximize2, Battery, Sun, Wind, Factory, Grid } from "lucide-react";
import { Card } from "@/components/ui/card";

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

const paletteItems = [
  { type: 'source', label: 'Solar Array', icon: Sun },
  { type: 'source', label: 'Wind Farm', icon: Wind },
  { type: 'storage', label: 'Storage', icon: Battery },
  { type: 'consumer', label: 'Consumer', icon: Factory },
  { type: 'grid', label: 'Grid', icon: Grid },
];

interface EnergyFlowVisualizationProps {
  site: Site;
}

let id = 0;
const getId = () => `node_${id++}`;

const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = ({ site }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("realtime");
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedNode, setSelectedNode] = useState<{ id: string; type: string } | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { project } = useReactFlow();

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

      if (!reactFlowInstance) return;

      const type = event.dataTransfer.getData('application/reactflow');
      const position = project({
        x: event.clientX,
        y: event.clientY,
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
    [reactFlowInstance, project, nodes]
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

      {/* Node Palette */}
      <Card className="absolute left-4 top-20 z-10 p-4">
        <h3 className="text-sm font-medium mb-2">Components</h3>
        <div className="flex flex-col gap-2">
          {paletteItems.map((item) => (
            <div
              key={`${item.type}-${item.label}`}
              className="flex items-center gap-2 p-2 border rounded cursor-move hover:bg-accent"
              draggable
              onDragStart={(event) => onDragStart(event, item.type)}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </Card>
      
      <ReactFlow
        nodes={nodes}
        edges={enhancedEdges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes) => setNodes((nds) => applyNodeChanges(changes, nds))}
        onEdgesChange={(changes) => setEdges((eds) => applyEdgeChanges(changes, eds))}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
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
