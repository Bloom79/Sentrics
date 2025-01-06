import React, { useState } from "react";
import { ReactFlow, Controls, Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Site } from "@/types/site";
import SourceNode from "./FlowNodes/SourceNode";
import StorageNode from "./FlowNodes/StorageNode";
import ConsumerNode from "./FlowNodes/ConsumerNode";
import GridNode from "./FlowNodes/GridNode";
import NodeDialog from "./NodeDialog";

interface EnergyFlowVisualizationProps {
  site: Site;
}

const nodeTypes = {
  source: SourceNode,
  storage: StorageNode,
  consumer: ConsumerNode,
  grid: GridNode,
};

const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = ({ site }) => {
  const [selectedNodes, setSelectedNodes] = useState<Array<{ id: string; type: string }>>([]);

  const handleNodeClick = (nodeId: string, nodeType: string) => {
    const existingNodeIndex = selectedNodes.findIndex(node => node.id === nodeId);
    
    if (existingNodeIndex >= 0) {
      // Remove node if already selected
      setSelectedNodes(prev => prev.filter((_, index) => index !== existingNodeIndex));
    } else {
      // Add new node to selection
      setSelectedNodes(prev => [...prev, { id: nodeId, type: nodeType }]);
    }
  };

  const nodes: Node[] = [
    // Solar and Wind nodes
    ...site.energySources.map((source, index) => ({
      id: `source-${source.id}`,
      type: "source",
      position: { x: 50, y: 50 + (index * 120) },
      data: {
        type: source.type,
        output: source.currentOutput,
        capacity: source.capacity,
        onNodeClick: handleNodeClick,
      },
    })),

    // Multiple Storage nodes
    ...[1, 2, 3].map((_, index) => ({
      id: `storage-${index + 1}`,
      type: "storage",
      position: { x: 300, y: 50 + (index * 120) },
      data: {
        id: `${index + 1}`,
        charge: 750,
        capacity: 1000,
        onNodeClick: handleNodeClick,
      },
    })),

    // Grid and Consumer nodes at the same level
    {
      id: "grid",
      type: "grid",
      position: { x: 550, y: 200 },
      data: {
        delivery: 300,
        onNodeClick: handleNodeClick,
      },
    },
    {
      id: "residential",
      type: "consumer",
      position: { x: 550, y: 50 },
      data: {
        type: "residential",
        consumption: 200,
        onNodeClick: handleNodeClick,
      },
    },
    {
      id: "industrial",
      type: "consumer",
      position: { x: 550, y: 350 },
      data: {
        type: "industrial",
        consumption: 450,
        onNodeClick: handleNodeClick,
      },
    },
  ];

  const edges: Edge[] = [
    // Connect sources to all storage units
    ...site.energySources.flatMap(source =>
      [1, 2, 3].map((storageIndex) => ({
        id: `${source.id}-to-storage-${storageIndex}`,
        source: `source-${source.id}`,
        target: `storage-${storageIndex}`,
        animated: true,
        style: { stroke: source.type === "solar" ? "#f59e0b" : "#3b82f6" },
      }))
    ),

    // Connect storage units to grid and consumers
    ...[1, 2, 3].flatMap(storageIndex => [
      {
        id: `storage-${storageIndex}-to-grid`,
        source: `storage-${storageIndex}`,
        target: "grid",
        animated: true,
        style: { stroke: "#8b5cf6" },
      },
      {
        id: `storage-${storageIndex}-to-residential`,
        source: `storage-${storageIndex}`,
        target: "residential",
        animated: true,
        style: { stroke: "#8b5cf6" },
      },
      {
        id: `storage-${storageIndex}-to-industrial`,
        source: `storage-${storageIndex}`,
        target: "industrial",
        animated: true,
        style: { stroke: "#8b5cf6" },
      },
    ]),
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
        elementsSelectable={false}
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
    </div>
  );
};

export default EnergyFlowVisualization;