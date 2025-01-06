import { Node } from "@xyflow/react";
import { FlowNodeData, ConsumerType } from "@/types/flowComponents";

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
          id: `cell-${sourceIndex}-${i}`,
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
        id: `string-${sourceIndex}`,
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
      id: 'inverter-1',
      type: 'inverter',
      label: 'Inverter',
      specs: {
        power: 735,
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
      id: 'grid',
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
      type: 'consumer',
      position: calculateNodePosition(6, index * 2 + 1),
      data: {
        id: `consumer-${type}`,
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
  if (flow > 500) {
    return { 
      stroke: '#22c55e',  // Green for high flow
      strokeWidth: 3,
      opacity: 0.8
    };
  }
  if (flow > 200) {
    return { 
      stroke: '#eab308',  // Yellow for medium flow
      strokeWidth: 2,
      opacity: 0.8
    };
  }
  return { 
    stroke: '#ef4444',  // Red for low flow
    strokeWidth: 1,
    opacity: 0.8
  };
};

export const generateEdges = (nodes: Node<FlowNodeData>[]) => {
  const edges = [];

  // Connect cells to strings
  nodes.forEach(node => {
    if (node.type === 'cell') {
      const stringId = `string-${node.id.split('-')[1]}`;
      edges.push({
        id: `${node.id}-to-${stringId}`,
        source: node.id,
        target: stringId,
        animated: true,
        style: getEdgeStyle(250),
        data: {
          energyFlow: {
            currentValue: 250,
            maxValue: 300,
            minValue: 200,
            avgValue: 250,
            timestamp: new Date(),
          },
          efficiency: 98,
          status: 'active' as const,
          type: 'solar' as const,
        },
      });
    }
  });

  // Connect strings to inverter
  nodes.forEach(node => {
    if (node.type === 'string') {
      edges.push({
        id: `${node.id}-to-inverter`,
        source: node.id,
        target: 'inverter-1',
        animated: true,
        style: getEdgeStyle(750),
        data: {
          energyFlow: {
            currentValue: 750,
            maxValue: 800,
            minValue: 700,
            avgValue: 750,
            timestamp: new Date(),
          },
          efficiency: 98,
          status: 'active' as const,
          type: 'solar' as const,
        },
      });
    }
  });

  // Connect inverter to transformer
  edges.push({
    id: 'inverter-to-transformer',
    source: 'inverter-1',
    target: 'transformer-1',
    animated: true,
    style: getEdgeStyle(735),
    data: {
      energyFlow: {
        currentValue: 735,
        maxValue: 750,
        minValue: 720,
        avgValue: 735,
        timestamp: new Date(),
      },
      efficiency: 98,
      status: 'active' as const,
      type: 'power' as const,
    },
  });

  // Connect transformer to storage and grid
  ['main', 'backup'].forEach(storageType => {
    edges.push({
      id: `transformer-to-storage-${storageType}`,
      source: 'transformer-1',
      target: `storage-${storageType}`,
      animated: true,
      style: getEdgeStyle(360),
      data: {
        energyFlow: {
          currentValue: 360,
          maxValue: 400,
          minValue: 320,
          avgValue: 360,
          timestamp: new Date(),
        },
        efficiency: 98,
        status: 'active' as const,
        type: 'storage' as const,
      },
    });
  });

  // Connect storage and grid to consumers
  ['residential', 'industrial', 'commercial'].forEach((consumerType, index) => {
    const storageType = index === 0 ? 'main' : 'backup';
    edges.push({
      id: `storage-${storageType}-to-consumer-${consumerType}`,
      source: `storage-${storageType}`,
      target: `consumer-${consumerType}`,
      animated: true,
      style: getEdgeStyle(150 + index * 100),
      data: {
        energyFlow: {
          currentValue: 150 + index * 100,
          maxValue: 200 + index * 100,
          minValue: 100 + index * 100,
          avgValue: 150 + index * 100,
          timestamp: new Date(),
        },
        efficiency: 98,
        status: 'active' as const,
        type: 'consumption' as const,
      },
    });

    // Connect grid to consumers
    edges.push({
      id: `grid-to-consumer-${consumerType}`,
      source: 'grid',
      target: `consumer-${consumerType}`,
      animated: true,
      style: getEdgeStyle(100 + index * 50),
      data: {
        energyFlow: {
          currentValue: 100 + index * 50,
          maxValue: 150 + index * 50,
          minValue: 50 + index * 50,
          avgValue: 100 + index * 50,
          timestamp: new Date(),
        },
        efficiency: 98,
        status: 'active' as const,
        type: 'grid' as const,
      },
    });
  });

  return edges;
};
