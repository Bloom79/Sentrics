import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Zap } from "lucide-react";
import { StorageUnit } from "@/types/site";

interface StorageMetricsProps {
  storageUnits: StorageUnit[];
}

const StorageMetrics: React.FC<StorageMetricsProps> = ({ storageUnits }) => {
  const totalCapacity = storageUnits.reduce((sum, unit) => sum + unit.capacity, 0);
  const totalCharge = storageUnits.reduce((sum, unit) => sum + unit.currentCharge, 0);
  const averageHealth = storageUnits.reduce((sum, unit) => sum + unit.health, 0) / storageUnits.length;
  const totalPowerRating = storageUnits.reduce((sum, unit) => sum + unit.powerRating, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
          <Battery className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCapacity} kWh</div>
          <p className="text-xs text-muted-foreground">
            Current: {totalCharge.toFixed(1)} kWh
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Power Rating</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPowerRating} kW</div>
          <p className="text-xs text-muted-foreground">Combined Rating</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Average Health</CardTitle>
          <Battery className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageHealth.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">System Health</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Storage Units</CardTitle>
          <Battery className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{storageUnits.length}</div>
          <p className="text-xs text-muted-foreground">Active Units</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageMetrics;