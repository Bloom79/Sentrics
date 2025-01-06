import React from "react";
import { Battery, Sun, Wind, Factory, Grid } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

const EnergyFlow = () => {
  const { t } = useLanguage();
  
  // Mock data - replace with actual aggregated data later
  const energyData = {
    solar: {
      output: 630,
      irradiance: 850,
      activeArrays: 12
    },
    wind: {
      output: 400,
      speed: "12 m/s",
      direction: "NORD",
      activeTurbines: 8
    },
    storage: {
      level: 85,
      capacity: 1000,
      chargingRate: 45,
      temperature: 18
    },
    distribution: {
      directConsumption: 520,
      gridDelivery: 300,
      storageCharging: 210
    },
    systemEfficiency: 92
  };

  const totalProduction = energyData.solar.output + energyData.wind.output;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Energy Flow & Storage</h2>
        <div className="text-sm text-muted-foreground">
          System Efficiency: {energyData.systemEfficiency}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Energy Sources & Storage */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-full">
                <Sun className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <div className="font-medium">{energyData.solar.output} kW</div>
                <div className="text-sm text-muted-foreground">
                  {energyData.solar.activeArrays} Arrays • {energyData.solar.irradiance} W/m²
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/10 rounded-full">
                <Wind className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="font-medium">{energyData.wind.output} kW</div>
                <div className="text-sm text-muted-foreground">
                  {energyData.wind.activeTurbines} Turbines • {energyData.wind.speed} {energyData.wind.direction}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-full">
                <Battery className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Storage Level</span>
                  <span>{energyData.storage.level}%</span>
                </div>
                <Progress value={energyData.storage.level} className="h-2" />
                <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                  <span>Charging: {energyData.storage.chargingRate} kW</span>
                  <span>{energyData.storage.temperature}°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Distribution */}
        <div className="space-y-4">
          <h3 className="font-medium mb-4">Power Distribution</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4" />
                  <span>Direct Consumption</span>
                </div>
                <span>{Math.round(energyData.distribution.directConsumption / totalProduction * 100)}%</span>
              </div>
              <Progress value={energyData.distribution.directConsumption / totalProduction * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4" />
                  <span>Grid Export</span>
                </div>
                <span>{Math.round(energyData.distribution.gridDelivery / totalProduction * 100)}%</span>
              </div>
              <Progress value={energyData.distribution.gridDelivery / totalProduction * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4" />
                  <span>Storage Charging</span>
                </div>
                <span>{Math.round(energyData.distribution.storageCharging / totalProduction * 100)}%</span>
              </div>
              <Progress value={energyData.distribution.storageCharging / totalProduction * 100} className="h-2" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnergyFlow;