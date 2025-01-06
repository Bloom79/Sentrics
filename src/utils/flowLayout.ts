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
          specs: {
            power: 250,
          },
          onNodeClick: () => {},
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
        specs: {
          power: 750,
        },
        onNodeClick: () => {},
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
      specs: {
        power: 735,
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
      type: 'transformer',
      label: 'Transformer',
      specs: {
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
        type: 'storage',
        label: `${storageType.charAt(0).toUpperCase() + storageType.slice(1)} Storage`,
        specs: {
          capacity: 1000,
          charge: 750,
        },
        onNodeClick: () => {},
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
      specs: {
        power: 335,
      },
      onNodeClick: () => {},
    },
  });

  // Add consumers
  ['residential', 'industrial', 'commercial'].forEach((type, index) => {
    nodes.push({
      id: `consumer-${type}`,
      type: type as ConsumerType,
      position: calculateNodePosition(6, index * 2 + 1),
      data: {
        type: type as ConsumerType,
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} Consumer`,
        consumption: 150 + (index * 100),
        onNodeClick: () => {},
      },
    });
  });

  return { nodes };
};

export const getEdgeStyle = (flow: number) => {
  if (flow > 500) return { stroke: '#22c55e', strokeWidth: 3 }; // Green for high flow
  if (flow > 200) return { stroke: '#eab308', strokeWidth: 2 }; // Yellow for medium flow
  return { stroke: '#ef4444', strokeWidth: 1 }; // Red for low flow
};