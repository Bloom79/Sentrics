import React from "react";
import { Battery, BatteryCharging } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StorageUnit } from "@/types/site";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data - replace with actual data later
const mockStorageUnits: StorageUnit[] = [
  {
    id: "1",
    capacity: 100,
    currentCharge: 85,
    status: "charging",
    health: 98,
    temperature: 25,
  },
  {
    id: "2",
    capacity: 150,
    currentCharge: 120,
    status: "discharging",
    health: 95,
    temperature: 27,
  },
];

const BatteryStatus = () => {
  const storageUnits = mockStorageUnits;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Battery className="w-5 h-5" />
          Storage Units Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {storageUnits.map((unit) => (
              <div key={unit.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Storage Unit {unit.id}</span>
                  <span className="text-sm text-muted-foreground">
                    {(unit.currentCharge / unit.capacity * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={(unit.currentCharge / unit.capacity) * 100} 
                  className="h-2" 
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {unit.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Power</p>
                    <p className="text-sm text-muted-foreground">
                      {unit.currentCharge.toFixed(1)} kWh
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-sm text-muted-foreground">
                      {unit.temperature}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Health</p>
                    <p className="text-sm text-muted-foreground">{unit.health}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BatteryStatus;