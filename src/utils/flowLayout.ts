import { Node } from "@xyflow/react";
import { FlowNodeData } from "@/types/flowComponents";
import { generateEdges } from "./edgeUtils";

const HORIZONTAL_SPACING = 200;
const VERTICAL_SPACING = 100;

const calculateNodePosition = (column: number, row: number) => ({
  x: column * HORIZONTAL_SPACING,
  y: row * VERTICAL_SPACING,
});

export const getInitialLayout = (sourceCount: number): { nodes: Node<FlowNodeData>[] } => {
  const nodes: Node<FlowNodeData>[] = [];

  // Create an array from sourceCount to iterate over
  Array.from({ length: sourceCount }).forEach((_, sourceIndex) => {
    const baseY = sourceIndex * (VERTICAL_SPACING * 4);
    
    // Add inverter
    nodes.push({
      id: 'inverter-1',
      type: 'inverter',
      position: calculateNodePosition(2, 2),
      data: {
        id: 'inverter-1',
        type: 'inverter',
        label: 'Inverter',
        specs: {
          inputPower: 735,
          outputPower: 720,
          efficiency: 98,
        },
        onNodeClick: () => {},
      },
    });

    // Add transformer
    nodes.push({
      id: 'transformer-1',
      type: 'transformer',
      position: calculateNodePosition(3, 2),
      data: {
        id: 'transformer-1',
        type: 'transformer',
        label: 'Transformer',
        specs: {
          inputVoltage: 720,
          outputVoltage: 230,
          power: 720,
        },
        onNodeClick: () => {},
      },
    });

    // Add storage units
    ['main', 'backup'].forEach((storageType, index) => {
      nodes.push({
        id: `storage-${storageType}`,
        type: 'storage',
        position: calculateNodePosition(4, index * 2 + 1),
        data: {
          id: `storage-${storageType}`,
          type: 'storage',
          label: `${storageType.charAt(0).toUpperCase() + storageType.slice(1)} Storage`,
          specs: {
            maxCapacity: 1000,
            currentCharge: 750,
          },
          onNodeClick: () => {},
        },
      });
    });

    // Add consumers and grid at the same level
    ['residential', 'industrial', 'commercial'].forEach((type, index) => {
      nodes.push({
        id: `consumer-${type}`,
        type: type as 'residential' | 'industrial' | 'commercial',
        position: calculateNodePosition(6, index * 2),
        data: {
          id: `consumer-${type}`,
          type: type as 'residential' | 'industrial' | 'commercial',
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Consumer`,
          consumption: 150 + (index * 100),
          onNodeClick: () => {},
        },
      });
    });

    // Add grid connection at the same level as consumers
    nodes.push({
      id: 'grid',
      type: 'grid',
      position: calculateNodePosition(6, 6),
      data: {
        id: 'grid',
        type: 'grid',
        label: 'Power Grid',
        specs: {
          power: 335,
        },
        onNodeClick: () => {},
      },
    });
  });

  return { nodes };
};

export { generateEdges } from './edgeUtils';