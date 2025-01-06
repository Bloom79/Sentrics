import React from "react";
import { useParams } from "react-router-dom";
import { Battery, Cloud, Wind, Zap, Share2, LineChart, Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteProductionGraph from "@/components/SiteAnalysis/SiteProductionGraph";
import StorageStatus from "@/components/SiteAnalysis/StorageStatus";
import SiteAlerts from "@/components/SiteAnalysis/SiteAlerts";
import MaintenanceSchedule from "@/components/SiteAnalysis/MaintenanceSchedule";
import EquipmentStatus from "@/components/SiteAnalysis/EquipmentStatus";
import ChargingStatus from "@/components/SiteAnalysis/ChargingStatus";
import HistoricalPerformance from "@/components/SiteAnalysis/HistoricalPerformance";
import EfficiencyMetrics from "@/components/SiteAnalysis/EfficiencyMetrics";
import { Site } from "@/types/site";

// Mock data for demonstration - replace with actual API call later
const mockSite: Site = {
  id: "1",
  name: "Milano Nord",
  location: "Northern Region",
  energySources: [
    { id: "1", type: "solar", capacity: 500, currentOutput: 350, status: "active" },
    { id: "2", type: "eolic", capacity: 300, currentOutput: 250, status: "active" },
  ],
  storageUnits: [
    {
      id: "1",
      capacity: 1000,
      currentCharge: 750,
      status: "charging",
      health: 98,
      temperature: 25,
    },
  ],
  totalCapacity: 800,
  currentOutput: 600,
  gridConnection: {
    status: "connected",
    frequency: 50.02,
    voltage: 230.5,
    congestionLevel: "Low",
  },
};

const SiteDetail = () => {
  const { siteId } = useParams();
  const site = mockSite; // In a real app, fetch site data based on siteId

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{site.name}</h1>
          <p className="text-muted-foreground">{site.location}</p>
        </div>
        <div className="flex gap-2">
          <span className={`px-3 py-1 rounded-full text-sm ${
            site.gridConnection.status === "connected" 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}>
            {site.gridConnection.status}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Solar Production</CardTitle>
            <Cloud className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {site.energySources.find(s => s.type === "solar")?.currentOutput} kW
            </div>
            <p className="text-xs text-muted-foreground">
              of {site.energySources.find(s => s.type === "solar")?.capacity} kW capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Wind Production</CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {site.energySources.find(s => s.type === "eolic")?.currentOutput} kW
            </div>
            <p className="text-xs text-muted-foreground">
              of {site.energySources.find(s => s.type === "eolic")?.capacity} kW capacity
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Grid Frequency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.gridConnection.frequency} Hz</div>
            <p className="text-xs text-muted-foreground">
              Nominal: 50.00 Hz
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Grid Voltage</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{site.gridConnection.voltage} V</div>
            <p className="text-xs text-muted-foreground">
              Nominal: 230 V
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Storage Status</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {site.storageUnits[0]?.currentCharge} kWh
            </div>
            <p className="text-xs text-muted-foreground">
              of {site.storageUnits[0]?.capacity} kWh capacity
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status and Historical Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChargingStatus siteId={site.id} />
        <HistoricalPerformance siteId={site.id} />
      </div>

      {/* Production Graph and Efficiency Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SiteProductionGraph siteId={site.id} />
        <EfficiencyMetrics siteId={site.id} />
      </div>

      {/* Equipment Status and Storage Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EquipmentStatus siteId={site.id} />
        <StorageStatus siteId={site.id} />
      </div>

      {/* Maintenance and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaintenanceSchedule siteId={site.id} />
        <SiteAlerts siteId={site.id} />
      </div>
    </div>
  );
};

export default SiteDetail;
