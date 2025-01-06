import React, { useState, useCallback } from "react";
import { ReactFlow, Controls, Node, Edge, MarkerType } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Site } from "@/types/site";
import SourceNode from "./FlowNodes/SourceNode";
import StorageNode from "./FlowNodes/StorageNode";
import ConsumerNode from "./FlowNodes/ConsumerNode";
import GridNode from "./FlowNodes/GridNode";
import CellNode from "./FlowNodes/CellNode";
import StringNode from "./FlowNodes/StringNode";
import InverterNode from "./FlowNodes/InverterNode";
import TransformerNode from "./FlowNodes/TransformerNode";
import NodeDialog from "./NodeDialog";
import EdgeDialog from "./EdgeDialog";
import { getInitialLayout } from "@/utils/flowLayout";

interface EnergyFlowVisualizationProps {
  site: Site;
}

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

const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = ({ site }) => {
  const [selectedNodes, setSelectedNodes] = useState<Array<{ id: string; type: string }>>([]);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  const handleNodeClick = (nodeId: string, nodeType: string) => {
    const existingNodeIndex = selectedNodes.findIndex(node => node.id === nodeId);
    if (existingNodeIndex >= 0) {
      setSelectedNodes(prev => prev.filter((_, index) => index !== existingNodeIndex));
    } else {
      setSelectedNodes(prev => [...prev, { id: nodeId, type: nodeType }]);
    }
  };

  const handleEdgeClick = (_: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge);
  };

  const { nodes, edges } = React.useMemo(() => {
    const layout = getInitialLayout(site.energySources.length);
    
    // Add click handlers to nodes
    const nodesWithHandlers = layout.nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        onNodeClick: handleNodeClick,
      },
    }));

    // Add animated edges between components
    const edgesWithAnimation = generateEdges(layout.nodes);

    return {
      nodes: nodesWithHandlers,
      edges: edgesWithAnimation,
    };
  }, [site.energySources.length]);

  return (
    <div className="relative h-[600px] bg-background/50 rounded-lg p-6 border">
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
      
      {selectedNodes.map((node, index) => (
        <NodeDialog
          key={node.id}
          open={true}
          onClose={() => {
            setSelectedNodes(prev => prev.filter((_, i) => i !== index));
          }}
          nodeType={node.type}
          nodeId={node.id}
        />
      ))}

      {selectedEdge && (
        <EdgeDialog
          open={true}
          onClose={() => setSelectedEdge(null)}
          edgeData={{
            id: selectedEdge.id,
            source: selectedEdge.source,
            target: selectedEdge.target,
            ...((selectedEdge.data as any) || {
              energyFlow: 0,
              efficiency: 0,
              status: 'inactive',
            }),
          }}
        />
      )}
    </div>
  );
};

const generateEdges = (nodes: Node[]): Edge[] => {
  const edges: Edge[] = [];
  
  // Helper to find node by type
  const findNodesByType = (type: string) => nodes.filter(n => n.data.type === type);
  
  // Connect cells to strings
  const cells = findNodesByType('cell');
  const strings = findNodesByType('string');
  
  cells.forEach(cell => {
    const cellIndex = parseInt(cell.id.split('-')[2]);
    const stringId = `string-${cell.id.split('-')[1]}`;
    
    edges.push({
      id: `${cell.id}-to-${stringId}`,
      source: cell.id,
      target: stringId,
      animated: true,
      style: { stroke: '#f59e0b' },
      data: {
        energyFlow: 250,
        efficiency: 98,
        status: 'active' as const,
        type: 'solar',
      },
    });
  });

  // Connect strings to inverter
  strings.forEach(string => {
    edges.push({
      id: `${string.id}-to-inverter`,
      source: string.id,
      target: 'inverter-1',
      animated: true,
      style: { stroke: '#f59e0b' },
      data: {
        energyFlow: 750,
        efficiency: 98,
        status: 'active' as const,
        type: 'solar',
      },
    });
  });

  // Connect inverter to transformer
  edges.push({
    id: 'inverter-to-transformer',
    source: 'inverter-1',
    target: 'transformer-1',
    animated: true,
    style: { stroke: '#8b5cf6' },
    data: {
      energyFlow: 735,
      efficiency: 98,
      status: 'active' as const,
      type: 'power',
    },
  });

  // Connect transformer to storage units and grid
  const storageUnits = findNodesByType('storage');
  storageUnits.forEach(storage => {
    edges.push({
      id: `transformer-to-${storage.id}`,
      source: 'transformer-1',
      target: storage.id,
      animated: true,
      style: { stroke: '#3b82f6' },
      data: {
        energyFlow: 400,
        efficiency: 95,
        status: 'active' as const,
        type: 'storage',
      },
    });
  });

  // Connect transformer to grid
  edges.push({
    id: 'transformer-to-grid',
    source: 'transformer-1',
    target: 'grid',
    animated: true,
    style: { stroke: '#10b981' },
    data: {
      energyFlow: 335,
      efficiency: 95,
      status: 'active' as const,
      type: 'grid',
    },
  });

  // Connect storage units to consumers and grid
  const consumers = findNodesByType('consumer');
  storageUnits.forEach(storage => {
    // Connect to grid
    edges.push({
      id: `${storage.id}-to-grid`,
      source: storage.id,
      target: 'grid',
      animated: true,
      style: { stroke: '#3b82f6' },
      data: {
        energyFlow: 200,
        efficiency: 95,
        status: 'active' as const,
        type: 'grid',
      },
    });

    // Connect to consumers
    consumers.forEach(consumer => {
      edges.push({
        id: `${storage.id}-to-${consumer.id}`,
        source: storage.id,
        target: consumer.id,
        animated: true,
        style: { stroke: '#10b981' },
        data: {
          energyFlow: 150,
          efficiency: 95,
          status: 'active' as const,
          type: 'consumption',
        },
      });
    });
  });

  return edges;
};

export default EnergyFlowVisualization;