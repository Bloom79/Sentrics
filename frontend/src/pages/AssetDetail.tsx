import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Asset, AssetMaintenance, AssetMonitoring } from "@/types/site";
import { AssetMaintenanceList } from "@/components/PlantDetail/Assets/AssetMaintenanceList";
import { AssetMonitoringView } from "@/components/PlantDetail/Assets/AssetMonitoringView";
import { EditAssetForm } from "@/components/PlantDetail/Assets/EditAssetForm";
import { AssetOverview } from "@/components/PlantDetail/Assets/AssetOverview";
import { AssetMonitoringGraph } from "@/components/PlantDetail/Assets/AssetMonitoringGraph";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, ArrowLeft } from "lucide-react";

const AssetDetail = () => {
  const { assetId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: asset, isLoading: isLoadingAsset } = useQuery({
    queryKey: ['asset', assetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          asset_type:type_id(name),
          plant:plant_id(id, name)
        `)
        .eq('id', assetId)
        .single();

      if (error) throw error;
      return data as Asset & { plant: { id: string; name: string } };
    }
  });

  const { data: maintenanceRecords, isLoading: isLoadingMaintenance } = useQuery({
    queryKey: ['asset_maintenance', assetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('asset_maintenance')
        .select('*')
        .eq('asset_id', assetId)
        .order('maintenance_date', { ascending: false });

      if (error) throw error;
      return data as AssetMaintenance[];
    },
    enabled: !!assetId
  });

  const { data: monitoringData, isLoading: isLoadingMonitoring } = useQuery({
    queryKey: ['asset_monitoring', assetId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('asset_monitoring')
        .select('*')
        .eq('asset_id', assetId)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as AssetMonitoring[];
    },
    enabled: !!assetId,
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  if (isLoadingAsset || isLoadingMaintenance || isLoadingMonitoring || !asset) {
    return <div>Loading...</div>;
  }

  const handleBack = () => {
    if (asset.plant_id) {
      navigate(`/plants/${asset.plant_id}`);
    }
  };

  // Calculate status based on monitoring data
  const getStatusInfo = () => {
    if (!monitoringData?.length) return { status: "unknown", message: "No monitoring data available" };
    
    const latestData = monitoringData[0];
    const nominalPower = asset.rated_power || 0;
    const currentPower = latestData.value;
    const threshold = 0.15; // 15% threshold

    if (currentPower > nominalPower * (1 + threshold)) {
      return {
        status: "warning",
        message: `Power output exceeds nominal by ${Math.round((currentPower/nominalPower - 1) * 100)}%`
      };
    }
    
    if (currentPower < nominalPower * (1 - threshold)) {
      return {
        status: "warning",
        message: `Power output below nominal by ${Math.round((1 - currentPower/nominalPower) * 100)}%`
      };
    }

    return { status: "operational", message: "Operating within normal range" };
  };

  const statusInfo = getStatusInfo();

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
              Back to {asset.plant?.name || 'Plant'}
            </Button>
          </div>
          <h2 className="text-2xl font-bold tracking-tight">
            {asset.name}
          </h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {asset.asset_type?.name}
            </Badge>
            <Badge 
              variant={statusInfo.status === "operational" ? "default" : "destructive"}
            >
              {statusInfo.status}
            </Badge>
            {statusInfo.status === "warning" && (
              <div className="flex items-center text-sm text-yellow-600">
                <AlertCircle className="h-4 w-4 mr-1" />
                {statusInfo.message}
              </div>
            )}
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
              <EditAssetForm asset={asset} />
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
