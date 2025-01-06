import React from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SiteHeader from "@/components/SiteDetail/SiteHeader";
import PlantsList from "@/components/SiteDetail/PlantsList";
import ConsumersList from "@/components/SiteDetail/ConsumersList";
import StorageOverview from "@/components/SiteAnalysis/StorageOverview";
import { Site } from "@/types/site";
import { Card } from "@/components/ui/card";
import { MapPin, Factory, Battery, Zap } from "lucide-react";
import GridConnectionInfo from "@/components/SiteDetail/GridConnectionInfo";

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
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="plants" className="flex items-center gap-2">
            <Factory className="h-4 w-4" />
            Plants
          </TabsTrigger>
          <TabsTrigger value="consumers" className="flex items-center gap-2">
            <Factory className="h-4 w-4" />
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
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Location</h3>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {site.location}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Type</h3>
                <p className="text-muted-foreground capitalize">{site.type}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Total Capacity</h3>
                <p className="text-muted-foreground">{site.capacity} kW</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Status</h3>
                <p className="text-muted-foreground capitalize">{site.status}</p>
              </div>
            </div>
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
          <GridConnectionInfo gridConnection={site.gridConnection} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteDetail;