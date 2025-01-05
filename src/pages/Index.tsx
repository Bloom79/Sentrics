import React from "react";
import { Activity, Battery, Zap, Sun, Wind } from "lucide-react";
import { Link } from "react-router-dom";
import EnergyFlow from "@/components/Dashboard/EnergyFlow";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import BatteryStatus from "@/components/Dashboard/BatteryStatus";
import GridStatus from "@/components/Dashboard/GridStatus";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">SentricS Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Renewable Energy Management Platform
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/grid-analysis">
              <Button variant="outline" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Grid Analysis
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricsCard
              title="Total Production"
              value="1,030 kW"
              description="+20.1% from last hour"
              icon={<Zap className="w-4 h-4 text-accent" />}
            />
            <MetricsCard
              title="Solar Generation"
              value="630 kW"
              description="12 active arrays"
              icon={<Sun className="w-4 h-4 text-yellow-500" />}
            />
            <MetricsCard
              title="Wind Generation"
              value="400 kW"
              description="8 active turbines"
              icon={<Wind className="w-4 h-4 text-blue-500" />}
            />
            <MetricsCard
              title="Storage Efficiency"
              value="92%"
              description="Optimal performance"
              icon={<Battery className="w-4 h-4 text-secondary" />}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <EnergyFlow />
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