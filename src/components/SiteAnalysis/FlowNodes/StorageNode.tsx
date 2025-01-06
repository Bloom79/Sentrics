import React from "react";
import { Battery, BatteryCharging, BatteryFull, BatteryLow } from "lucide-react";
import StyledFlowNode from "./StyledFlowNode";
import { Progress } from "@/components/ui/progress";

interface StorageNodeProps {
  data: {
    id: string;
    charge: number;
    capacity: number;
    status?: 'charging' | 'discharging' | 'idle';
    temperature?: number;
    health?: number;
    onNodeClick: (id: string, type: string) => void;
  };
}

const StorageNode: React.FC<StorageNodeProps> = ({ data }) => {
  const chargePercentage = (data.charge / data.capacity) * 100;
  
  const getBatteryIcon = () => {
    if (data.status === 'charging') return BatteryCharging;
    if (chargePercentage > 75) return BatteryFull;
    if (chargePercentage < 25) return BatteryLow;
    return Battery;
  };

  const BatteryIcon = getBatteryIcon();

  return (
    <StyledFlowNode 
      type="both" 
      className="bg-purple-50 min-w-[140px]"
      onClick={() => data.onNodeClick(data.id, 'storage')}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="relative">
          <BatteryIcon className="w-8 h-8 text-purple-500" />
          {data.status === 'charging' && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
        </div>
        <div className="text-sm font-medium">Storage Unit</div>
        <div className="w-full px-2">
          <Progress value={chargePercentage} className="h-1.5" />
        </div>
        <div className="grid grid-cols-2 gap-x-3 text-[10px] text-muted-foreground">
          <span>{data.charge}kWh</span>
          <span>{data.capacity}kWh</span>
          {data.temperature && <span>{data.temperature}°C</span>}
          {data.health && <span>{data.health}% Health</span>}
        </div>
      </div>
    </StyledFlowNode>
  );
};

export default StorageNode;