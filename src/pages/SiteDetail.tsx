import React from "react";
import { useParams } from "react-router-dom";
import SiteHeader from "@/components/SiteDetail/SiteHeader";
import PlantsList from "@/components/SiteDetail/PlantsList";
import ConsumersList from "@/components/SiteDetail/ConsumersList";
import EnergyFlowVisualization from "@/components/SiteAnalysis/EnergyFlowVisualization";
import SiteProductionGraph from "@/components/SiteAnalysis/SiteProductionGraph";
import StorageOverview from "@/components/SiteAnalysis/StorageOverview";
import EnergyEfficiencyDisplay from "@/components/SiteAnalysis/EnergyEfficiencyDisplay";
import SiteAlerts from "@/components/SiteAnalysis/SiteAlerts";
import EfficiencyMetrics from "@/components/SiteAnalysis/EfficiencyMetrics";
import HistoricalPerformance from "@/components/SiteAnalysis/HistoricalPerformance";
import MaintenanceSchedule from "@/components/SiteAnalysis/MaintenanceSchedule";
import EquipmentStatus from "@/components/SiteAnalysis/EquipmentStatus";
import { Site } from "@/types/site";

// Mock data for development
const mockSite: Site = {
  id: "1",
  name: "Milano Nord",
  location: "Northern Region",
  type: "hybrid",
  status: "online",
  capacity: 800,
  lastUpdate: new Date().toISOString(),
  dailyProduction: 2500,
  monthlyProduction: 75000,
  efficiency: 92,
  co2Saved: 45.2,
  coordinates: {
    lat: 45.4642,
    lng: 9.1900
  },
  plants: [
    {
      id: "1",
      name: "Solar Array A",
      type: "solar",
      capacity: 500,
      currentOutput: 350,
      efficiency: 95,
      status: "online"
    },
    {
      id: "2",
      name: "Wind Farm B",
      type: "wind",
      capacity: 300,
      currentOutput: 250,
      efficiency: 89,
      status: "online"
    }
  ],
  consumers: [
    {
      id: "1",
      name: "Industrial Park A",
      consumption: 450,
      type: "industrial"
    },
    {
      id: "2",
      name: "Commercial Center B",
      consumption: 200,
      type: "commercial"
    }
  ],
  energySources: [
    { type: "solar", output: 350, capacity: 500, currentOutput: 350, status: "online" },
    { type: "wind", output: 250, capacity: 300, currentOutput: 250, status: "online" }
  ],
  storage: { capacity: 1000, currentCharge: 750 },
  storageUnits: [
    {
      id: "1",
      name: "BESS Unit 1",
      capacity: 1000,
      currentCharge: 750,
      status: "charging"
    }
  ],
  gridConnection: {
    status: "connected",
    frequency: 50.02,
    voltage: 230.5,
    congestion: "Low"
  }
};

const SiteDetail = () => {
  const { siteId } = useParams();
  const site = mockSite; // In a real app, fetch site data based on siteId

  return (
    <div className="container mx-auto p-4 space-y-6">
      <SiteHeader site={site} />
      
      {/* Energy Flow Visualization */}
      <div className="mb-6">
        <EnergyFlowVisualization site={site} />
      </div>

      {/* Plants and Consumers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PlantsList plants={site.plants} />
        <ConsumersList consumers={site.consumers} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <SiteProductionGraph siteId={site.id} />
          <StorageOverview siteId={site.id} />
          <EnergyEfficiencyDisplay siteId={site.id} />
        </div>

        <div className="space-y-6">
          <SiteAlerts siteId={site.id} />
          <EfficiencyMetrics siteId={site.id} />
          <HistoricalPerformance siteId={site.id} />
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MaintenanceSchedule siteId={site.id} />
        <EquipmentStatus siteId={site.id} />
      </div>
    </div>
  );
};

export default SiteDetail;