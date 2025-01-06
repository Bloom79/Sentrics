import React from "react";
import { Progress } from "@/components/ui/progress";
import { BatteryDetail } from "@/types/battery";
import ChargingDirection from "./ChargingDirection";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle } from "lucide-react";

interface BatteryDetailsProps {
  battery: BatteryDetail;
}

const BatteryDetails: React.FC<BatteryDetailsProps> = ({ battery }) => {
  const renderMetricCard = (title: string, value: string | number, description?: string) => (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{value}</p>
      {description && (
        <p className="text-xs text-muted-foreground/80">{description}</p>
      )}
    </div>
  );

  return (
    <ScrollArea className="h-[calc(100vh-8rem)]">
      <div className="space-y-6 pr-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Battery Storage (BESS)</h3>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{battery.name}</span>
              <span className="text-sm text-muted-foreground">
                {battery.batteryLevel}%
              </span>
            </div>
            <Progress value={battery.batteryLevel} className="h-2" />
          </div>
        </div>

        <Card className="p-4">
          <h4 className="text-sm font-semibold mb-4">Current Status</h4>
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
            {renderMetricCard("Power", `${battery.currentPower} kW`)}
            {renderMetricCard("Time Remaining", battery.timeRemaining)}
            {renderMetricCard("Temperature", `${battery.temperature}°C`)}
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-semibold mb-4">Battery Health</h4>
          <div className="grid grid-cols-2 gap-4">
            {renderMetricCard(
              "State of Health",
              `${battery.stateOfHealth}%`,
              "Overall condition compared to ideal state"
            )}
            {renderMetricCard(
              "Cycle Count",
              battery.cycleCount,
              "Total charge/discharge cycles"
            )}
            {renderMetricCard(
              "Depth of Discharge",
              `${battery.depthOfDischarge}%`,
              "Current discharge depth"
            )}
            {renderMetricCard(
              "Cell Balance",
              battery.cellBalance === "balanced" ? "Balanced" : "Imbalanced",
              "Status of cell charge levels"
            )}
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-semibold mb-4">Electrical Parameters</h4>
          <div className="grid grid-cols-2 gap-4">
            {renderMetricCard("Voltage", `${battery.voltage}V`)}
            {renderMetricCard("Current", `${battery.current}A`)}
            {renderMetricCard(
              "State of Charge",
              `${battery.batteryLevel}%`,
              "Current energy level"
            )}
            {renderMetricCard(
              "Power Rating",
              `${battery.powerRating}kW`,
              "Maximum power capacity"
            )}
          </div>
        </Card>

        {battery.alerts && battery.alerts.length > 0 && (
          <Card className="p-4 border-yellow-500/50">
            <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Active Alerts
            </h4>
            <div className="space-y-2">
              {battery.alerts.map((alert, index) => (
                <div key={index} className="text-sm text-muted-foreground">
                  {alert}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </ScrollArea>
  );
};

export default BatteryDetails;