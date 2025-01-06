import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Wind, Activity, Battery, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Site } from "@/types/site";

// Mock data for a site - in a real app, this would come from an API or store
const mockSites: Site[] = [
  {
    id: "1",
    name: "Milano Nord",
    location: "Northern Region",
    type: "hybrid",
    capacity: 800,
    status: "online",
    lastUpdate: new Date().toISOString(),
    dailyProduction: 2500,
    monthlyProduction: 75000,
    efficiency: 92,
    co2Saved: 45.2,
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
  }
];

const SiteDetail = () => {
  const { id } = useParams();
  const site = mockSites.find((s) => s.id === id);

  if (!site) {
    return <div className="p-4">Site not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{site.name}</h1>
        <p className="text-muted-foreground">{site.location}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Type</span>
          </div>
          <p className="mt-2 text-2xl font-bold capitalize">{site.type}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Status</span>
          </div>
          <p className="mt-2 text-2xl font-bold capitalize">{site.status}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Daily Production</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{site.dailyProduction} kWh</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Battery className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Efficiency</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{site.efficiency}%</p>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plants">Plants</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="grid">Grid Connection</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Site Overview</h3>
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium">Monthly Production</p>
                <p className="text-2xl">{site.monthlyProduction} kWh</p>
              </div>
              <div>
                <p className="text-sm font-medium">CO2 Saved</p>
                <p className="text-2xl">{site.co2Saved} tons</p>
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="plants">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Plants</h3>
            <div className="space-y-4">
              {site.plants.map((plant) => (
                <div key={plant.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{plant.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{plant.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{plant.currentOutput} kW</p>
                    <p className="text-sm text-muted-foreground">{plant.efficiency}% efficiency</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="storage">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Storage Systems</h3>
            <div className="space-y-4">
              {site.storageUnits.map((unit) => (
                <div key={unit.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{unit.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{unit.status}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{unit.currentCharge} kWh</p>
                    <p className="text-sm text-muted-foreground">{(unit.currentCharge / unit.capacity * 100).toFixed(1)}% charged</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="grid">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Grid Connection</h3>
            <div className="grid gap-4">
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-lg capitalize">{site.gridConnection.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Frequency</p>
                <p className="text-lg">{site.gridConnection.frequency} Hz</p>
              </div>
              <div>
                <p className="text-sm font-medium">Voltage</p>
                <p className="text-lg">{site.gridConnection.voltage} V</p>
              </div>
              <div>
                <p className="text-sm font-medium">Congestion</p>
                <p className="text-lg">{site.gridConnection.congestion}</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteDetail;