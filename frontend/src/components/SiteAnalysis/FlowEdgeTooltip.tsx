import React from 'react';
import { EnergyFlow } from '@/types/flowComponents';
import { ArrowUpRight, ArrowDownRight, Zap } from 'lucide-react';

interface FlowEdgeTooltipProps {
  flow: EnergyFlow;
  sourceLabel: string;
  targetLabel: string;
  efficiency?: number;
}

const FlowEdgeTooltip = ({ flow, sourceLabel, targetLabel, efficiency = 95 }: FlowEdgeTooltipProps) => {
  const outputFlow = (flow.currentValue * efficiency) / 100;
  const losses = flow.currentValue - outputFlow;
  const isHighFlow = flow.currentValue > 500;
  const isMediumFlow = flow.currentValue > 200;

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border text-sm min-w-[200px]">
      <div className="font-medium mb-2 flex items-center justify-between">
        <span>{sourceLabel} → {targetLabel}</span>
        <Zap className={`w-4 h-4 ${
          isHighFlow ? 'text-green-500' :
          isMediumFlow ? 'text-yellow-500' : 'text-red-500'
        }`} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="w-4 h-4 text-green-500" />
          <span className="font-medium">Input:</span>
          <span>{flow.currentValue.toFixed(1)} kW</span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDownRight className="w-4 h-4 text-blue-500" />
          <span className="font-medium">Output:</span>
          <span>{outputFlow.toFixed(1)} kW</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2 pt-2 border-t">
          <div>
            <span>Efficiency:</span>
            <span className="font-medium ml-1">{efficiency}%</span>
          </div>
          <div>
            <span>Losses:</span>
            <span className="font-medium ml-1">{losses.toFixed(1)} kW</span>
          </div>
          <div>
            <span>Max:</span>
            <span className="font-medium ml-1">{flow.maxValue.toFixed(1)} kW</span>
          </div>
          <div>
            <span>Min:</span>
            <span className="font-medium ml-1">{flow.minValue.toFixed(1)} kW</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Last updated: {flow.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default FlowEdgeTooltip;