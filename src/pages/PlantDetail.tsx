import React from "react";
import { useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wind, Sun } from "lucide-react";
import { Plant } from "@/types/site";
import PlantOverview from "@/components/PlantDetail/PlantOverview";
import PlantAssets from "@/components/PlantDetail/PlantAssets";
import { PlantSettings } from "@/components/PlantDetail/PlantSettings";
import { useToast } from "@/components/ui/use-toast";

// Mock data - in a real app, this would come from an API
const mockPlant: Plant = {
  id: "1",
  name: "Milano Nord Plant 1",
  type: "solar",
  capacity: 1000,
  currentOutput: 750,
  efficiency: 75,
  status: "online",
  lastUpdate: new Date().toISOString()
};

const PlantDetail = () => {
  const { plantId } = useParams();
  const [plant, setPlant] = React.useState(mockPlant); // In a real app, fetch plant data based on plantId
  const { toast } = useToast();

  const PlantTypeIcon = plant.type === "solar" ? Sun : Wind;

  const handlePlantUpdate = (updatedData: Partial<Plant>) => {
    setPlant((prev) => ({ ...prev, ...updatedData }));
    // In a real app, you would make an API call here to update the plant data
    toast({
      title: "Success",
      description: "Plant settings have been updated.",
    });
  };

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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <PlantOverview plant={plant} />
        </TabsContent>
        <TabsContent value="assets" className="space-y-4">
          <PlantAssets plant={plant} />
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <PlantSettings plant={plant} onUpdate={handlePlantUpdate} />
        </TabsContent>
        <TabsContent value="monitoring" className="space-y-4">
          <h3 className="text-lg font-medium">Monitoring Content</h3>
          {/* Monitoring content will be implemented in the next phase */}
        </TabsContent>
        <TabsContent value="maintenance" className="space-y-4">
          <h3 className="text-lg font-medium">Maintenance Content</h3>
          {/* Maintenance content will be implemented in the next phase */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlantDetail;