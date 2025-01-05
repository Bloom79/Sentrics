import React from "react";
import { Battery, Zap, Home, Sun, Wind } from "lucide-react";

const EnergyFlow = () => {
  // Mock data - replace with actual aggregated data later
  const totalSolarOutput = 630; // kW
  const totalWindOutput = 400; // kW
  const totalStorageLevel = 85; // percentage
  const totalLoad = 820; // kW

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Energy Flow</h2>
      <div className="relative flex items-center justify-between">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-yellow-500 rounded-full">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <span className="mt-2 text-sm font-medium">Solar</span>
              <span className="text-xs text-gray-500">{totalSolarOutput} kW</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 bg-blue-500 rounded-full">
                <Wind className="w-8 h-8 text-white" />
              </div>
              <span className="mt-2 text-sm font-medium">Wind</span>
              <span className="text-xs text-gray-500">{totalWindOutput} kW</span>
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
          <span className="text-xs text-gray-500">{totalStorageLevel}%</span>
        </div>
        
        <div className="flex-1 mx-4 h-2 bg-gray-100 relative">
          <div className="absolute inset-0 w-1/2 bg-accent opacity-50">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-flow-right" />
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="p-4 bg-primary rounded-full">
            <Home className="w-8 h-8 text-white" />
          </div>
          <span className="mt-2 text-sm font-medium">Load</span>
          <span className="text-xs text-gray-500">{totalLoad} kW</span>
        </div>
      </div>
    </div>
  );
};

export default EnergyFlow;