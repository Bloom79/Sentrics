import React from "react";
import { Progress } from "@/components/ui/progress";
import { AggregatedData } from "@/types/battery";
import ChargingDirection from "./ChargingDirection";

interface SystemOverviewProps {
  data: AggregatedData;
}

const SystemOverview: React.FC<SystemOverviewProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Overall System Status</h3>
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Total Battery Level</span>
          <span className="text-sm text-muted-foreground">
            {((data.currentTotalCharge / data.totalCapacity) * 100).toFixed(1)}%
          </span>
        </div>
        <Progress 
          value={(data.currentTotalCharge / data.totalCapacity) * 100} 
          className="h-2" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Overall Status</p>
          <div className="flex items-center gap-1">
            <ChargingDirection direction={data.overallDirection} />
            <p className="text-sm text-muted-foreground capitalize">
              {data.overallDirection}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Total Power</p>
          <p className="text-sm text-muted-foreground">
            {data.totalPower} kW
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Average Temperature</p>
          <p className="text-sm text-muted-foreground">
            {data.averageTemperature}°C
          </p>
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;