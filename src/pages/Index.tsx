import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import ProductionOverview from "@/components/Dashboard/Overview/ProductionOverview";
import { SolarProduction, WindProduction } from "@/components/Dashboard/Overview/SourceProduction";
import StorageStatus from "@/components/Dashboard/Overview/StorageStatus";
import ForecastOverview from "@/components/Dashboard/Overview/ForecastOverview";
import DetailedMetrics from "@/components/Dashboard/DetailedMetrics";
import GridStatus from "@/components/Dashboard/GridStatus";

const Index = () => {
  const { language, setLanguage } = useLanguage();
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("24h");
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container py-8">
        <DashboardHeader
          selectedTimeRange={selectedTimeRange}
          setSelectedTimeRange={setSelectedTimeRange}
          language={language}
          setLanguage={setLanguage}
        />

        <div className="grid gap-6">
          {/* Top Row KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ProductionOverview />
            <SolarProduction />
            <WindProduction />
            <StorageStatus />
          </div>

          {/* Forecast & Grid Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ForecastOverview />
            <GridStatus />
          </div>

          {/* Sites Overview & Metrics */}
          <div className="grid grid-cols-1 gap-4">
            <DetailedMetrics 
              selectedSiteId={selectedSiteId}
              onSiteSelect={setSelectedSiteId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;