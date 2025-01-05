import React from "react";
import { Activity, Battery, Zap, Sun, Wind } from "lucide-react";
import { Link } from "react-router-dom";
import EnergyFlow from "@/components/Dashboard/EnergyFlow";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import BatteryStatus from "@/components/Dashboard/BatteryStatus";
import GridStatus from "@/components/Dashboard/GridStatus";
import SiteMonitoring from "@/components/Dashboard/SiteMonitoring";
import DetailedMetrics from "@/components/Dashboard/DetailedMetrics";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">SentricS Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Piattaforma di Gestione Energie Rinnovabili
            </p>
          </div>
          <div className="flex gap-4">
            <Link to="/grid-analysis">
              <Button variant="outline" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Analisi Rete
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricsCard
              title="Produzione Totale"
              value="1,030 kW"
              description="+20.1% dall'ultima ora"
              icon={<Zap className="w-4 h-4 text-accent" />}
            />
            <MetricsCard
              title="Produzione Solare"
              value="630 kW"
              description="12 array attivi"
              icon={<Sun className="w-4 h-4 text-yellow-500" />}
            />
            <MetricsCard
              title="Produzione Eolica"
              value="400 kW"
              description="8 turbine attive"
              icon={<Wind className="w-4 h-4 text-blue-500" />}
            />
            <MetricsCard
              title="Efficienza Storage"
              value="92%"
              description="Performance ottimale"
              icon={<Battery className="w-4 h-4 text-secondary" />}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <EnergyFlow />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SiteMonitoring />
            <DetailedMetrics />
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