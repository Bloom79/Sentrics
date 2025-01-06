import React from "react";
import { ReactFlow, Controls, Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Site } from "@/types/site";
import SourceNode from "./FlowNodes/SourceNode";
import StorageNode from "./FlowNodes/StorageNode";
import ConsumerNode from "./FlowNodes/ConsumerNode";
import GridNode from "./FlowNodes/GridNode";

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
      },
    })),

    // Storage nodes
    ...site.storageUnits.map((unit, index) => ({
      id: `storage-${unit.id}`,
      type: "storage",
      position: { x: 300, y: 100 + (index * 120) },
      data: {
        id: unit.id,
        charge: unit.currentCharge,
        capacity: unit.capacity,
      },
    })),

    // Grid node
    {
      id: "grid",
      type: "grid",
      position: { x: 550, y: 200 },
      data: {
        delivery: 300, // Mock data
      },
    },

    // Consumer nodes
    {
      id: "residential",
      type: "consumer",
      position: { x: 550, y: 50 },
      data: {
        type: "residential",
        consumption: 200, // Mock data
      },
    },
    {
      id: "industrial",
      type: "consumer",
      position: { x: 550, y: 200 },
      data: {
        type: "industrial",
        consumption: 450, // Mock data
      },
    },
    {
      id: "commercial",
      type: "consumer",
      position: { x: 550, y: 350 },
      data: {
        type: "commercial",
        consumption: 350, // Mock data
      },
    },
  ];

  const edges: Edge[] = [
    // Connect sources to storage
    ...site.energySources.flatMap(source =>
      site.storageUnits.map(unit => ({
        id: `${source.id}-to-${unit.id}`,
        source: `source-${source.id}`,
        target: `storage-${unit.id}`,
        animated: true,
        style: { stroke: source.type === "solar" ? "#f59e0b" : "#3b82f6" },
      }))
    ),

    // Connect storage to grid and consumers
    ...site.storageUnits.flatMap(unit => [
      {
        id: `${unit.id}-to-grid`,
        source: `storage-${unit.id}`,
        target: "grid",
        animated: true,
        style: { stroke: "#8b5cf6" },
      },
      {
        id: `${unit.id}-to-residential`,
        source: `storage-${unit.id}`,
        target: "residential",
        animated: true,
        style: { stroke: "#8b5cf6" },
      },
      {
        id: `${unit.id}-to-industrial`,
        source: `storage-${unit.id}`,
        target: "industrial",
        animated: true,
        style: { stroke: "#8b5cf6" },
      },
      {
        id: `${unit.id}-to-commercial`,
        source: `storage-${unit.id}`,
        target: "commercial",
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
    </div>
  );
};

export default EnergyFlowVisualization;