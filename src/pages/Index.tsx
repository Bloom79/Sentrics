import React from "react";
import { Activity, Battery, Zap } from "lucide-react";
import EnergyFlow from "@/components/Dashboard/EnergyFlow";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import BatteryStatus from "@/components/Dashboard/BatteryStatus";
import GridStatus from "@/components/Dashboard/GridStatus";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">SentricS Dashboard</h1>
        
        <div className="grid gap-6">
          <EnergyFlow />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricsCard
              title="Total Power"
              value="45.8 kW"
              description="+20.1% from last hour"
              icon={<Zap className="w-4 h-4 text-accent" />}
            />
            <MetricsCard
              title="Battery Efficiency"
              value="92%"
              description="Optimal performance"
              icon={<Battery className="w-4 h-4 text-secondary" />}
            />
            <MetricsCard
              title="Grid Load"
              value="78%"
              description="Below peak threshold"
              icon={<Activity className="w-4 h-4 text-primary" />}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <BatteryStatus />
            <GridStatus />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;