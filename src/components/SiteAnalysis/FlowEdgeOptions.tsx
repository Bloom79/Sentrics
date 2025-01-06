import { Edge, MarkerType } from '@xyflow/react';
import { EnergyFlow } from '@/types/flowComponents';
import { FaultType, EfficiencyMetric } from '@/types/flowTypes';

interface FlowEdgeOptionsProps {
  flowData: { [key: string]: EnergyFlow[] };
  faults: { [key: string]: FaultType[] };
  efficiencyMetrics: { [key: string]: EfficiencyMetric };
  edges: Edge[];
}

export const getEdgeOptions = ({
  flowData,
  faults,
  efficiencyMetrics,
  edges,
}: FlowEdgeOptionsProps): Edge[] => {
  const baseOptions = {
    style: { 
      strokeWidth: 2,
      stroke: '#888',
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#888',
    },
    animated: true,
  };

  return edges.map(edge => ({
    ...edge,
    ...baseOptions,
    style: {
      ...baseOptions.style,
      stroke: faults[edge.id]?.some(f => f.type === 'error') ? '#ef4444' : 
              faults[edge.id]?.some(f => f.type === 'warning') ? '#f59e0b' : 
              '#888',
      opacity: efficiencyMetrics[edge.id]?.efficiency 
        ? (efficiencyMetrics[edge.id].efficiency / 100) 
        : 1,
      strokeWidth: 2,
    },
    label: `${flowData[edge.id]?.[flowData[edge.id].length - 1]?.currentValue.toFixed(1) || '0'} kW (${
      efficiencyMetrics[edge.id]?.efficiency.toFixed(1) || '95'
    }%)`,
    labelStyle: { fill: 'black', fontWeight: 500 },
    labelBgStyle: { fill: 'white', opacity: 0.8 },
  }));
};