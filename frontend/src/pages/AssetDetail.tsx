import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plant, Asset, AssetMaintenance, AssetMonitoring } from "@/types/site";
import { AssetMaintenanceList } from "@/components/PlantDetail/Assets/AssetMaintenanceList";
import { AssetMonitoringView } from "@/components/PlantDetail/Assets/AssetMonitoringView";
import { EditAssetForm } from "@/components/PlantDetail/Assets/EditAssetForm";
import { AssetOverview } from "@/components/PlantDetail/Assets/AssetOverview";
import { AssetMonitoringGraph } from "@/components/PlantDetail/Assets/AssetMonitoringGraph";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, ArrowLeft } from "lucide-react";

const AssetDetail = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch asset data with plant_id
  const { data: asset, isLoading: isLoadingAsset } = useQuery({
    queryKey: ["asset", assetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select(`
          *,
          asset_type:type_id(name)
        `)
        .eq("id", assetId)
        .single();

      if (error) throw error;
      return data as Asset;
    },
  });

  // Fetch plant data using asset's plant_id
  const { data: plant, isLoading: isLoadingPlant } = useQuery({
    queryKey: ["plant", asset?.plant_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plants")
        .select("*")
        .eq("id", asset?.plant_id)
        .single();

      if (error) throw error;
      return data as Plant;
    },
    enabled: !!asset?.plant_id,
  });

  const { data: maintenanceRecords } = useQuery({
    queryKey: ["asset_maintenance", assetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("asset_maintenance")
        .select("*")
        .eq("asset_id", assetId);

      if (error) throw error;
      return data as AssetMaintenance[];
    },
  });

  const { data: monitoringData } = useQuery({
    queryKey: ["asset_monitoring", assetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("asset_monitoring")
        .select("*")
        .eq("asset_id", assetId)
        .order("timestamp", { ascending: false });

      if (error) throw error;
      return data as AssetMonitoring[];
    },
  });

  if (isLoadingAsset || isLoadingPlant) {
    return (
      <div className="container py-6">
        <div className="flex items-center justify-center h-32">
          <p className="text-muted-foreground">Loading asset details...</p>
        </div>
      </div>
    );
  }

  if (!asset || !plant) {
    return (
      <div className="container py-6">
        <div className="flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p>Asset not found</p>
        </div>
      </div>
    );
  }

  const handleBack = () => {
    navigate(`/plants/${plant.id}`);
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={handleBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Plant
        </Button>
        <div>
          <h2 className="text-2xl font-bold">{asset.name}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{asset.asset_type?.name}</span>
            <Badge variant={asset.status === "operational" ? "success" : "destructive"}>
              {asset.status}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AssetOverview asset={asset} monitoringData={monitoringData} />
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="space-y-6">
            <AssetMonitoringGraph 
              asset={asset} 
              monitoringData={monitoringData} 
            />
            <AssetMonitoringView 
              assets={[asset]} 
              monitoringData={monitoringData || []} 
            />
          </div>
        </TabsContent>

        <TabsContent value="edit">
          <Card>
            <CardHeader>
              <CardTitle>Edit Asset</CardTitle>
            </CardHeader>
            <CardContent>
              <EditAssetForm 
                plant={plant} 
                asset={asset} 
                onSuccess={() => {
                  toast({
                    title: "Success",
                    description: "Asset updated successfully",
                  });
                  navigate(`/assets/${asset.id}`);
                }}
                onCancel={() => {
                  navigate(`/assets/${asset.id}`);
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <AssetMaintenanceList 
            assets={[asset]} 
            maintenanceRecords={maintenanceRecords || []} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetDetail;
