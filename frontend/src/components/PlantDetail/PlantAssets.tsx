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
import { WindTurbineClusterTab } from './WindTurbineClusterTab';
import { CollectorSubstationTab } from './CollectorSubstationTab';
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { ImportPanelsDialog } from "./Assets/ImportPanelsDialog";
import { Badge } from "@/components/ui/badge";

interface PlantAssetsProps {
  plant: Plant;
}

interface AssetWithDynamicAttributes extends Asset {
  dynamic_attributes?: {
    capacity?: number;
    panels?: string[];
    [key: string]: unknown;
  };
}

const PlantAssets: React.FC<PlantAssetsProps> = ({ plant }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddAssetDialog, setShowAddAssetDialog] = React.useState(false);
  const [selectedAssetType, setSelectedAssetType] = React.useState<string>("");
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);

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
      return data as AssetWithDynamicAttributes[];
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
        title: "Success",
        description: "Asset deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['assets', plant.id] });
    } catch (error) {
      console.error('Error deleting asset:', error);
      toast({
        title: "Error",
        description: "Failed to delete asset",
        variant: "destructive",
      });
    }
  };

  const handleAddAsset = (type: string) => {
    setSelectedAssetType(type);
    setShowAddAssetDialog(true);
  };

  const handleCloseDialog = () => {
    setShowAddAssetDialog(false);
    setSelectedAssetType("");
  };

  if (isLoadingAssets) {
    return <div>Loading assets...</div>;
  }

  // Determine which asset types to show based on plant type
  const isWindPlant = plant.type === 'wind';
  const isSolarPlant = plant.type === 'solar';

  // Filter assets by type
  const solarArrays = assets?.filter(asset => asset.asset_type?.name === 'Solar Array') || [];
  const solarPanels = assets?.filter(asset => asset.asset_type?.name === 'Solar Panel') || [];
  const windTurbines = assets?.filter(asset => asset.asset_type?.name === 'Wind Turbine') || [];
  const transformers = assets?.filter(asset => asset.asset_type?.name === 'Transformer') || [];
  const inverters = assets?.filter(asset => asset.asset_type?.name === 'Inverter') || [];
  const batteries = assets?.filter(asset => asset.asset_type?.name === 'Battery') || [];
  const sensors = assets?.filter(asset => asset.asset_type?.name === 'Sensor') || [];
  const scadaSystems = assets?.filter(asset => asset.asset_type?.name === 'SCADA System') || [];

  // Calculate total power
  const calculateTotalPower = () => {
    let total = 0;
    if (isSolarPlant) {
      total += solarArrays.reduce((sum, asset) => sum + (asset.rated_power || 0), 0);
      total += solarPanels.reduce((sum, asset) => sum + (asset.rated_power || 0), 0);
    }
    if (isWindPlant) {
      total += windTurbines.reduce((sum, asset) => sum + (asset.rated_power || 0), 0);
    }
    total += transformers.reduce((sum, asset) => sum + (asset.rated_power || 0), 0);
    total += inverters.reduce((sum, asset) => sum + (asset.rated_power || 0), 0);
    return total;
  };

  // Calculate average efficiency
  const calculateAverageEfficiency = () => {
    const efficiencyAssets = assets?.filter(asset => asset.efficiency !== undefined) || [];
    if (efficiencyAssets.length === 0) return 0;
    const totalEfficiency = efficiencyAssets.reduce((sum, asset) => sum + (asset.efficiency || 0), 0);
    return totalEfficiency / efficiencyAssets.length;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            {/* Main metrics */}
          <div className="grid gap-4 md:grid-cols-3">
              <div>
              <p className="text-sm font-medium">Total Assets</p>
              <p className="text-2xl font-bold">{assets?.length || 0}</p>
            </div>
              <div>
              <p className="text-sm font-medium">Total Power</p>
              <p className="text-2xl font-bold">
                  {calculateTotalPower()} kW
              </p>
            </div>
              <div>
              <p className="text-sm font-medium">Average Efficiency</p>
              <p className="text-2xl font-bold">
                  {calculateAverageEfficiency()}%
                </p>
              </div>
            </div>

            {/* Asset type breakdown */}
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              {/* Solar Arrays */}
              {isSolarPlant && (
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">Solar Arrays</h4>
                    <Badge variant="secondary">{solarArrays.length}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Power: {solarArrays.reduce((sum, array) => {
                      const arrayPower = Object.values(array.dynamic_attributes?.strings || {}).reduce((stringSum, string) => {
                        return stringSum + (string.panels || []).reduce((panelSum, panelId) => {
                          const panel = solarPanels.find(p => p.id === panelId);
                          return panelSum + (panel?.rated_power || 0);
                        }, 0);
                      }, 0);
                      return sum + arrayPower;
                    }, 0)} kW
                  </p>
                </div>
              )}

              {/* Solar Panels */}
              {isSolarPlant && (
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">Solar Panels</h4>
                    <Badge variant="secondary">{solarPanels.length}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Power: {solarPanels.reduce((sum, asset) => sum + (asset.rated_power || 0), 0)} kW
                  </p>
                </div>
              )}

              {/* Inverters */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">Inverters</h4>
                  <Badge variant="secondary">{inverters.length}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Total Power: {inverters.reduce((sum, asset) => sum + (asset.rated_power || 0), 0)} kW
                </p>
              </div>

              {/* Transformers */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">Transformers</h4>
                  <Badge variant="secondary">{transformers.length}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Total Power: {transformers.reduce((sum, asset) => sum + (asset.rated_power || 0), 0)} kW
                </p>
              </div>

              {/* Batteries */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">Batteries</h4>
                  <Badge variant="secondary">{batteries.length}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Total Capacity: {batteries.reduce((sum, asset) => sum + (asset.dynamic_attributes?.capacity || 0), 0)} kWh
                </p>
              </div>

              {/* Sensors */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">Sensors</h4>
                  <Badge variant="secondary">{sensors.length}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Active: {sensors.filter(sensor => sensor.status === 'operational').length}
                </p>
              </div>

              {/* SCADA Systems */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium">SCADA Systems</h4>
                  <Badge variant="secondary">{scadaSystems.length}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Active: {scadaSystems.filter(system => system.status === 'operational').length}
                </p>
              </div>
            </div>

            {/* Status breakdown */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">Operational Status</h4>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Operational</span>
                    <span className="font-medium">{assets?.filter(asset => asset.status === 'operational').length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Maintenance</span>
                    <span className="font-medium">{assets?.filter(asset => asset.status === 'maintenance').length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Offline</span>
                    <span className="font-medium">{assets?.filter(asset => asset.status === 'offline').length || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={plant.type === 'wind' ? 'turbines' : 'arrays'} className="space-y-4">
        <TabsList>
          {plant.type === 'wind' ? (
            <>
              <TabsTrigger value="turbines">Wind Turbines ({windTurbines.length})</TabsTrigger>
              <TabsTrigger value="clusters">Turbine Clusters</TabsTrigger>
              <TabsTrigger value="substations">Collector Substations</TabsTrigger>
            </>
          ) : (
            <>
              <TabsTrigger value="arrays">Solar Arrays ({solarArrays.length})</TabsTrigger>
              <TabsTrigger value="panels">Solar Panels ({solarPanels.length})</TabsTrigger>
              <TabsTrigger value="transformers">Transformers ({transformers.length})</TabsTrigger>
            </>
          )}
          <TabsTrigger value="inverters">Inverters ({inverters.length})</TabsTrigger>
          <TabsTrigger value="sensors">Sensors ({sensors.length})</TabsTrigger>
          <TabsTrigger value="scada">SCADA Systems ({scadaSystems.length})</TabsTrigger>
          <TabsTrigger value="batteries">Batteries ({batteries.length})</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {plant.type === 'wind' ? (
          <>
            <TabsContent value="turbines">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Wind Turbines</h3>
                <Button onClick={() => handleAddAsset("Wind Turbine")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Turbine
                </Button>
              </div>
              <AssetList assets={windTurbines} onDelete={handleAssetDelete} />
            </TabsContent>
            <TabsContent value="clusters">
              <WindTurbineClusterTab plant={plant} />
            </TabsContent>
            <TabsContent value="substations">
              <CollectorSubstationTab plant={plant} />
            </TabsContent>
          </>
        ) : (
          <>
            <TabsContent value="arrays">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Solar Arrays</h3>
                <Button onClick={() => handleAddAsset("Solar Array")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Array
                </Button>
              </div>
              <AssetList assets={solarArrays} onDelete={handleAssetDelete} />
            </TabsContent>
            <TabsContent value="panels">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Solar Panels</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsImportDialogOpen(true)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Import Panels
                  </Button>
                  <Button onClick={() => handleAddAsset("Solar Panel")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Panel
                  </Button>
                </div>
              </div>
              <AssetList assets={solarPanels} onDelete={handleAssetDelete} />

              {/* Import Dialog */}
              <ImportPanelsDialog
                plant={plant}
                open={isImportDialogOpen}
                onClose={() => setIsImportDialogOpen(false)}
                onSuccess={() => {
                  setIsImportDialogOpen(false);
                  queryClient.invalidateQueries({ queryKey: ['assets', plant.id] });
                }}
              />
            </TabsContent>
            <TabsContent value="transformers">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Transformers</h3>
                <Button onClick={() => handleAddAsset("Transformer")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Transformer
                </Button>
              </div>
              <AssetList assets={transformers} onDelete={handleAssetDelete} />
            </TabsContent>
          </>
        )}

        <TabsContent value="inverters">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Inverters</h3>
            <Button onClick={() => handleAddAsset("Inverter")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Inverter
            </Button>
          </div>
          <AssetList assets={inverters} onDelete={handleAssetDelete} />
        </TabsContent>

        <TabsContent value="sensors">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Sensors</h3>
            <Button onClick={() => handleAddAsset("Sensor")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sensor
            </Button>
          </div>
          <AssetList assets={sensors} onDelete={handleAssetDelete} />
        </TabsContent>

        <TabsContent value="scada">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">SCADA Systems</h3>
            <Button onClick={() => handleAddAsset("SCADA System")}>
              <Plus className="h-4 w-4 mr-2" />
              Add SCADA System
            </Button>
          </div>
          <AssetList assets={scadaSystems} onDelete={handleAssetDelete} />
        </TabsContent>

        <TabsContent value="batteries">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Batteries</h3>
            <Button onClick={() => handleAddAsset("BESS")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Battery
            </Button>
          </div>
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

      {showAddAssetDialog && (
        <AddAssetDialog 
          plant={plant}
          open={showAddAssetDialog}
          onClose={handleCloseDialog}
          defaultAssetType={selectedAssetType}
        />
      )}
    </div>
  );
};

export default PlantAssets;