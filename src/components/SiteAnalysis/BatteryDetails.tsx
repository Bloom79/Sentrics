import React from "react";
import { Progress } from "@/components/ui/progress";
import { BatteryDetail } from "@/types/battery";
import ChargingDirection from "./ChargingDirection";

interface BatteryDetailsProps {
  battery: BatteryDetail;
}

const BatteryDetails: React.FC<BatteryDetailsProps> = ({ battery }) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{battery.name}</span>
          <span className="text-sm text-muted-foreground">
            {battery.batteryLevel}%
          </span>
        </div>
        <Progress value={battery.batteryLevel} className="h-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium">Status</p>
          <div className="flex items-center gap-1">
            <ChargingDirection direction={battery.direction} />
            <p className="text-sm text-muted-foreground capitalize">
              {battery.direction}
            </p>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Power</p>
          <p className="text-sm text-muted-foreground">
            {battery.currentPower} kW
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Time Remaining</p>
          <p className="text-sm text-muted-foreground">
            {battery.timeRemaining}
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Temperature</p>
          <p className="text-sm text-muted-foreground">
            {battery.temperature}°C
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="space-y-1">
          <p className="text-sm font-medium">Voltage</p>
          <p className="text-sm text-muted-foreground">
            {battery.voltage}V
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Current</p>
          <p className="text-sm text-muted-foreground">
            {battery.current}A
          </p>
        </div>
      </div>
    </div>
  );
};

export default BatteryDetails;