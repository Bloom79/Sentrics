import React, { useState } from "react";
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
import { FlowNodeData, EnergyFlowEdge } from "@/types/flowComponents";

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

  // Generate nodes for the solar components
  const generateSolarNodes = (): Node[] => {
    const nodes: Node[] = [];
    let yOffset = 50;

    // Add cells
    site.energySources
      .filter(source => source.type === 'solar')
      .forEach((source, sourceIndex) => {
        // Add cells (3 per string)
        for (let i = 0; i < 3; i++) {
          nodes.push({
            id: `cell-${source.id}-${i}`,
            type: 'cell',
            position: { x: 50 + (i * 100), y: yOffset },
            data: {
              type: 'cell',
              label: `Cell ${i + 1}`,
              specs: {
                voltage: 0.6,
                current: 8,
              },
              onNodeClick: handleNodeClick,
            },
          });
        }

        // Add string
        nodes.push({
          id: `string-${source.id}`,
          type: 'string',
          position: { x: 200, y: yOffset + 100 },
          data: {
            type: 'string',
            label: `String ${sourceIndex + 1}`,
            specs: {
              voltage: 1.8,
              current: 8,
            },
            onNodeClick: handleNodeClick,
          },
        });

        yOffset += 200;
      });

    // Add inverter and transformer
    nodes.push({
      id: 'inverter-1',
      type: 'inverter',
      position: { x: 200, y: yOffset },
      data: {
        type: 'inverter',
        label: 'Inverter',
        specs: {
          efficiency: 98,
        },
        onNodeClick: handleNodeClick,
      },
    });

    nodes.push({
      id: 'transformer-1',
      type: 'transformer',
      position: { x: 200, y: yOffset + 100 },
      data: {
        type: 'transformer',
        label: 'Transformer',
        specs: {
          voltage: 400,
        },
        onNodeClick: handleNodeClick,
      },
    });

    return nodes;
  };

  // Generate edges connecting the components
  const generateEdges = (): Edge[] => {
    const edges: Edge[] = [];
    
    // Connect cells to strings
    site.energySources
      .filter(source => source.type === 'solar')
      .forEach((source) => {
        for (let i = 0; i < 3; i++) {
          edges.push({
            id: `cell-${source.id}-${i}-to-string`,
            source: `cell-${source.id}-${i}`,
            target: `string-${source.id}`,
            animated: true,
            style: { stroke: '#f59e0b' },
            data: {
              energyFlow: 250,
              efficiency: 98,
              status: 'active' as const,
              type: 'grid',
            },
          });
        }

        // Connect string to inverter
        edges.push({
          id: `string-${source.id}-to-inverter`,
          source: `string-${source.id}`,
          target: 'inverter-1',
          animated: true,
          style: { stroke: '#f59e0b' },
          data: {
            energyFlow: 750,
            efficiency: 98,
            status: 'active' as const,
            type: 'grid',
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
        type: 'grid',
      },
    });

    // Connect transformer to storage and grid
    edges.push({
      id: 'transformer-to-storage',
      source: 'transformer-1',
      target: 'storage-1',
      animated: true,
      style: { stroke: '#3b82f6' },
      data: {
        energyFlow: 400,
        efficiency: 95,
        status: 'active' as const,
        type: 'storage',
      },
    });

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

    return edges;
  };

  const nodes: Node[] = [
    ...generateSolarNodes(),
    {
      id: "storage-1",
      type: "storage",
      position: { x: 400, y: 200 },
      data: {
        type: "storage",
        label: "Storage Unit",
        onNodeClick: handleNodeClick,
      },
    },
    {
      id: "grid",
      type: "grid",
      position: { x: 600, y: 200 },
      data: {
        type: "grid",
        label: "Power Grid",
        onNodeClick: handleNodeClick,
      },
    },
    {
      id: "consumer",
      type: "consumer",
      position: { x: 600, y: 350 },
      data: {
        type: "consumer",
        label: "Consumer",
        onNodeClick: handleNodeClick,
      },
    },
  ];

  const edges: Edge[] = [
    ...generateEdges(),
    {
      id: "storage-to-grid",
      source: "storage-1",
      target: "grid",
      animated: true,
      style: { stroke: "#3b82f6" },
      data: {
        energyFlow: 200,
        efficiency: 95,
        status: "active" as const,
        type: "grid",
      },
    },
    {
      id: "storage-to-consumer",
      source: "storage-1",
      target: "consumer",
      animated: true,
      style: { stroke: "#10b981" },
      data: {
        energyFlow: 150,
        efficiency: 95,
        status: "active" as const,
        type: "consumption",
      },
    },
  ];

  return (
    <div className="relative h-[500px] bg-background/50 rounded-lg p-6 border">
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

export default EnergyFlowVisualization;
