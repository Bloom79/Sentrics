import React, { useState } from "react";
import EnergyFlow from "@/components/Dashboard/EnergyFlow";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import ProductionOverview from "@/components/Dashboard/Overview/ProductionOverview";
import { SolarProduction, WindProduction } from "@/components/Dashboard/Overview/SourceProduction";
import StorageStatus from "@/components/Dashboard/Overview/StorageStatus";
import SitesList from "@/components/Dashboard/SitesList";
import ForecastOverview from "@/components/Dashboard/Overview/ForecastOverview";

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
  const { language, setLanguage } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("24h");

  const filteredSites = sites.filter((site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || site.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container py-8">
        <DashboardHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedTimeRange={selectedTimeRange}
          setSelectedTimeRange={setSelectedTimeRange}
          language={language}
          setLanguage={setLanguage}
        />

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <ProductionOverview />
            <SolarProduction />
            <WindProduction />
            <StorageStatus />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <ForecastOverview />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <EnergyFlow />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <SitesList sites={filteredSites} selectedTimeRange={selectedTimeRange} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;