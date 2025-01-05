import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, ArrowUp, ArrowDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface StorageStatusProps {
  siteId: string;
}

const StorageStatus = ({ siteId }: StorageStatusProps) => {
  // Mock data - replace with actual API call
  const storageData = {
    capacity: 1000,
    currentCharge: 750,
    status: "charging",
    chargingRate: 45,
    temperature: 25,
    health: 98,
    cycles: 342,
  };

  const chargePercentage = (storageData.currentCharge / storageData.capacity) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Battery className="h-5 w-5" />
          Storage System Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Charge Level</span>
              <span className="text-sm text-muted-foreground">
                {chargePercentage.toFixed(1)}%
              </span>
            </div>
            <Progress value={chargePercentage} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <div className="flex items-center gap-1">
                {storageData.status === "charging" ? (
                  <ArrowUp className="h-4 w-4 text-green-500" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-amber-500" />
                )}
                <p className="text-sm text-muted-foreground capitalize">
                  {storageData.status}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Charging Rate</p>
              <p className="text-sm text-muted-foreground">
                {storageData.chargingRate} kW
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Temperature</p>
              <p className="text-sm text-muted-foreground">
                {storageData.temperature}°C
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Health</p>
              <p className="text-sm text-muted-foreground">
                {storageData.health}%
              </p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Total Cycles: {storageData.cycles}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageStatus;