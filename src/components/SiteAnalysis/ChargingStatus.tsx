import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, ArrowUp, ArrowDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ChargingStatusProps {
  siteId: string;
}

const ChargingStatus = ({ siteId }: ChargingStatusProps) => {
  // Mock data - replace with real-time data fetch
  const chargingData = {
    currentPower: 45.5,
    direction: "charging" as const,
    batteryLevel: 75,
    timeRemaining: "2.5 hours",
    temperature: 25,
    voltage: 48.2,
    current: 150,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Battery className="h-5 w-5" />
          Real-time Charging Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Battery Level</span>
              <span className="text-sm text-muted-foreground">
                {chargingData.batteryLevel}%
              </span>
            </div>
            <Progress value={chargingData.batteryLevel} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <div className="flex items-center gap-1">
                {chargingData.direction === "charging" ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-amber-500" />
                )}
                <p className="text-sm text-muted-foreground capitalize">
                  {chargingData.direction}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Power</p>
              <p className="text-sm text-muted-foreground">
                {chargingData.currentPower} kW
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Time Remaining</p>
              <p className="text-sm text-muted-foreground">
                {chargingData.timeRemaining}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Temperature</p>
              <p className="text-sm text-muted-foreground">
                {chargingData.temperature}°C
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-1">
              <p className="text-sm font-medium">Voltage</p>
              <p className="text-sm text-muted-foreground">{chargingData.voltage}V</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Current</p>
              <p className="text-sm text-muted-foreground">{chargingData.current}A</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargingStatus;