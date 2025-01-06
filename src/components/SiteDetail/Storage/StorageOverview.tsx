import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Battery, BatteryCharging, AlertTriangle } from "lucide-react";
import { StorageUnit } from "@/types/storage";
import { useNavigate } from "react-router-dom";

interface StorageOverviewProps {
  siteId: string;
  storageUnits: StorageUnit[];
}

const StorageOverview = ({ siteId, storageUnits }: StorageOverviewProps) => {
  const navigate = useNavigate();

  const getTotalCapacity = () => 
    storageUnits.reduce((sum, unit) => sum + unit.capacity, 0);

  const getTotalCharge = () =>
    storageUnits.reduce((sum, unit) => sum + unit.currentCharge, 0);

  const getSystemHealth = () =>
    storageUnits.reduce((sum, unit) => sum + unit.stateOfHealth, 0) / storageUnits.length;

  const totalCapacity = getTotalCapacity();
  const totalCharge = getTotalCharge();
  const systemHealth = getSystemHealth();
  const chargePercentage = (totalCharge / totalCapacity) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{totalCapacity.toLocaleString()} kWh</div>
              <Progress value={chargePercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {chargePercentage.toFixed(1)}% Charged ({totalCharge.toLocaleString()} kWh)
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{systemHealth.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Average across {storageUnits.length} units
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Power Rating</CardTitle>
            <BatteryCharging className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {storageUnits.reduce((sum, unit) => sum + unit.powerRating, 0)} kW
              </div>
              <p className="text-xs text-muted-foreground">Total system capacity</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Storage Units</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {storageUnits.map((unit) => {
              const unitChargePercentage = (unit.currentCharge / unit.capacity) * 100;
              return (
                <div
                  key={unit.id}
                  className="p-4 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                  onClick={() => navigate(`/site/${siteId}/storage/${unit.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4" />
                      <span className="font-medium">{unit.name}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      unit.status === "charging" 
                        ? "bg-green-100 text-green-800"
                        : unit.status === "discharging"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {unit.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Progress value={unitChargePercentage} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{unitChargePercentage.toFixed(1)}% ({unit.currentCharge} kWh)</span>
                      <span>{unit.chargingRate} kW</span>
                    </div>
                  </div>
                  {unit.alerts && unit.alerts.length > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-yellow-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-xs">{unit.alerts.length} active alerts</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageOverview;