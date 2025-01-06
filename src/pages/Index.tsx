import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import ProductionOverview from "@/components/Dashboard/Overview/ProductionOverview";
import { SolarProduction, WindProduction } from "@/components/Dashboard/Overview/SourceProduction";
import StorageStatus from "@/components/Dashboard/Overview/StorageStatus";
import DetailedMetrics from "@/components/Dashboard/DetailedMetrics";

const Index = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("24h");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handleSiteSelect = (siteId: string) => {
    navigate(`/site/${siteId}`);
  };

  return (
    <div className="space-y-6">
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

      {/* Overview Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProductionOverview />
        <SolarProduction />
        <WindProduction />
        <StorageStatus />
      </div>

      {/* Sites Overview Section */}
      <DetailedMetrics
        selectedSiteId={null}
        onSiteSelect={handleSiteSelect}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        selectedTimeRange={selectedTimeRange}
      />
    </div>
  );
};

export default Index;