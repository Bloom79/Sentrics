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
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
    animated: true,
  };

  return edges.map(edge => {
    const currentFlow = flowData[edge.id]?.[flowData[edge.id].length - 1]?.currentValue || 0;
    const efficiency = efficiencyMetrics[edge.id]?.efficiency || 95;
    const outputFlow = (currentFlow * efficiency) / 100;
    const isHighFlow = currentFlow > 500;
    const isMediumFlow = currentFlow > 200;
    
    const flowColor = isHighFlow ? '#22c55e' : 
                     isMediumFlow ? '#eab308' : 
                     '#ef4444';

    return {
      ...edge,
      ...baseOptions,
      style: {
        ...baseOptions.style,
        stroke: faults[edge.id]?.some(f => f.type === 'error') ? '#ef4444' : 
                faults[edge.id]?.some(f => f.type === 'warning') ? '#f59e0b' : 
                flowColor,
        strokeWidth: isHighFlow ? 3 : isMediumFlow ? 2 : 1,
        opacity: 0.8,
      },
      markerEnd: {
        ...baseOptions.markerEnd,
        color: flowColor,
      },
      label: `${currentFlow.toFixed(1)} kW → ${outputFlow.toFixed(1)} kW\n${efficiency}% eff`,
      labelBgStyle: { 
        fill: 'white',
        opacity: 0.8,
        rx: 4,
        ry: 4,
      },
      labelStyle: { 
        fill: 'black',
        fontWeight: 500,
        fontSize: 12,
      },
    };
  });
};