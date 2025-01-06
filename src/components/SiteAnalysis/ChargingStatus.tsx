import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, ArrowUp, ArrowDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ChargingStatusProps {
  siteId: string;
}

const ChargingStatus = ({ siteId }: ChargingStatusProps) => {
  // Mock data - replace with real-time data fetch
  const aggregatedData = {
    totalCapacity: 300,
    currentTotalCharge: 225,
    averageTemperature: 25.5,
    totalPower: 45.5,
    overallDirection: "charging" as const,
  };

  const batteryDetails = [
    {
      id: "1",
      name: "Battery Unit 1",
      currentPower: 20.5,
      direction: "charging" as const,
      batteryLevel: 85,
      timeRemaining: "1.5 hours",
      temperature: 24,
      voltage: 48.2,
      current: 150,
    },
    {
      id: "2",
      name: "Battery Unit 2",
      currentPower: 15.0,
      direction: "charging" as const,
      batteryLevel: 65,
      timeRemaining: "3 hours",
      temperature: 26,
      voltage: 48.0,
      current: 145,
    },
    {
      id: "3",
      name: "Battery Unit 3",
      currentPower: 10.0,
      direction: "discharging" as const,
      batteryLevel: 75,
      timeRemaining: "4 hours",
      temperature: 25,
      voltage: 47.8,
      current: 140,
    },
  ];

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
          {/* Aggregated View */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Overall System Status</h3>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Total Battery Level</span>
                <span className="text-sm text-muted-foreground">
                  {((aggregatedData.currentTotalCharge / aggregatedData.totalCapacity) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={(aggregatedData.currentTotalCharge / aggregatedData.totalCapacity) * 100} 
                className="h-2" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Overall Status</p>
                <div className="flex items-center gap-1">
                  {aggregatedData.overallDirection === "charging" ? (
                    <ArrowUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-amber-500" />
                  )}
                  <p className="text-sm text-muted-foreground capitalize">
                    {aggregatedData.overallDirection}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Total Power</p>
                <p className="text-sm text-muted-foreground">
                  {aggregatedData.totalPower} kW
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Average Temperature</p>
                <p className="text-sm text-muted-foreground">
                  {aggregatedData.averageTemperature}°C
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Individual Battery Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Individual Battery Status</h3>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-6">
                {batteryDetails.map((battery) => (
                  <div key={battery.id} className="space-y-4">
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
                          {battery.direction === "charging" ? (
                            <ArrowUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDown className="h-4 w-4 text-amber-500" />
                          )}
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
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChargingStatus;