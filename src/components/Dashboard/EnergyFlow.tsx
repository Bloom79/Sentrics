import React from "react";
import { Battery, Zap, Home } from "lucide-react";

const EnergyFlow = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Energy Flow</h2>
      <div className="relative flex items-center justify-between">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-primary rounded-full">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <span className="mt-2 text-sm font-medium">Grid</span>
          <span className="text-xs text-gray-500">12.5 kW</span>
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
          <span className="mt-2 text-sm font-medium">Battery</span>
          <span className="text-xs text-gray-500">85%</span>
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
          <span className="text-xs text-gray-500">8.2 kW</span>
        </div>
      </div>
    </div>
  );
};

export default EnergyFlow;