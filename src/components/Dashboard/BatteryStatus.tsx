import React from "react";
import { Battery, BatteryCharging } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const BatteryStatus = () => {
  const batteryLevel = 85;
  const isCharging = true;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isCharging ? (
            <BatteryCharging className="w-5 h-5 text-secondary" />
          ) : (
            <Battery className="w-5 h-5" />
          )}
          Battery Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Charge Level</span>
            <span className="text-sm text-muted-foreground">{batteryLevel}%</span>
          </div>
          <Progress value={batteryLevel} className="h-2" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground">
                {isCharging ? "Charging" : "Discharging"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Power</p>
              <p className="text-sm text-muted-foreground">7.2 kW</p>
            </div>
            <div>
              <p className="text-sm font-medium">Temperature</p>
              <p className="text-sm text-muted-foreground">25°C</p>
            </div>
            <div>
              <p className="text-sm font-medium">Health</p>
              <p className="text-sm text-muted-foreground">98%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatteryStatus;