import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid, Users, Grid as GridIcon, LineChart, Wrench, Settings, Home, Building } from "lucide-react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import ProductionOverview from "@/components/Dashboard/Overview/ProductionOverview";
import { SolarProduction, WindProduction } from "@/components/Dashboard/Overview/SourceProduction";
import StorageStatus from "@/components/Dashboard/Overview/StorageStatus";
import DetailedMetrics from "@/components/Dashboard/DetailedMetrics";
import GridStatus from "@/components/Dashboard/GridStatus";
import EnergyFlow from "@/components/Dashboard/EnergyFlow";
import { Badge } from "@/components/ui/badge";

const mockSites = [
  {
    id: "1",
    name: "Milano Nord",
    location: { latitude: 45.4642, longitude: 9.1900 },
    status: "online",
    plants: [],
    consumers: [],
    storageUnits: [],
    totalCapacity: 150,
    currentProduction: 125,
    efficiency: 92
  },
  {
    id: "2",
    name: "Roma Sud",
    location: { latitude: 41.9028, longitude: 12.4964 },
    status: "online",
    plants: [],
    consumers: [],
    storageUnits: [],
    totalCapacity: 200,
    currentProduction: 180,
    efficiency: 88
  },
  {
    id: "3",
    name: "Torino Est",
    location: { latitude: 45.0703, longitude: 7.6869 },
    status: "maintenance",
    plants: [],
    consumers: [],
    storageUnits: [],
    totalCapacity: 175,
    currentProduction: 140,
    efficiency: 85
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("24h");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const handleSiteSelect = (siteId: string) => {
    navigate(`/site/${siteId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/10 text-green-500";
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-red-500/10 text-red-500";
    }
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

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="asset-management" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Asset Management
          </TabsTrigger>
          <TabsTrigger value="analysis-admin" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Analysis & Admin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ProductionOverview />
            <SolarProduction />
            <WindProduction />
            <StorageStatus />
          </div>

          {/* Sites Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSites.map((site) => (
              <Card 
                key={site.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleSiteSelect(site.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5 text-muted-foreground" />
                      {site.name}
                    </CardTitle>
                    <Badge className={getStatusColor(site.status)}>
                      {site.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="font-medium">{site.totalCapacity} MW</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Production</p>
                        <p className="font-medium">{site.currentProduction} MW</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Efficiency</span>
                        <span className="font-medium">{site.efficiency}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="lg:col-span-1">
              <EnergyFlow />
            </div>
            <div className="lg:col-span-1">
              <GridStatus />
            </div>
          </div>

          {/* Sites Overview Section */}
          <DetailedMetrics
            selectedSiteId={null}
            onSiteSelect={handleSiteSelect}
            searchTerm={searchTerm}
            selectedStatus={selectedStatus}
            selectedTimeRange={selectedTimeRange}
          />
        </TabsContent>

        <TabsContent value="asset-management" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-primary" />
                  Plants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manage and monitor all power plants, including solar arrays and wind turbines.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Consumers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Track energy consumption and manage consumer profiles.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GridIcon className="h-5 w-5 text-primary" />
                  Energy Grid
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Monitor grid connections, power flow, and system health.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis-admin" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Advanced data analysis, forecasting, and performance insights.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Schedule and track maintenance tasks across all facilities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configure system preferences and manage user access.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;