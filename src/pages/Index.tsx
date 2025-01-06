import React, { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import ProductionOverview from "@/components/Dashboard/Overview/ProductionOverview";
import { SolarProduction, WindProduction } from "@/components/Dashboard/Overview/SourceProduction";
import StorageStatus from "@/components/Dashboard/Overview/StorageStatus";
import DetailedMetrics from "@/components/Dashboard/DetailedMetrics";

const Index = () => {
  const { language, setLanguage } = useLanguage();
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("24h");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container py-6">
        <DashboardHeader
          selectedTimeRange={selectedTimeRange}
          setSelectedTimeRange={setSelectedTimeRange}
          language={language}
          setLanguage={setLanguage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        <div className="grid gap-6">
          {/* Top Row - Production & Storage Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProductionOverview />
            <SolarProduction />
            <WindProduction />
            <StorageStatus />
          </div>

          {/* Main Content - Combined Site Status and Metrics */}
          <div className="grid grid-cols-1 gap-4">
            <DetailedMetrics 
              selectedSiteId={selectedSiteId}
              onSiteSelect={setSelectedSiteId}
              searchTerm={searchTerm}
              selectedStatus={selectedStatus}
              selectedTimeRange={selectedTimeRange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;