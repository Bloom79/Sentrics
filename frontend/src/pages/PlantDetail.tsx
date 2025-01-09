import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Wind, Sun, ArrowLeft } from "lucide-react";
import { Plant } from "@/types/site";
import PlantOverview from "@/components/PlantDetail/PlantOverview";
import PlantAssets from "@/components/PlantDetail/PlantAssets";
import { PlantSettings } from "@/components/PlantDetail/PlantSettings";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PlantDetail = () => {
  const { plantId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: plant, isLoading: isLoadingPlant } = useQuery({
    queryKey: ['plant', plantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('plants')
        .select(`
          *,
          site:site_id(id, name)
        `)
        .eq('id', plantId)
        .single();

      if (error) throw error;
      return data as Plant & { site: { id: string; name: string } };
    }
  });

  const handleBack = () => {
    if (plant?.site?.id) {
      navigate(`/sites/${plant.site.id}`);
    } else {
      navigate('/sites');
    }
  };

  const handlePlantUpdate = async (values: Partial<Plant>) => {
    try {
      const { error } = await supabase
        .from('plants')
        .update(values)
        .eq('id', plantId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Plant updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['plant', plantId] });
    } catch (error) {
      console.error('Error updating plant:', error);
      toast({
        title: "Error",
        description: "Failed to update plant. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingPlant || !plant) {
    return <div>Loading...</div>;
  }

  const PlantTypeIcon = plant.type === "solar" ? Sun : Wind;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={handleBack}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {plant.site?.name || 'Sites'}
            </Button>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {plant.name}
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <PlantTypeIcon className="h-3 w-3" />
              {plant.type.charAt(0).toUpperCase() + plant.type.slice(1)}
            </Badge>
            <Badge 
              variant={plant.status === "active" ? "default" : "destructive"}
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
        </TabsContent>
        <TabsContent value="maintenance" className="space-y-4">
          <h3 className="text-lg font-medium">Maintenance Content</h3>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlantDetail;