import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import SystemOverview from "./SystemOverview";
import BatteryDetails from "./BatteryDetails";
import { AggregatedData, BatteryDetail } from "@/types/battery";

interface ChargingStatusProps {
  siteId: string;
}

const ChargingStatus = ({ siteId }: ChargingStatusProps) => {
  // Mock data - replace with real-time data fetch
  const aggregatedData: AggregatedData = {
    totalCapacity: 300,
    currentTotalCharge: 225,
    averageTemperature: 25.5,
    totalPower: 45.5,
    overallDirection: "charging",
  };

  const batteryDetails: BatteryDetail[] = [
    {
      id: "1",
      name: "Battery Unit 1",
      currentPower: 20.5,
      direction: "charging",
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
      direction: "charging",
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
      direction: "discharging",
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
          <SystemOverview data={aggregatedData} />

          <Separator />

          {/* Individual Battery Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Individual Battery Status</h3>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-6">
                {batteryDetails.map((battery) => (
                  <BatteryDetails key={battery.id} battery={battery} />
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