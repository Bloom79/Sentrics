import React from 'react';
import { EnergyFlow } from '@/types/flowComponents';

interface FlowEdgeTooltipProps {
  flow: EnergyFlow;
  sourceLabel: string;
  targetLabel: string;
}

const FlowEdgeTooltip = ({ flow, sourceLabel, targetLabel }: FlowEdgeTooltipProps) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border text-sm">
      <div className="font-medium mb-2">
        {sourceLabel} → {targetLabel}
      </div>
      <div className="space-y-1">
        <div>Current: {flow.currentValue} kW</div>
        <div>Max: {flow.maxValue} kW</div>
        <div>Min: {flow.minValue} kW</div>
        <div>Average: {flow.avgValue} kW</div>
      </div>
    </div>
  );
};

export default FlowEdgeTooltip;