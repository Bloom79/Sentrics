import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plant, Asset } from "@/types/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetList } from "./Assets/AssetList";
import { AssetMaintenanceList } from "./Assets/AssetMaintenanceList";
import { AssetMonitoringView } from "./Assets/AssetMonitoringView";
import { AddAssetDialog } from "./Assets/AddAssetDialog";
import { useToast } from "@/hooks/use-toast";

interface PlantAssetsProps {
  plant: Plant;
}

const PlantAssets: React.FC<PlantAssetsProps> = ({ plant }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assets, isLoading: isLoadingAssets } = useQuery({
    queryKey: ['assets', plant.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assets')
        .select(`
          *,
          asset_type:type_id(name)
        `)
        .eq('plant_id', plant.id);
      
      if (error) throw error;
      return data as Asset[];
    }
  });

  const { data: maintenanceRecords } = useQuery({
    queryKey: ['asset_maintenance', plant.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('asset_maintenance')
        .select('*')
        .in('asset_id', assets?.map(a => a.id) || []);
      
      if (error) throw error;
      return data;
    },
    enabled: !!assets?.length
  });

  const { data: monitoringData } = useQuery({
    queryKey: ['asset_monitoring', plant.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('asset_monitoring')
        .select('*')
        .in('asset_id', assets?.map(a => a.id) || [])
        .order('timestamp', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!assets?.length
  });

  const handleAssetDelete = async (assetId: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (error) throw error;

      toast({
        title: "Asset deleted",
        description: "The asset has been successfully deleted.",
      });

      queryClient.invalidateQueries({ queryKey: ['assets', plant.id] });
    } catch (error: any) {
      console.error('Error deleting asset:', error);
      toast({
        title: "Error",
        description: "Failed to delete the asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingAssets) {
    return <div>Loading...</div>;
  }

  const turbines = assets?.filter(asset => asset.asset_type?.name === 'Wind Turbine') || [];
  const inverters = assets?.filter(asset => asset.asset_type?.name === 'Inverter') || [];
  const sensors = assets?.filter(asset => asset.asset_type?.name === 'Sensor') || [];
  const scadaSystems = assets?.filter(asset => asset.asset_type?.name === 'SCADA System') || [];
  const batteries = assets?.filter(asset => asset.asset_type?.name === 'BESS') || [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Asset Overview</CardTitle>
          <AddAssetDialog plant={plant} />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Assets</p>
              <p className="text-2xl font-bold">{assets?.length || 0}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Total Power</p>
              <p className="text-2xl font-bold">
                {assets?.reduce((sum, asset) => sum + (asset.rated_power || 0), 0)} kW
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Average Efficiency</p>
              <p className="text-2xl font-bold">
                {Math.round(
                  assets?.reduce((sum, asset) => sum + (asset.efficiency || 0), 0) / 
                  (assets?.length || 1)
                )}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={plant.type === 'wind' ? 'turbines' : 'inverters'} className="space-y-4">
        <TabsList>
          {plant.type === 'wind' && (
            <TabsTrigger value="turbines">Wind Turbines ({turbines.length})</TabsTrigger>
          )}
          <TabsTrigger value="inverters">Inverters ({inverters.length})</TabsTrigger>
          <TabsTrigger value="sensors">Sensors ({sensors.length})</TabsTrigger>
          <TabsTrigger value="scada">SCADA Systems ({scadaSystems.length})</TabsTrigger>
          <TabsTrigger value="batteries">Batteries ({batteries.length})</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {plant.type === 'wind' && (
          <TabsContent value="turbines">
            <AssetList assets={turbines} onDelete={handleAssetDelete} />
          </TabsContent>
        )}

        <TabsContent value="inverters">
          <AssetList assets={inverters} onDelete={handleAssetDelete} />
        </TabsContent>

        <TabsContent value="sensors">
          <AssetList assets={sensors} onDelete={handleAssetDelete} />
        </TabsContent>

        <TabsContent value="scada">
          <AssetList assets={scadaSystems} onDelete={handleAssetDelete} />
        </TabsContent>

        <TabsContent value="batteries">
          <AssetList assets={batteries} onDelete={handleAssetDelete} />
        </TabsContent>

        <TabsContent value="maintenance">
          <AssetMaintenanceList 
            assets={assets || []} 
            maintenanceRecords={maintenanceRecords || []} 
          />
        </TabsContent>

        <TabsContent value="monitoring">
          <AssetMonitoringView 
            assets={assets || []} 
            monitoringData={monitoringData || []} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PlantAssets;