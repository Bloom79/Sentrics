import React from "react";
import { Battery, Sun, Wind, Factory, Grid } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const EnergyFlow = () => {
  const { t } = useLanguage();
  
  // Mock data - replace with actual aggregated data later
  const totalSolarOutput = 630; // kW
  const totalWindOutput = 400; // kW
  const totalStorageLevel = 85; // percentage
  const directConsumption = 520; // kW
  const gridDelivery = 300; // kW
  const storageStatus = "active"; // active, inactive, error
  const temperature = 18; // °C
  const windSpeed = "12 m/s NORD";

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Energy Flow Overview</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Inactive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Error</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sources */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-medium mb-2">Energy Sources</h3>
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-yellow-500 rounded-full">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <span className="mt-2 text-sm font-medium">Solar</span>
              <span className="text-xs text-muted-foreground">{totalSolarOutput} kW</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-500 rounded-full">
                <Wind className="w-8 h-8 text-white" />
              </div>
              <span className="mt-2 text-sm font-medium">Wind</span>
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground">{totalWindOutput} kW</span>
                <span className="text-xs text-muted-foreground">{windSpeed}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Storage */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-medium mb-2">Storage Status</h3>
          <div className="flex flex-col items-center gap-2">
            <div className={`p-4 rounded-full ${
              storageStatus === 'active' ? 'bg-emerald-500' :
              storageStatus === 'inactive' ? 'bg-blue-500' : 'bg-red-500'
            }`}>
              <Battery className="w-8 h-8 text-white" />
            </div>
            <span className="mt-2 text-sm font-medium">Storage Level</span>
            <span className="text-xs text-muted-foreground">{totalStorageLevel}%</span>
            <div className="text-xs text-muted-foreground mt-1">
              <div>Temperature: {temperature}°C</div>
            </div>
          </div>
        </div>

        {/* Consumption */}
        <div className="flex flex-col items-center gap-4">
          <h3 className="text-lg font-medium mb-2">Energy Distribution</h3>
          <div className="flex gap-6">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-primary rounded-full">
                <Factory className="w-8 h-8 text-white" />
              </div>
              <span className="mt-2 text-sm font-medium">Direct Consumption</span>
              <span className="text-xs text-muted-foreground">{directConsumption} kW</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-red-500 rounded-full">
                <Grid className="w-8 h-8 text-white" />
              </div>
              <span className="mt-2 text-sm font-medium">Grid Delivery</span>
              <span className="text-xs text-muted-foreground">{gridDelivery} kW</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div>
          <span className="text-sm font-medium">Total Production</span>
          <p className="text-lg">{totalSolarOutput + totalWindOutput} kW</p>
        </div>
        <div>
          <span className="text-sm font-medium">Storage Efficiency</span>
          <p className="text-lg">92%</p>
        </div>
        <div>
          <span className="text-sm font-medium">Direct Usage</span>
          <p className="text-lg">{Math.round(directConsumption / (totalSolarOutput + totalWindOutput) * 100)}%</p>
        </div>
        <div>
          <span className="text-sm font-medium">Grid Export</span>
          <p className="text-lg">{Math.round(gridDelivery / (totalSolarOutput + totalWindOutput) * 100)}%</p>
        </div>
      </div>
    </Card>
  );
};

export default EnergyFlow;