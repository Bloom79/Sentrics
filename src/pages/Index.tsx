import React, { useState } from "react";
import { Activity, Battery, Zap, Sun, Wind } from "lucide-react";
import { Link } from "react-router-dom";
import EnergyFlow from "@/components/Dashboard/EnergyFlow";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import SiteMonitoring from "@/components/Dashboard/SiteMonitoring";
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

const Index = () => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedSiteIds, setSelectedSiteIds] = useState<string[]>([]);

  const handleSiteSelect = (siteIds: string[] | null) => {
    setSelectedSiteIds(siteIds || []);
  };

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
            <Select value={language} onValueChange={setLanguage}>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SiteMonitoring onSiteSelect={handleSiteSelect} />
            <div className="bg-card p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Map View</h2>
              <p className="text-muted-foreground">Map view is temporarily disabled.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <DetailedMetrics selectedSiteId={selectedSiteIds.length === 1 ? selectedSiteIds[0] : null} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;