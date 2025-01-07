import React from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Factory, Users, Battery, Plug } from "lucide-react";
import SiteHeader from "@/components/SiteDetail/SiteHeader";
import { PlantsTab } from "@/components/SiteDetail/PlantsTab/PlantsTab";
import ConsumersList from "@/components/SiteDetail/ConsumersList";
import EnergyFlowVisualization from "@/components/SiteAnalysis/EnergyFlowVisualization";
import StorageTab from "@/components/SiteDetail/StorageTab";
import { InfoTab } from "@/components/SiteDetail/InfoTab";
import { GridTab } from "@/components/SiteDetail/GridTab";
import { Site, Plant, Consumer, StorageUnit } from "@/types/site";

// Update mock data to include all required properties
const mockSite: Site = {
  id: "1",
  name: "Milano Nord",
  location: {
    latitude: 45.4642,
    longitude: 9.1900
  },
  plants: [
    {
      id: "1",
      name: "Solar Array A",
      type: "solar",
      capacity: 500,
      currentOutput: 350,
      efficiency: 95,
      status: "online",
      lastUpdate: new Date().toISOString(),
      location: {
        latitude: 45.4642,
        longitude: 9.1900
      }
    },
    {
      id: "2",
      name: "Wind Farm B",
      type: "wind",
      capacity: 300,
      currentOutput: 250,
      efficiency: 89,
      status: "online",
      lastUpdate: new Date().toISOString(),
      location: {
        latitude: 45.4642,
        longitude: 9.1900
      }
    }
  ],
  consumers: [
    {
      id: "1",
      name: "Industrial Park A",
      type: "industrial",
      consumption: 450,
      status: "active",
      specs: {
        peakDemand: 500,
        dailyUsage: 10000,
        powerFactor: 0.95,
        connectionType: "high-voltage"
      }
    },
    {
      id: "2",
      name: "Commercial Center B",
      type: "commercial",
      consumption: 200,
      status: "active",
      specs: {
        peakDemand: 250,
        dailyUsage: 5000,
        powerFactor: 0.92,
        connectionType: "low-voltage"
      }
    }
  ],
  storageUnits: [
    {
      id: "1",
      name: "BESS Unit 1",
      type: "battery",
      capacity: 1000,
      currentCharge: 750,
      status: "charging",
      powerRating: 250,
      temperature: 25,
      health: 98,
      efficiency: 95
    },
    {
      id: "2",
      name: "BESS Unit 2",
      type: "battery",
      capacity: 1000,
      currentCharge: 600,
      status: "discharging",
      powerRating: 250,
      temperature: 26,
      health: 97,
      efficiency: 94
    }
  ],
  status: "online",
  totalCapacity: 800,
  currentProduction: 600,
  efficiency: 92
};

const SiteDetail = () => {
  const { siteId } = useParams();
  const site = mockSite;

  return (
    <div className="container mx-auto p-4 space-y-6">
      <SiteHeader site={site} />
      
      <Tabs defaultValue="flow" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="flow">Energy Flow</TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="plants" className="flex items-center gap-2">
            <Factory className="h-4 w-4" />
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
            <Plug className="h-4 w-4" />
            Grid
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flow">
          <EnergyFlowVisualization site={site} />
        </TabsContent>

        <TabsContent value="info">
          <InfoTab site={site} />
        </TabsContent>

        <TabsContent value="plants">
          <PlantsTab plants={site.plants} />
        </TabsContent>

        <TabsContent value="consumers">
          <ConsumersList consumers={site.consumers} />
        </TabsContent>

        <TabsContent value="storage">
          <StorageTab site={site} />
        </TabsContent>

        <TabsContent value="grid">
          <GridTab site={site} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteDetail;
