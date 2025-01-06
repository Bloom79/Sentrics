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
        <div className="flex items-center gap-2">
          <span className="font-medium">Current:</span>
          <span className={`${
            flow.currentValue > 500 ? 'text-green-600' :
            flow.currentValue > 200 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {flow.currentValue.toFixed(1)} kW
          </span>
        </div>
        <div>Max: {flow.maxValue.toFixed(1)} kW</div>
        <div>Min: {flow.minValue.toFixed(1)} kW</div>
        <div>Average: {flow.avgValue.toFixed(1)} kW</div>
        <div className="text-xs text-muted-foreground mt-1">
          Last updated: {flow.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default FlowEdgeTooltip;