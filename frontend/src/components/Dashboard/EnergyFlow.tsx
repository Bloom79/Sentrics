import React from "react";
import { Battery, Sun, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const EnergyFlow = () => {
  const { t } = useLanguage();

  const { data: energyData = {
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
  }, isLoading } = useQuery({
    queryKey: ['energy-flow'],
    queryFn: async () => {
      const { data: sites, error } = await supabase
        .from('sites')
        .select(`
          id,
          name,
          capacity,
          efficiency,
          plants (
            id,
            type,
            capacity,
            status,
            efficiency,
            current_output
          ),
          storage_units (
            id,
            capacity,
            charge_level,
            status,
            efficiency
          )
        `)
        .limit(1)  // Add limit to get only one site
        .maybeSingle(); // Use maybeSingle instead of single

      if (error) throw error;

      if (!sites) {
        console.warn('No sites found, using default values');
        return {
          solar: {
            output: 0,
            irradiance: 0,
            activeArrays: 0
          },
          wind: {
            output: 0,
            speed: "0 m/s",
            direction: "N/A",
            activeTurbines: 0
          },
          storage: {
            level: 0,
            capacity: 0,
            chargingRate: 0,
            temperature: 0
          },
          distribution: {
            directConsumption: 0,
            gridDelivery: 0,
            storageCharging: 0
          },
          systemEfficiency: 0
        };
      }

      // Transform the data to match our energyData structure
      const solarPlants = sites?.plants?.filter(p => p.type === 'solar') || [];
      const windPlants = sites?.plants?.filter(p => p.type === 'wind') || [];
      const storage = sites?.storage_units?.[0] || null;

      return {
        solar: {
          output: solarPlants.reduce((sum, p) => sum + (p.current_output || 0), 0),
          irradiance: 850, // Mock value as it's not in DB
          activeArrays: solarPlants.filter(p => p.status === 'active').length
        },
        wind: {
          output: windPlants.reduce((sum, p) => sum + (p.current_output || 0), 0),
          speed: "12 m/s", // Mock value as it's not in DB
          direction: "NORD", // Mock value as it's not in DB
          activeTurbines: windPlants.filter(p => p.status === 'active').length
        },
        storage: {
          level: storage?.charge_level || 0,
          capacity: storage?.capacity || 0,
          chargingRate: 45, // Mock value as it's not in DB
          temperature: storage?.temperature || 0
        },
        distribution: {
          directConsumption: 520, // Mock value as it's not in DB
          gridDelivery: 300, // Mock value as it's not in DB
          storageCharging: 210 // Mock value as it's not in DB
        },
        systemEfficiency: sites?.efficiency || 0
      };
    }
  });

  const totalProduction = energyData.solar.output + energyData.wind.output;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold">Energy Flow & Storage</h2>
        <div className="text-sm text-muted-foreground">
          System Efficiency: {energyData.systemEfficiency}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Energy Sources & Storage */}
        <div className="space-y-8">
          <div className="flex items-center justify-between gap-8">
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
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Storage Level</span>
                  <span>{energyData.storage.level}%</span>
                </div>
                <Progress value={energyData.storage.level} className="h-2" />
                <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                  <span>Charging: {energyData.storage.chargingRate} kW</span>
                  <span>{energyData.storage.temperature}°C</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Energy Distribution */}
        <div className="space-y-4">
          <h3 className="font-medium text-lg mb-8">Power Distribution</h3>
          <div className="space-y-10">
            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="font-medium">Direct Consumption</span>
                <span className="text-muted-foreground">
                  {Math.round(energyData.distribution.directConsumption / totalProduction * 100)}%
                </span>
              </div>
              <Progress 
                value={energyData.distribution.directConsumption / totalProduction * 100} 
                className="h-3 bg-muted/30"
                indicatorClassName="bg-green-500 animate-flow-right"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="font-medium">Grid Export</span>
                <span className="text-muted-foreground">
                  {Math.round(energyData.distribution.gridDelivery / totalProduction * 100)}%
                </span>
              </div>
              <Progress 
                value={energyData.distribution.gridDelivery / totalProduction * 100} 
                className="h-3 bg-muted/30"
                indicatorClassName="bg-blue-500 animate-flow-right"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-3">
                <span className="font-medium">Storage Charging</span>
                <span className="text-muted-foreground">
                  {Math.round(energyData.distribution.storageCharging / totalProduction * 100)}%
                </span>
              </div>
              <Progress 
                value={energyData.distribution.storageCharging / totalProduction * 100} 
                className="h-3 bg-muted/30"
                indicatorClassName="bg-yellow-500 animate-flow-right"
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnergyFlow;