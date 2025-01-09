import React from "react";
import { Battery } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StorageUnit } from "@/types/site";

const BatteryStatus = ({ storageUnits }: { storageUnits: StorageUnit[] }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {storageUnits.map((unit) => (
        <Card key={unit.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{unit.name}</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Charge Level</span>
                <span className="text-sm font-medium">{unit.charge_level}%</span>
              </div>
              <Progress value={unit.charge_level} className="h-2" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Power Rating</span>
                <span className="text-sm font-medium">{unit.power_rating} kW</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className={`text-sm font-medium ${
                  unit.status === 'active' ? 'text-green-500' : 'text-yellow-500'
                }`}>
                  {unit.status}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BatteryStatus;
