import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutGrid, Users, Grid as GridIcon, LineChart, Wrench, Settings, Home } from "lucide-react";
import DashboardHeader from "@/components/Dashboard/DashboardHeader";
import ProductionOverview from "@/components/Dashboard/Overview/ProductionOverview";
import { SolarProduction, WindProduction } from "@/components/Dashboard/Overview/SourceProduction";
import StorageStatus from "@/components/Dashboard/Overview/StorageStatus";
import DetailedMetrics from "@/components/Dashboard/DetailedMetrics";
import GridStatus from "@/components/Dashboard/GridStatus";
import EnergyFlow from "@/components/Dashboard/EnergyFlow";

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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
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