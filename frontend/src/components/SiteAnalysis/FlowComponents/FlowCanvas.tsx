import React, { useCallback, DragEvent, useState, useMemo, useEffect } from "react";
import { 
  ReactFlow,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
  NodeTypes,
  MarkerType,
  ConnectionMode,
} from "@xyflow/react";
import { getEdgeOptions } from "../FlowEdgeOptions";
import { nodeTypes } from "./FlowNodeTypes";
import { FlowNodeData, NodeStatus, FlowNodeType } from "@/types/flowComponents";
import { Card } from "@/components/ui/card";
import { Sun, Wind, Battery, Factory, Grid, Zap, Cable, Trash2 } from "lucide-react";
import { ComponentsPalette } from "./ComponentsPalette";
import { AssetType, AssetInstance } from "@/types/assets";
import { Plant } from "@/types/site";
import { AssetInstanceDialog } from "./AssetInstanceDialog";
import { useToast } from "@/components/ui/use-toast";
import { assetService } from "@/services/assetService";
import { Button } from '@/components/ui/button';
import { NodeDetailsSidebar } from './NodeDetailsSidebar';
import EdgeDialog from "../EdgeDialog";

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
  plantId?: string;
  siteId: string;
  site: {
    id: string;
    plants: Plant[];
  };
}

