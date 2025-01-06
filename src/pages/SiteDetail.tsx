import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Battery, Cloud, Wind, Zap, Share2, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SiteProductionGraph from "@/components/SiteAnalysis/SiteProductionGraph";
import StorageOverview from "@/components/SiteAnalysis/StorageOverview";
import SiteAlerts from "@/components/SiteAnalysis/SiteAlerts";
import MaintenanceSchedule from "@/components/SiteAnalysis/MaintenanceSchedule";
import EquipmentStatus from "@/components/SiteAnalysis/EquipmentStatus";
import HistoricalPerformance from "@/components/SiteAnalysis/HistoricalPerformance";
import EfficiencyMetrics from "@/components/SiteAnalysis/EfficiencyMetrics";
import EnergyFlowVisualization from "@/components/SiteAnalysis/EnergyFlowVisualization";
import EnergyEfficiencyDisplay from "@/components/SiteAnalysis/EnergyEfficiencyDisplay";
import { Site } from "@/types/site";

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
      powerRating: 250, // Added power rating in kW
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
  const [timeRange, setTimeRange] = useState("24h");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header Section with Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{site.name}</h1>
          <p className="text-muted-foreground">{site.location}</p>
        </div>
        
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
            {(timeRange !== "24h" || statusFilter !== "all") && (
              <Badge variant="secondary" className="ml-2">
                {timeRange !== "24h" && statusFilter !== "all" ? "2" : "1"}
              </Badge>
            )}
          </Button>
          
          <span className={`px-3 py-1 rounded-full text-sm ${
            site.gridConnection.status === "connected" 
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          }`}>
            {site.gridConnection.status}
          </span>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Time Range</span>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last Hour</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium">Status</span>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

      {/* Energy Flow Visualization */}
      <div className="mb-6">
        <EnergyFlowVisualization site={site} />
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
