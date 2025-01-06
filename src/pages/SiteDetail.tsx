import React from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Wind, Settings, Activity, Battery, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/PlantDetail/Overview";
import { Performance } from "@/components/PlantDetail/Performance";
import { Assets } from "@/components/PlantDetail/Assets";
import { PlantSettings } from "@/components/PlantDetail/PlantSettings";
import { mockPlants } from "@/data/mockData";

const SiteDetail = () => {
  const { id } = useParams();
  const plant = mockPlants.find((p) => p.id === id);

  if (!plant) {
    return <div>Plant not found</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{plant.name}</h1>
        <p className="text-muted-foreground">{plant.location}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Type</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{plant.type}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Status</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{plant.status}</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Current Output</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{plant.currentOutput} kW</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Battery className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Efficiency</span>
          </div>
          <p className="mt-2 text-2xl font-bold">{plant.efficiency}%</p>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mt-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview plant={plant} />
        </TabsContent>
        <TabsContent value="performance">
          <Performance plant={plant} />
        </TabsContent>
        <TabsContent value="assets">
          <Assets plant={plant} />
        </TabsContent>
        <TabsContent value="settings">
          <PlantSettings plant={plant} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteDetail;