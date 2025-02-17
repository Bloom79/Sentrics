import React from 'react';
import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning } from 'lucide-react';
import { FlowNodeData } from '@/types/flowComponents';
import NodeTooltip from "./NodeTooltip";
import StyledFlowNode from "./StyledFlowNode";

interface StorageNodeProps {
  data: FlowNodeData;
}

const StorageNode: React.FC<StorageNodeProps> = ({ data }) => {
  const chargePercentage = data.specs?.currentCharge && data.specs?.maxCapacity 
    ? (data.specs.currentCharge / data.specs.maxCapacity) * 100 
    : 0;

  const getBatteryIcon = () => {
    if (data.status === "charging") return <BatteryCharging className="w-8 h-8 text-green-500" />;
    if (chargePercentage >= 90) return <BatteryFull className="w-8 h-8 text-green-500" />;
    if (chargePercentage >= 50) return <BatteryMedium className="w-8 h-8 text-yellow-500" />;
    if (chargePercentage >= 20) return <BatteryLow className="w-8 h-8 text-orange-500" />;
    return <BatteryWarning className="w-8 h-8 text-red-500" />;
  };

  const tooltipContent = (
    <div>
      <h4 className="font-medium mb-2">Battery Storage Details</h4>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <div>
          <p className="text-muted-foreground">Power Rating</p>
          <p>{data.specs?.powerRating || 0} kW</p>
        </div>
        <div>
          <p className="text-muted-foreground">Energy Capacity</p>
          <p>{data.specs?.maxCapacity || 0} kWh</p>
        </div>
        <div>
          <p className="text-muted-foreground">Temperature</p>
          <p>{data.specs?.temperature || 0}°C</p>
        </div>
        <div>
          <p className="text-muted-foreground">Health</p>
          <p>{data.specs?.health || 0}%</p>
        </div>
        <div>
          <p className="text-muted-foreground">Cycles</p>
          <p>{data.specs?.cycles || 0}</p>
        </div>
      </div>
    </div>
  );

  return (
    <NodeTooltip tooltipContent={tooltipContent}>
      <StyledFlowNode 
        type="both"
        className="min-w-[140px]"
        onClick={() => data.onNodeClick(data.id, 'storage')}
      >
        <div className="flex flex-col items-center gap-2">
          {getBatteryIcon()}
          <span className="text-sm font-medium">{data.label}</span>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold">
              {chargePercentage.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">
              {data.specs?.powerRating || 0} kW / {data.specs?.maxCapacity || 0} kWh
            </span>
          </div>
        </div>
      </StyledFlowNode>
    </NodeTooltip>
  );
};

export default StorageNode;