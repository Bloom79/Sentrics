import React from "react";
import { Battery, Zap, Home, Sun, Wind, Factory, Grid } from "lucide-react";
import { Card } from "@/components/ui/card";

const EnergyFlow = () => {
  // Mock data - replace with actual aggregated data later
  const totalSolarOutput = 630; // kW
  const totalWindOutput = 400; // kW
  const totalStorageLevel = 85; // percentage
  const directConsumption = 520; // kW
  const gridDelivery = 300; // kW

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Energy Flow Overview</h2>
      <div className="relative flex items-center justify-between">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
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
              <span className="text-xs text-muted-foreground">{totalWindOutput} kW</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 mx-4 h-2 bg-gray-100 relative">
          <div className="absolute inset-0 w-1/2 bg-accent opacity-50">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-flow-right" />
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="p-4 bg-secondary rounded-full">
            <Battery className="w-8 h-8 text-white" />
          </div>
          <span className="mt-2 text-sm font-medium">Storage</span>
          <span className="text-xs text-muted-foreground">{totalStorageLevel}%</span>
        </div>
        
        <div className="flex-1 mx-4 h-2 bg-gray-100 relative">
          <div className="absolute inset-0 w-1/2 bg-accent opacity-50">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-flow-right" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
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
    </Card>
  );
};

export default EnergyFlow;