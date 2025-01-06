import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Wind, Activity, Battery, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockSites } from "@/data/mockData";
import SiteHeader from "@/components/SiteDetail/SiteHeader";
import PlantsList from "@/components/SiteDetail/PlantsList";
import ConsumersList from "@/components/SiteDetail/ConsumersList";

const SiteDetail = () => {
  const { id } = useParams();
  const site = mockSites.find((s) => s.id === id);

  if (!site) {
    return <div className="p-4">Site not found</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <SiteHeader site={site} />

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
            <span className="text-sm font-medium">Daily Production</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{site.dailyProduction} kWh</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Monthly Production</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{site.monthlyProduction} kWh</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Battery className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Efficiency</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{site.efficiency}%</p>
        </Card>
      </div>

      <Tabs defaultValue="plants" className="mt-6">
        <TabsList>
          <TabsTrigger value="plants">Plants</TabsTrigger>
          <TabsTrigger value="consumers">Consumers</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="grid">Grid Connection</TabsTrigger>
        </TabsList>
        <TabsContent value="plants">
          <PlantsList plants={site.plants} />
        </TabsContent>
        <TabsContent value="consumers">
          <ConsumersList consumers={site.consumers} />
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
                    <p className="text-sm text-muted-foreground">
                      {((unit.currentCharge / unit.capacity) * 100).toFixed(1)}% charged
                    </p>
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