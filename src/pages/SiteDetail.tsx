import React from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoTab } from "@/components/SiteDetail/InfoTab";
import { PlantsTab } from "@/components/SiteDetail/PlantsTab/PlantsTab";
import ConsumersList from "@/components/SiteDetail/ConsumersList";
import SiteHeader from "@/components/SiteDetail/SiteHeader";
import { Site } from "@/types/site";

const SiteDetail = () => {
  const { siteId } = useParams();
  
  // Mock data for demonstration
  const mockSite: Site = {
    id: siteId || "1",
    name: "Milano Nord Site",
    location: {
      latitude: 45.4642,
      longitude: 9.1900
    },
    type: "industrial",
    capacity: 1500,
    status: "online",
    lastUpdate: new Date().toISOString(),
    efficiency: 95,
    co2Saved: 25.5,
    plants: [
      {
        id: "1",
        name: "Solar Array A",
        type: "solar",
        capacity: 500,
        currentOutput: 450,
        efficiency: 92,
        status: "online",
        location: {
          latitude: 45.4642,
          longitude: 9.1900
        }
      },
      {
        id: "2",
        name: "Wind Farm B",
        type: "wind",
        capacity: 1000,
        currentOutput: 850,
        efficiency: 88,
        status: "online",
        location: {
          latitude: 45.4642,
          longitude: 9.1900
        }
      }
    ],
    consumers: [
      {
        id: "1",
        full_name: "Industrial Consumer A",
        type: "industrial",
        consumption: 750,
        status: "active",
        specs: {
          peakDemand: 1000,
          dailyUsage: 18000,
          powerFactor: 0.95,
          connectionType: "high-voltage"
        }
      }
    ],
    storageUnits: [],
    energySources: [],
    storage: {
      capacity: 2000,
      currentCharge: 1500
    },
    gridConnection: {
      status: "connected",
      capacity: 2000,
      voltage: 400,
      frequency: 50,
      congestion: "Low"
    },
    dailyProduction: 1200,
    monthlyProduction: 36000
  };

  const handleSiteUpdate = (updatedData: Partial<Site>) => {
    console.log("Updating site with:", updatedData);
    // Here you would typically make an API call to update the site
  };

  return (
    <div className="space-y-6">
      <SiteHeader site={mockSite} onUpdate={handleSiteUpdate} />
      
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Site Info</TabsTrigger>
          <TabsTrigger value="plants">Plants</TabsTrigger>
          <TabsTrigger value="consumers">Consumers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-4">
          <InfoTab site={mockSite} onUpdate={handleSiteUpdate} />
        </TabsContent>
        
        <TabsContent value="plants" className="space-y-4">
          <PlantsTab plants={mockSite.plants} />
        </TabsContent>
        
        <TabsContent value="consumers" className="space-y-4">
          <ConsumersList consumers={mockSite.consumers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteDetail;