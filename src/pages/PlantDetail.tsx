import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, Sun } from "lucide-react";

interface Plant {
  id: string;
  name: string;
  type: "solar" | "wind";
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: "online" | "offline" | "maintenance";
}

// Mock data - in a real app, this would come from an API
const mockPlant: Plant = {
  id: "1",
  name: "Milano Nord Plant 1",
  type: "solar",
  capacity: 1000,
  currentOutput: 750,
  efficiency: 75,
  status: "online"
};

const PlantDetail = () => {
  const { plantId } = useParams();
  const plant = mockPlant; // In a real app, fetch plant data based on plantId

  const PlantTypeIcon = plant.type === "solar" ? Sun : Wind;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {plant.name}
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <PlantTypeIcon className="h-3 w-3" />
              {plant.type.charAt(0).toUpperCase() + plant.type.slice(1)}
            </Badge>
            <Badge 
              variant={plant.status === "online" ? "default" : "destructive"}
            >
              {plant.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plant.capacity} kW</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plant.currentOutput} kW</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plant.efficiency}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <h3 className="text-lg font-medium">Overview Content</h3>
          {/* Overview content will be implemented in the next phase */}
        </TabsContent>
        <TabsContent value="assets" className="space-y-4">
          <h3 className="text-lg font-medium">Assets Content</h3>
          {/* Assets content will be implemented in the next phase */}
        </TabsContent>
        <TabsContent value="monitoring" className="space-y-4">
          <h3 className="text-lg font-medium">Monitoring Content</h3>
          {/* Monitoring content will be implemented in the next phase */}
        </TabsContent>
        <TabsContent value="maintenance" className="space-y-4">
          <h3 className="text-lg font-medium">Maintenance Content</h3>
          {/* Maintenance content will be implemented in the next phase */}
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <h3 className="text-lg font-medium">Settings Content</h3>
          {/* Settings content will be implemented in the next phase */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlantDetail;