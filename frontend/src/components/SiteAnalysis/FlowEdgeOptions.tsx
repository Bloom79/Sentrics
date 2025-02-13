import { Edge, MarkerType, DefaultEdgeOptions } from '@xyflow/react';
import { EnergyFlow } from '@/types/flowComponents';
import { FaultType, EfficiencyMetric } from '@/types/flowTypes';

interface FlowEdgeOptionsProps {
  flowData?: { [key: string]: EnergyFlow[] };
  faults?: { [key: string]: FaultType[] };
  efficiencyMetrics?: { [key: string]: EfficiencyMetric };
  edges?: Edge[];
}

export const getEdgeOptions = ({
  flowData = {},
  faults = {},
  efficiencyMetrics = {},
  edges = [],
}: FlowEdgeOptionsProps = {}): DefaultEdgeOptions => {
  const baseOptions: DefaultEdgeOptions = {
    style: { 
      strokeWidth: 2,
      stroke: '#64748b', // Default color
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
    animated: true,
  };

  // If no edges or flow data, return default options
  if (!edges.length || !Object.keys(flowData).length) {
    return baseOptions;
  }

  // Calculate average flow color based on existing edges
  const avgFlow = edges.reduce((sum, edge) => {
    const currentFlow = flowData[edge.id]?.[flowData[edge.id]?.length - 1]?.currentValue || 0;
    return sum + currentFlow;
  }, 0) / edges.length;

  const isHighFlow = avgFlow > 500;
  const isMediumFlow = avgFlow > 200;
  
  return {
    ...baseOptions,
    style: {
      ...baseOptions.style,
      stroke: isHighFlow ? '#22c55e' : 
              isMediumFlow ? '#eab308' : 
              '#ef4444',
      strokeWidth: isHighFlow ? 3 : isMediumFlow ? 2 : 1,
      opacity: 0.8,
    },
  };
};