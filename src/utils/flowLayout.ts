import { Node } from "@xyflow/react";
import { FlowNodeData } from "@/types/flowComponents";

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
    
    // Add cells (3 per string)
    for (let i = 0; i < 3; i++) {
      nodes.push({
        id: `cell-${sourceIndex}-${i}`,
        type: 'cell',
        position: calculateNodePosition(0, baseY / VERTICAL_SPACING + i),
        data: {
          type: 'cell',
          label: `Solar Cell ${i + 1}`,
          output: 250,
        },
      });
    }

    // Add string that collects from cells
    nodes.push({
      id: `string-${sourceIndex}`,
      type: 'string',
      position: calculateNodePosition(1, baseY / VERTICAL_SPACING + 1),
      data: {
        type: 'string',
        label: `String ${sourceIndex + 1}`,
        output: 750,
      },
    });
  });

  // Add inverter
  nodes.push({
    id: 'inverter-1',
    type: 'inverter',
    position: calculateNodePosition(2, 2),
    data: {
      type: 'inverter',
      label: 'Inverter',
      output: 735,
    },
  });

  // Add transformer
  nodes.push({
    id: 'transformer-1',
    type: 'transformer',
    position: calculateNodePosition(3, 2),
    data: {
      type: 'transformer',
      label: 'Transformer',
      output: 720,
    },
  });

  // Add storage units
  ['main', 'backup'].forEach((storageType, index) => {
    nodes.push({
      id: `storage-${storageType}`,
      type: 'storage',
      position: calculateNodePosition(4, index * 2 + 1),
      data: {
        type: 'storage',
        label: `${storageType.charAt(0).toUpperCase() + storageType.slice(1)} Storage`,
        capacity: 1000,
        charge: 750,
      },
    });
  });

  // Add grid connection
  nodes.push({
    id: 'grid',
    type: 'grid',
    position: calculateNodePosition(4, 4),
    data: {
      type: 'grid',
      label: 'Power Grid',
      delivery: 335,
    },
  });

  // Add consumers
  ['residential', 'commercial', 'industrial'].forEach((type, index) => {
    nodes.push({
      id: `consumer-${type}`,
      type: 'consumer',
      position: calculateNodePosition(6, index * 2 + 1),
      data: {
        type,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Consumer`,
        consumption: 150 + (index * 100),
      },
    });
  });

  return { nodes };
};