interface ExtendedEdge extends Edge {
  source: string;
  target: string;
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
  plantId,
  siteId,
  site,
}) => {
  const reactFlowInstance = useReactFlow();
  const { toast } = useToast();
  const [draggedAsset, setDraggedAsset] = useState<AssetType | null>(null);
  const [showAssetDialog, setShowAssetDialog] = useState(false);
  const [dropPosition, setDropPosition] = useState({ x: 0, y: 0 });
  const [existingInstances, setExistingInstances] = useState<AssetInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node<FlowNodeData> | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<ExtendedEdge | null>(null);

  const edgeOptions = useMemo(() => getEdgeOptions({
    flowData,
    faults,
    efficiencyMetrics,
    edges,
  }), [flowData, faults, efficiencyMetrics, edges]);

  const handleDragStart = (event: React.DragEvent, assetType: AssetType) => {
    setDraggedAsset(assetType);
    event.dataTransfer.setData('application/reactflow', assetType.normalizedName);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    async (event: DragEvent) => {
      event.preventDefault();

      if (!draggedAsset) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      setDropPosition(position);
      setIsLoading(true);

      try {
        const instances = await assetService.getAssetInstances(plantId, draggedAsset.id);
        setExistingInstances(instances);
        setShowAssetDialog(true);
      } catch (error) {
        console.error('Error fetching asset instances:', error);
        toast({
          title: "Error",
          description: "Failed to fetch asset instances. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [draggedAsset, reactFlowInstance, plantId, toast]
  );

  const handleSelectInstance = async (instance: AssetInstance) => {
    if (!draggedAsset) return;

    const nodeType = draggedAsset.normalizedName === 'source' ? 'solar array' : draggedAsset.normalizedName;

    const newNode: Node<FlowNodeData> = {
      id: instance.id,
      type: nodeType as FlowNodeType,
      position: dropPosition,
      data: {
        id: instance.id,
        label: instance.name,
        type: nodeType as FlowNodeType,
        specs: instance.dynamicAttributes || {},
        status: instance.status as NodeStatus || 'active',
        onNodeClick: (id: string, type: string) => {
          const node = nodes.find(n => n.id === id);
          if (node) {
            customOnNodeClick({} as React.MouseEvent, node);
          }
        },
      },
      draggable: isEditMode,
      connectable: isEditMode,
    };

    setNodes((nds: Node<FlowNodeData>[]) => [...nds, newNode]);
    setDraggedAsset(null);
    setShowAssetDialog(false);
  };

  const handleCreateNew = async (plantId?: string, attributes: Record<string, any> = {}) => {
    if (!draggedAsset) {
      toast({
        title: "Error",
        description: "No asset type selected.",
        variant: "destructive",
      });
      return;
    }

    try {
      // For consumer and grid, we don't need to create an asset instance
      if (draggedAsset.normalizedName === 'consumer' || draggedAsset.normalizedName === 'grid') {
        const newNode: Node<FlowNodeData> = {
          id: `${draggedAsset.normalizedName}-${Date.now()}`,
          type: draggedAsset.normalizedName as FlowNodeType,
          position: dropPosition,
          data: {
            id: `${draggedAsset.normalizedName}-${Date.now()}`,
            label: attributes.name || `New ${draggedAsset.name}`,
            type: draggedAsset.normalizedName as FlowNodeType,
            specs: {
              ...attributes,
              power: 0,
              efficiency: 100,
            },
            status: 'active' as NodeStatus,
            onNodeClick: (id: string, type: string) => {
              const node = nodes.find(n => n.id === id);
              if (node) {
                customOnNodeClick({} as React.MouseEvent, node);
              }
            },
          },
          draggable: isEditMode,
          connectable: isEditMode,
        };
        setNodes((nds) => [...nds, newNode]);
        setDraggedAsset(null);
        setShowAssetDialog(false);
        return;
      }

      // For other components, create an asset instance
      const newInstance = await assetService.createAssetInstance({
        typeId: draggedAsset.id,
        name: attributes.name || `New ${draggedAsset.name}`,
        plantId: plantId || undefined,
        dynamicAttributes: {
          ...attributes,
          power: 0,
          efficiency: 100,
        },
        componentType: draggedAsset.normalizedName,
      });

      handleSelectInstance(newInstance);
      toast({
        title: "Success",
        description: "New asset created successfully",
      });
    } catch (error) {
      console.error('Error creating asset:', error);
      toast({
        title: "Error",
        description: "Failed to create new asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onConnect = useCallback((connection: Connection) => {
    // Validate connection based on node types
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    
    if (!sourceNode || !targetNode) {
      console.log('Missing nodes:', { sourceNode, targetNode });
      return;
    }

    const sourceType = sourceNode.type as FlowNodeType;
    const targetType = targetNode.type as FlowNodeType;

    console.log('Attempting connection:', {
      sourceNode: {
        id: sourceNode.id,
        type: sourceType,
        label: sourceNode.data?.label
      },
      targetNode: {
        id: targetNode.id,
        type: targetType,
        label: targetNode.data?.label
      }
    });

    // Define valid connections
    const isValidConnection = (source: FlowNodeType, target: FlowNodeType) => {
      const validConnections: Record<FlowNodeType, FlowNodeType[]> = {
        'solar array': ['inverter', 'transformer'],
        'solar panel': ['inverter', 'transformer'],
        'wind turbine': ['inverter', 'transformer'],
        'battery': ['inverter', 'transformer', 'grid', 'consumer'],
        'bess': ['inverter', 'transformer', 'grid', 'consumer'],
        'inverter': ['transformer', 'grid', 'consumer', 'battery', 'bess'],
        'transformer': ['grid', 'consumer', 'battery', 'bess'],
        'grid': ['consumer', 'battery', 'bess'],
        'consumer': [],
        'sensor': ['solar panel', 'wind turbine', 'battery', 'bess', 'inverter', 'transformer', 'grid', 'consumer'],
        'scada system': ['solar panel', 'wind turbine', 'battery', 'bess', 'inverter', 'transformer', 'grid', 'consumer']
      };

      console.log('Checking valid connections:', {
        source,
        target,
        allowedTargets: validConnections[source],
        isValid: validConnections[source]?.includes(target)
      });

      return validConnections[source]?.includes(target) || false;
    };

    if (!isValidConnection(sourceType, targetType)) {
      toast({
        title: "Invalid Connection",
        description: `Cannot connect ${sourceType.replace('-', ' ')} to ${targetType.replace('-', ' ')}`,
        variant: "destructive",
      });
      return;
    }

    // Create edge with default settings
    const newEdge: Edge = {
      ...connection,
      id: `${connection.source}-to-${connection.target}`,
      animated: true,
      style: { strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed },
      label: '0.0 kW',
      labelStyle: { fill: 'black', fontWeight: 500, fontSize: 12 },
      labelBgStyle: { fill: 'white', opacity: 0.8 },
    };

    setEdges(eds => [...eds, newEdge]);
  }, [nodes, toast]);

  const handleDeleteNode = useCallback(async (nodeId: string) => {
    if (!isEditMode) return;

    try {
      // Delete connected edges first
      const connectedEdges = edges.filter(
        edge => edge.source === nodeId || edge.target === nodeId
      );
      setEdges(eds => eds.filter(
        edge => edge.source !== nodeId && edge.target !== nodeId
      ));

      // Delete the node
      setNodes(nds => nds.filter(node => node.id !== nodeId));

      // Delete the asset instance from the database
      await assetService.deleteAssetInstance(nodeId);

      toast({
        title: "Success",
        description: "Asset deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: "Error",
        description: "Failed to delete asset. Please try again.",
        variant: "destructive",
      });
    }
  }, [isEditMode, edges, toast]);

  const handleDeleteEdge = useCallback((edgeId: string) => {
    if (!isEditMode) return;
    setEdges(eds => eds.filter(edge => edge.id !== edgeId));
    toast({
      title: "Success",
      description: "Connection removed successfully",
    });
  }, [isEditMode, toast]);

  const customOnNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (isEditMode && event.altKey) {
      handleDeleteNode(node.id);
    } else {
      setSelectedNode(node as Node<FlowNodeData>);
    }
  }, [isEditMode, handleDeleteNode]);

  const customOnEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (isEditMode && event.altKey) {
      event.preventDefault();
      handleDeleteEdge(edge.id);
    } else {
      // Find source and target nodes to get their labels
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      const edgeWithNames = {
        ...edge,
        source: sourceNode?.data?.label || 'Unknown Source',
        target: targetNode?.data?.label || 'Unknown Target',
      };
      setSelectedEdge(edgeWithNames);
    }
  }, [isEditMode, handleDeleteEdge, nodes]);

  // Add keyboard event handler for edge deletion
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (isEditMode && event.key === 'Delete') {
      const selectedEdges = edges.filter(edge => edge.selected);
      selectedEdges.forEach(edge => handleDeleteEdge(edge.id));
    }
  }, [isEditMode, edges, handleDeleteEdge]);

  // Add effect for keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Add site validation
  const validSite = useMemo(() => {
    return site && site.id && Array.isArray(site.plants) ? site : { id: siteId, plants: [] };
  }, [site, siteId]);

  return (
    <div className="relative w-full h-full">
      {isEditMode && (
        <div className="absolute left-4 top-4 z-10">
          <ComponentsPalette onDragStart={handleDragStart} isEditMode={isEditMode} />
        </div>
      )}

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={(changes) => setNodes((nds) => applyNodeChanges(changes, nds))}
        onEdgesChange={(changes) => setEdges((eds) => applyEdgeChanges(changes, eds))}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        onEdgeClick={customOnEdgeClick}
        onNodeClick={customOnNodeClick}
        defaultEdgeOptions={{
          ...edgeOptions,
          interactionWidth: 20,
          style: { strokeWidth: 2, cursor: 'pointer' },
        }}
        fitView
        deleteKeyCode={isEditMode ? 'Delete' : null}
        selectionKeyCode={null}
        multiSelectionKeyCode="Shift"
        snapToGrid={true}
        snapGrid={[15, 15]}
        connectionMode={ConnectionMode.Loose}
        connectOnClick={isEditMode}
        elementsSelectable={true}
        panOnDrag={true}
        zoomOnScroll={true}
        panOnScroll={false}
        selectNodesOnDrag={false}
      >
        <Background />
        <Controls />
      </ReactFlow>

      <FlowLegend />

      {selectedNode && (
        <NodeDetailsSidebar
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          onDelete={handleDeleteNode}
        />
      )}

      {selectedEdge && (
        <EdgeDialog
          open={!!selectedEdge}
          onClose={() => setSelectedEdge(null)}
          onDelete={handleDeleteEdge}
          isEditMode={isEditMode}
          edgeData={{
            id: selectedEdge.id,
            source: selectedEdge.source,
            target: selectedEdge.target,
            energyFlow: flowData?.[selectedEdge.id]?.currentValue || 0,
            efficiency: efficiencyMetrics?.[selectedEdge.id]?.efficiency || 100,
            status: faults?.[selectedEdge.id] ? 'error' : 'active',
            losses: [
              { type: 'Transmission', value: 1.9 },
              { type: 'Conversion', value: 3.0 },
              { type: 'Resistive', value: 0.8 }
            ],
            faults: faults?.[selectedEdge.id] ? [
              { type: 'error', message: faults[selectedEdge.id].message }
            ] : undefined
          }}
        />
      )}

      {showAssetDialog && draggedAsset && (
        <AssetInstanceDialog
          open={showAssetDialog}
          onClose={() => {
            setShowAssetDialog(false);
            setDraggedAsset(null);
          }}
          assetType={draggedAsset}
          existingInstances={existingInstances}
          onSelectInstance={handleSelectInstance}
          onCreateNew={handleCreateNew}
          isLoading={isLoading}
          site={site}
        />
      )}
    </div>
  );
};

export default FlowCanvas;