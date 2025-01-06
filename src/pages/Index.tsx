import React, { useState } from "react";
import { Activity, Battery, Zap, Sun, Wind } from "lucide-react";
import { Link } from "react-router-dom";
import EnergyFlow from "@/components/Dashboard/EnergyFlow";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import DetailedMetrics from "@/components/Dashboard/DetailedMetrics";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data for sites
const sites = [
  {
    id: "1",
    name: "Milano Nord",
    status: "online",
    lastUpdate: "2024-02-20T10:30:00Z",
    dailyProduction: 2500,
    monthlyProduction: 75000,
    efficiency: 92,
    co2Saved: 45.2,
  },
  {
    id: "2",
    name: "Roma Est",
    status: "maintenance",
    lastUpdate: "2024-02-20T09:15:00Z",
    dailyProduction: 2100,
    monthlyProduction: 63000,
    efficiency: 88,
    co2Saved: 38.5,
  },
  {
    id: "3",
    name: "Torino Sud",
    status: "online",
    lastUpdate: "2024-02-20T10:25:00Z",
    dailyProduction: 1800,
    monthlyProduction: 54000,
    efficiency: 90,
    co2Saved: 32.8,
  },
];

const Index = () => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">SentricS Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              {t('dashboard.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select 
              value={language} 
              onValueChange={(value: 'en' | 'it') => setLanguage(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
              </SelectContent>
            </Select>
            <Link to="/grid-analysis">
              <Button variant="outline" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                {t('dashboard.gridAnalysis')}
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricsCard
              title={t('dashboard.totalProduction')}
              value="1,030 kW"
              description={t('dashboard.productionChange')}
              icon={<Zap className="w-4 h-4 text-accent" />}
            />
            <MetricsCard
              title={t('dashboard.solarProduction')}
              value="630 kW"
              description={t('dashboard.solarArrays')}
              icon={<Sun className="w-4 h-4 text-yellow-500" />}
            />
            <MetricsCard
              title={t('dashboard.windProduction')}
              value="400 kW"
              description={t('dashboard.windTurbines')}
              icon={<Wind className="w-4 h-4 text-blue-500" />}
            />
            <MetricsCard
              title={t('dashboard.storageEfficiency')}
              value="92%"
              description={t('dashboard.optimalPerformance')}
              icon={<Battery className="w-4 h-4 text-secondary" />}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <EnergyFlow />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-card rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Sites Overview</h2>
                <div className="space-y-4">
                  {sites.map((site) => (
                    <div
                      key={site.id}
                      className="bg-background rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      onClick={() => setSelectedSiteId(site.id)}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                        {/* Site Status */}
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-4">
                            <div
                              className={`h-3 w-3 rounded-full ${
                                site.status === "online"
                                  ? "bg-green-500"
                                  : site.status === "maintenance"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <div>
                              <Link to={`/site/${site.id}`} className="font-medium hover:underline">
                                {site.name}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                Last update: {new Date(site.lastUpdate).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Site Metrics */}
                        <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Daily Production</p>
                            <p className="font-medium">{site.dailyProduction.toLocaleString()} kWh</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Production</p>
                            <p className="font-medium">{site.monthlyProduction.toLocaleString()} kWh</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Efficiency</p>
                            <p className="font-medium">{site.efficiency}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">CO2 Saved</p>
                            <p className="font-medium">{site.co2Saved.toFixed(1)} tons</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;