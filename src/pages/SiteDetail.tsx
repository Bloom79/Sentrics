import React from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { MapPin, Factory, Users, Battery, Plug } from "lucide-react";
import SiteHeader from "@/components/SiteDetail/SiteHeader";
import PlantsList from "@/components/SiteDetail/PlantsList";
import ConsumersList from "@/components/SiteDetail/ConsumersList";
import EnergyFlowVisualization from "@/components/SiteAnalysis/EnergyFlowVisualization";
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
      status: "online",
      lastUpdate: new Date().toISOString()
    },
    {
      id: "2",
      name: "Wind Farm B",
      type: "wind",
      capacity: 300,
      currentOutput: 250,
      efficiency: 89,
      status: "online",
      lastUpdate: new Date().toISOString()
    }
  ],
  consumers: [
    {
      id: "1",
      name: "Industrial Park A",
      type: "industrial",
      status: "active",
      consumption: 450,
      lastUpdate: new Date().toISOString()
    },
    {
      id: "2",
      name: "Commercial Center B",
      type: "commercial",
      status: "active",
      consumption: 200,
      lastUpdate: new Date().toISOString()
    }
  ],
  storageUnits: [
    {
      id: "1",
      name: "BESS Unit 1",
      capacity: 1000,
      currentCharge: 750,
      status: "charging",
      efficiency: 95,
      stateOfHealth: 98,
      chargingRate: 100,
      cycleCount: 150,
      temperature: 25
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

        <TabsContent value="flow" className="mt-6">
          <EnergyFlowVisualization site={site} />
        </TabsContent>

        <TabsContent value="info" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <h3 className="font-semibold">{site.name}</h3>
                  <p className="text-sm text-muted-foreground">{site.location}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Type</p>
                  <p className="text-sm text-muted-foreground capitalize">{site.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Capacity</p>
                  <p className="text-sm text-muted-foreground">{site.capacity} kW</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Efficiency</p>
                  <p className="text-sm text-muted-foreground">{site.efficiency}%</p>
                </div>
                <div>
                  <p className="text-sm font-medium">CO2 Saved</p>
                  <p className="text-sm text-muted-foreground">{site.co2Saved} tons</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="plants" className="mt-6">
          <PlantsList plants={site.plants} />
        </TabsContent>

        <TabsContent value="consumers" className="mt-6">
          <ConsumersList consumers={site.consumers} />
        </TabsContent>

        <TabsContent value="storage" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              {site.storageUnits.map((unit) => (
                <div key={unit.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex items-center gap-2">
                    <Battery className="h-5 w-5 text-green-500" />
                    <div>
                      <h3 className="font-semibold">{unit.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {unit.currentCharge} / {unit.capacity} kWh
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {unit.status}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="grid" className="mt-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Plug className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Grid Connection Status</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {site.gridConnection.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Frequency</p>
                  <p className="text-sm text-muted-foreground">
                    {site.gridConnection.frequency} Hz
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Voltage</p>
                  <p className="text-sm text-muted-foreground">
                    {site.gridConnection.voltage} V
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Congestion</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {site.gridConnection.congestion}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteDetail;