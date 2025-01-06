import React from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Battery, Power, Sun, Wind } from "lucide-react";
import { Site } from "@/types/site";
import {
  ReactFlow,
  Background,
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
      position: { x: 50, y: 50 + (index * 100) },
      data: {
        label: (
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Sun className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        ),
      },
    })),
    // Wind nodes
    ...windSources.map((source, index) => ({
      id: `wind-${source.id}`,
      type: 'default',
      position: { x: 50, y: 200 + (index * 100) },
      data: {
        label: (
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Wind className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        ),
      },
    })),
    // Storage nodes
    ...site.storageUnits.map((unit, index) => ({
      id: `storage-${unit.id}`,
      type: 'default',
      position: { x: 300, y: 125 + (index * 100) },
      data: {
        label: (
          <div 
            className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg cursor-pointer"
            onClick={() => handleStorageClick(unit.id)}
          >
            <Battery className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        ),
      },
    })),
    // Grid node
    {
      id: 'grid',
      type: 'default',
      position: { x: 550, y: 125 },
      data: {
        label: (
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <Power className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
        ),
      },
    },
  ];

  // Define edges (connections) between nodes
  const edges: Edge[] = [
    // Connect solar nodes to storage
    ...solarSources.flatMap(source => 
      site.storageUnits.map(unit => ({
        id: `solar-${source.id}-to-storage-${unit.id}`,
        source: `solar-${source.id}`,
        target: `storage-${unit.id}`,
        animated: true,
        style: { stroke: '#f59e0b' },
      }))
    ),
    // Connect wind nodes to storage
    ...windSources.flatMap(source => 
      site.storageUnits.map(unit => ({
        id: `wind-${source.id}-to-storage-${unit.id}`,
        source: `wind-${source.id}`,
        target: `storage-${unit.id}`,
        animated: true,
        style: { stroke: '#3b82f6' },
      }))
    ),
    // Connect storage to grid
    ...site.storageUnits.map(unit => ({
      id: `storage-${unit.id}-to-grid`,
      source: `storage-${unit.id}`,
      target: 'grid',
      animated: true,
      style: { stroke: '#6366f1' },
    })),
  ];

  return (
    <div className="relative h-[300px] bg-background/50 rounded-lg p-6 border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default EnergyFlowVisualization;