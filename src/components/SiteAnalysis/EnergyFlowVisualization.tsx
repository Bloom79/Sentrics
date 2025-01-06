import React from "react";
import { useNavigate } from "react-router-dom";
import { Battery, Power, Sun, Wind, Users, Factory, Building2 } from "lucide-react";
import { Site } from "@/types/site";
import {
  ReactFlow,
  Controls,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface EnergyFlowVisualizationProps {
  site: Site;
}

const EnergyFlowVisualization: React.FC<EnergyFlowVisualizationProps> = ({ site }) => {
  const navigate = useNavigate();

  const handleStorageClick = (unitId: string) => {
    navigate(`/storage-unit/${unitId}`);
  };

  const solarSources = site.energySources.filter(source => source.type === "solar");
  const windSources = site.energySources.filter(source => source.type === "eolic");

  // Define nodes for the flow diagram
  const nodes: Node[] = [
    // Solar nodes
    ...solarSources.map((source, index) => ({
      id: `solar-${source.id}`,
      type: 'default',
      position: { x: 50, y: 50 + (index * 120) },
      data: {
        label: (
          <div className="flex flex-col items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <Sun className="w-8 h-8 text-yellow-500" />
            <span className="text-xs font-medium">Solar Plant {index + 1}</span>
          </div>
        ),
      },
    })),

    // Wind nodes
    ...windSources.map((source, index) => ({
      id: `wind-${source.id}`,
      type: 'default',
      position: { x: 50, y: 250 + (index * 120) },
      data: {
        label: (
          <div className="flex flex-col items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <Wind className="w-8 h-8 text-blue-500" />
            <span className="text-xs font-medium">Wind Farm {index + 1}</span>
          </div>
        ),
      },
    })),

    // Storage nodes - Let's add 3 storage units for visualization
    ...[1, 2, 3].map((_, index) => ({
      id: `storage-${index}`,
      type: 'default',
      position: { x: 300, y: 100 + (index * 120) },
      data: {
        label: (
          <div 
            className="flex flex-col items-center gap-2 p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800 cursor-pointer"
            onClick={() => handleStorageClick(index.toString())}
          >
            <Battery className="w-8 h-8 text-purple-500" />
            <span className="text-xs font-medium">Storage {index + 1}</span>
          </div>
        ),
      },
    })),

    // Grid node
    {
      id: 'grid',
      type: 'default',
      position: { x: 550, y: 200 },
      data: {
        label: (
          <div className="flex flex-col items-center gap-2 p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
            <Power className="w-8 h-8 text-red-500" />
            <span className="text-xs font-medium">Power Grid</span>
          </div>
        ),
      },
    },

    // Consumer nodes
    {
      id: 'consumers',
      type: 'default',
      position: { x: 800, y: 50 },
      data: {
        label: (
          <div className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <Users className="w-8 h-8 text-green-500" />
            <span className="text-xs font-medium">Residential</span>
          </div>
        ),
      },
    },
    {
      id: 'industry',
      type: 'default',
      position: { x: 800, y: 200 },
      data: {
        label: (
          <div className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <Factory className="w-8 h-8 text-green-500" />
            <span className="text-xs font-medium">Industrial</span>
          </div>
        ),
      },
    },
    {
      id: 'commercial',
      type: 'default',
      position: { x: 800, y: 350 },
      data: {
        label: (
          <div className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <Building2 className="w-8 h-8 text-green-500" />
            <span className="text-xs font-medium">Commercial</span>
          </div>
        ),
      },
    },
  ];

  // Define edges (connections) between nodes
  const edges: Edge[] = [
    // Connect solar nodes to storage
    ...solarSources.flatMap(source => 
      [0, 1, 2].map(storageIndex => ({
        id: `solar-${source.id}-to-storage-${storageIndex}`,
        source: `solar-${source.id}`,
        target: `storage-${storageIndex}`,
        animated: true,
        style: { stroke: '#f59e0b' },
      }))
    ),
    // Connect wind nodes to storage
    ...windSources.flatMap(source => 
      [0, 1, 2].map(storageIndex => ({
        id: `wind-${source.id}-to-storage-${storageIndex}`,
        source: `wind-${source.id}`,
        target: `storage-${storageIndex}`,
        animated: true,
        style: { stroke: '#3b82f6' },
      }))
    ),
    // Connect storage to grid
    ...[0, 1, 2].map(storageIndex => ({
      id: `storage-${storageIndex}-to-grid`,
      source: `storage-${storageIndex}`,
      target: 'grid',
      animated: true,
      style: { stroke: '#8b5cf6' },
    })),
    // Connect grid to consumers
    {
      id: 'grid-to-consumers',
      source: 'grid',
      target: 'consumers',
      animated: true,
      style: { stroke: '#10b981' },
    },
    {
      id: 'grid-to-industry',
      source: 'grid',
      target: 'industry',
      animated: true,
      style: { stroke: '#10b981' },
    },
    {
      id: 'grid-to-commercial',
      source: 'grid',
      target: 'commercial',
      animated: true,
      style: { stroke: '#10b981' },
    },
  ];

  return (
    <div className="relative h-[500px] bg-background/50 rounded-lg p-6 border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
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