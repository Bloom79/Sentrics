import React from "react";
import { Card } from "@/components/ui/card";
import { StorageUnit } from "@/types/site";

interface StorageMetricsProps {
  storage: StorageUnit[];
}

const StorageMetrics: React.FC<StorageMetricsProps> = ({ storage }) => {
  const totalCapacity = storage.reduce((acc, unit) => acc + unit.capacity, 0);
  const averageCharge = storage.reduce((acc, unit) => acc + (unit.currentCharge || 0), 0) / storage.length;
  const averageHealth = storage.reduce((acc, unit) => acc + (unit.health || 0), 0) / storage.length;
  const totalPower = storage.reduce((acc, unit) => acc + (unit.powerRating || 0), 0);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Storage Metrics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Capacity</p>
          <p className="text-2xl font-bold">{totalCapacity} kWh</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Average Charge</p>
          <p className="text-2xl font-bold">{averageCharge.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">System Health</p>
          <p className="text-2xl font-bold">{averageHealth.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Power</p>
          <p className="text-2xl font-bold">{totalPower} kW</p>
        </div>
      </div>
    </Card>
  );
};

export default StorageMetrics;