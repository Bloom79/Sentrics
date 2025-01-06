import React from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Plant, Users, Battery, Zap, Share2 } from "lucide-react";
import SiteHeader from "@/components/SiteDetail/SiteHeader";
import PlantsList from "@/components/SiteDetail/PlantsList";
import ConsumersList from "@/components/SiteDetail/ConsumersList";
import EnergyFlowVisualization from "@/components/SiteAnalysis/EnergyFlowVisualization";
import StorageOverview from "@/components/SiteAnalysis/StorageOverview";
import { Site } from "@/types/site";
import { Card, CardContent } from "@/components/ui/card";
import { GridConnectionInfo } from "@/components/Dashboard/DetailedMetrics/GridConnectionInfo";

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
      
      <Tabs defaultValue="basic-info" className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="basic-info" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="plants" className="flex items-center gap-2">
            <Plant className="h-4 w-4" />
            Plants
          </TabsTrigger>
          <TabsTrigger value="consumers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Consumers
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <Battery className="h-4 w-4" />
            Storage
          </TabsTrigger>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Grid
          </TabsTrigger>
          <TabsTrigger value="energy-flow" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Energy Flow
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Location</h3>
                  <p className="text-muted-foreground">{site.location}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Type</h3>
                  <p className="text-muted-foreground capitalize">{site.type}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Total Capacity</h3>
                  <p className="text-muted-foreground">{site.capacity} kW</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Efficiency</h3>
                  <p className="text-muted-foreground">{site.efficiency}%</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">Daily Production</h3>
                  <p className="text-muted-foreground">{site.dailyProduction} kWh</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-sm">CO2 Saved</h3>
                  <p className="text-muted-foreground">{site.co2Saved} tons</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plants">
          <PlantsList plants={site.plants} />
        </TabsContent>

        <TabsContent value="consumers">
          <ConsumersList consumers={site.consumers} />
        </TabsContent>

        <TabsContent value="storage">
          <StorageOverview siteId={site.id} />
        </TabsContent>

        <TabsContent value="grid">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <h3 className="font-medium">Grid Connection Status</h3>
                <GridConnectionInfo connection={site.gridConnection} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="energy-flow">
          <EnergyFlowVisualization site={site} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteDetail;