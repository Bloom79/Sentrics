import React from "react";
import { Card } from "@/components/ui/card";
import { Battery, Thermometer, Activity } from "lucide-react";
import { StorageUnit } from "@/types/site";

interface StorageOverviewProps {
  storage: StorageUnit;
}

const StorageOverview: React.FC<StorageOverviewProps> = ({ storage }) => {
  const chargePercentage = storage?.currentCharge && storage?.capacity 
    ? (storage.currentCharge / storage.capacity) * 100 
    : 0;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Storage Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Battery className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">State of Charge</p>
                <p className="text-2xl font-bold">{chargePercentage.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">
                  {storage?.powerRating} kW
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">Temperature</p>
                <p className="text-2xl font-bold">{storage?.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Health</p>
                <p className="text-2xl font-bold">{storage?.health}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StorageOverview;