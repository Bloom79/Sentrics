import React from "react";
import { useParams } from "react-router-dom";
import { Battery, Thermometer, Activity, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ChargingDirection from "@/components/SiteAnalysis/ChargingDirection";
import SiteProductionGraph from "@/components/SiteAnalysis/SiteProductionGraph";

const StorageUnitDetail = () => {
  const { unitId } = useParams();

  // Mock data - replace with actual API call
  const storageUnit = {
    id: unitId,
    name: "Storage Unit 1",
    capacity: 1000,
    currentCharge: 750,
    status: "charging" as "charging" | "discharging",
    chargingRate: 45,
    temperature: 25,
    health: 98,
    cycles: 342,
    voltage: 48.2,
    current: 150,
    timeRemaining: "1.5 hours",
    efficiency: 92,
    lastMaintenance: "2024-01-15",
    nextMaintenance: "2024-04-15",
  };

  const chargePercentage = (storageUnit.currentCharge / storageUnit.capacity) * 100;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{storageUnit.name}</h1>
          <p className="text-muted-foreground">Unit ID: {storageUnit.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm ${
            storageUnit.status === "charging" 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
          }`}>
            {storageUnit.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Charge Level</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{chargePercentage.toFixed(1)}%</div>
            <Progress value={chargePercentage} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Power</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageUnit.chargingRate} kW</div>
            <p className="text-xs text-muted-foreground mt-1">
              {storageUnit.timeRemaining} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageUnit.temperature}°C</div>
            <p className="text-xs text-muted-foreground mt-1">Operating normally</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storageUnit.health}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {storageUnit.cycles} cycles
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Technical Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Voltage</p>
                <p className="text-2xl">{storageUnit.voltage}V</p>
              </div>
              <div>
                <p className="text-sm font-medium">Current</p>
                <p className="text-2xl">{storageUnit.current}A</p>
              </div>
              <div>
                <p className="text-sm font-medium">Efficiency</p>
                <p className="text-2xl">{storageUnit.efficiency}%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Capacity</p>
                <p className="text-2xl">{storageUnit.capacity} kWh</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Last Maintenance</p>
                <p className="text-lg">{storageUnit.lastMaintenance}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Next Scheduled Maintenance</p>
                <p className="text-lg">{storageUnit.nextMaintenance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <SiteProductionGraph siteId={unitId || ""} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageUnitDetail;