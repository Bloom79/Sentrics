import { Edge, MarkerType } from '@xyflow/react';
import { Node } from '@xyflow/react';
import { FlowNodeData, EnergyFlow } from '@/types/flowComponents';

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

const generateFlowData = (baseValue: number): EnergyFlow => ({
  currentValue: baseValue,
  maxValue: baseValue * 1.2,
  minValue: baseValue * 0.8,
  avgValue: baseValue,
  timestamp: new Date(),
});

export const generateEdges = (nodes: Node<FlowNodeData>[]) => {
  const edges: Edge[] = [];

  // Connect cells to strings (typical solar panel: 250-400W per panel)
  nodes.forEach(node => {
    if (node.type === 'cell') {
      const stringId = `string-${node.id.split('-')[1]}`;
      edges.push({
        id: `${node.id}-to-${stringId}`,
        source: node.id,
        target: stringId,
        animated: true,
        style: getEdgeStyle(350),
        data: {
          energyFlow: generateFlowData(350), // 350W per panel
          efficiency: 98,
          status: 'active' as const,
          type: 'solar' as const,
        },
      });
    }
  });

  // Connect strings to inverter (combining multiple panels ~750W per string)
  nodes.forEach(node => {
    if (node.type === 'string') {
      edges.push({
        id: `${node.id}-to-inverter`,
        source: node.id,
        target: 'inverter-1',
        animated: true,
        style: getEdgeStyle(750),
        data: {
          energyFlow: generateFlowData(750), // 750W per string
          efficiency: 98,
          status: 'active' as const,
          type: 'solar' as const,
        },
      });
    }
  });

  // Connect inverter to transformer (DC to AC conversion ~735W)
  edges.push({
    id: 'inverter-to-transformer',
    source: 'inverter-1',
    target: 'transformer-1',
    animated: true,
    style: getEdgeStyle(735),
    data: {
      energyFlow: generateFlowData(735), // 735W after inverter losses
      efficiency: 98,
      status: 'active' as const,
      type: 'power' as const,
    },
  });

  // Connect transformer to storage and grid (split flow)
  ['main', 'backup'].forEach(storageType => {
    edges.push({
      id: `transformer-to-storage-${storageType}`,
      source: 'transformer-1',
      target: `storage-${storageType}`,
      animated: true,
      style: getEdgeStyle(360),
      data: {
        energyFlow: generateFlowData(360), // Split flow to storage
        efficiency: 98,
        status: 'active' as const,
        type: 'storage' as const,
      },
    });
  });

  // Connect storage and grid to consumers with realistic values
  ['residential', 'industrial', 'commercial'].forEach((consumerType, index) => {
    const storageType = index === 0 ? 'main' : 'backup';
    const consumerLoad = [150, 250, 350][index]; // Increasing loads for different consumer types

    edges.push({
      id: `storage-${storageType}-to-consumer-${consumerType}`,
      source: `storage-${storageType}`,
      target: `consumer-${consumerType}`,
      animated: true,
      style: getEdgeStyle(consumerLoad),
      data: {
        energyFlow: generateFlowData(consumerLoad),
        efficiency: 98,
        status: 'active' as const,
        type: 'consumption' as const,
      },
    });

    // Grid backup connection
    edges.push({
      id: `grid-to-consumer-${consumerType}`,
      source: 'grid',
      target: `consumer-${consumerType}`,
      animated: true,
      style: getEdgeStyle(consumerLoad * 0.3), // Grid provides 30% backup
      data: {
        energyFlow: generateFlowData(consumerLoad * 0.3),
        efficiency: 98,
        status: 'active' as const,
        type: 'grid' as const,
      },
    });
  });

  return edges;
};