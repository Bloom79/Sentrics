import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plant, Asset } from "@/types/site";
import { AddAssetDialog } from "./AddAssetDialog";
import { ImportPanelsDialog } from "./ImportPanelsDialog";
import { Badge } from "@/components/ui/badge";
import { AssetCard } from "./AssetCard";
import { cn } from "@/lib/utils";
import { StringConfigDialog } from "./StringConfigDialog";
import { useToast } from "@/hooks/use-toast";

interface PlantAssetsProps {
  plant: Plant;
}

export const PlantAssets = ({ plant }: PlantAssetsProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [selectedAssetType, setSelectedAssetType] = useState<string | null>(null);
  const [selectedString, setSelectedString] = useState<{ arrayId: string; stringNumber: number } | null>(null);
  const { toast } = useToast();

  const { data: assets, isLoading } = useQuery({
    queryKey: ["assets", plant.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assets")
        .select(`
          *,
          asset_type:type_id (
            id,
            name,
            attributes
          )
        `)
        .eq("plant_id", plant.id);

      if (error) throw error;
      return data as Asset[];
    },
  });

  // Filter assets by type
  const solarArrays = assets?.filter(asset => asset.asset_type?.name === 'Solar Array') || [];
  const solarPanels = assets?.filter(asset => asset.asset_type?.name === 'Solar Panel') || [];
  const transformers = assets?.filter(asset => asset.asset_type?.name === 'Transformer') || [];
  const inverters = assets?.filter(asset => asset.asset_type?.name === 'Inverter') || [];

  // Get all strings from arrays
  const arrayStrings = solarArrays.reduce((strings: any[], array) => {
    const stringAssignments = array.dynamic_attributes?.string_assignments || {};
    const panelsPerString = array.dynamic_attributes?.panels_per_string || 0;
    const numberOfStrings = array.dynamic_attributes?.number_of_strings || 0;

    for (let i = 1; i <= numberOfStrings; i++) {
      const panelsInString = Object.entries(stringAssignments)
        .filter(([_, str]) => str === i)
        .map(([panelId]) => panelId);

      strings.push({
        id: `${array.id}-S${i}`,
        arrayId: array.id,
        arrayName: array.name,
        stringNumber: i,
        panelsAssigned: panelsInString.length,
        maxPanels: panelsPerString,
        status: panelsInString.length === 0 ? 'empty' : 
                panelsInString.length < panelsPerString ? 'partial' : 'full'
      });
    }
    return strings;
  }, []);

  const handleSaveString = async (stringNumber: number, panelIds: string[]) => {
    if (!selectedString) return;

    const array = solarArrays.find(a => a.id === selectedString.arrayId);
    if (!array) return;

    try {
      const currentAssignments = array.dynamic_attributes?.string_assignments || {};
      
      // Remove all panels from this string
      Object.entries(currentAssignments).forEach(([panelId, str]) => {
        if (str === stringNumber) {
          delete currentAssignments[panelId];
        }
      });

      // Add new panel assignments
      panelIds.forEach(panelId => {
        currentAssignments[panelId] = stringNumber;
      });

      const { error } = await supabase
        .from("assets")
        .update({
          dynamic_attributes: {
            ...array.dynamic_attributes,
            string_assignments: currentAssignments,
            attached_panels: Object.keys(currentAssignments)
          }
        })
        .eq('id', array.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "String configuration updated successfully.",
      });

      setSelectedString(null);
    } catch (error: any) {
      console.error("Error updating string configuration:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update string configuration",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading assets...</div>;
  }

  return (
    <Tabs defaultValue="arrays" className="w-full">
      <TabsList>
        <TabsTrigger value="arrays" className="flex items-center gap-2">
          Solar Arrays
          <Badge variant="secondary">{solarArrays.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="strings" className="flex items-center gap-2">
          Array Strings
          <Badge variant="secondary">{arrayStrings.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="panels" className="flex items-center gap-2">
          Solar Panels
          <Badge variant="secondary">{solarPanels.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="transformers" className="flex items-center gap-2">
          Transformers
          <Badge variant="secondary">{transformers.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="inverters" className="flex items-center gap-2">
          Inverters
          <Badge variant="secondary">{inverters.length}</Badge>
        </TabsTrigger>
      </TabsList>

      {/* Solar Arrays Tab */}
      <TabsContent value="arrays" className="space-y-4">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setSelectedAssetType('Solar Array');
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Array
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {solarArrays.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </TabsContent>

      {/* Array Strings Tab */}
      <TabsContent value="strings" className="space-y-4">
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="p-2 text-left">String Code</th>
                <th className="p-2 text-left">Array</th>
                <th className="p-2 text-left">Panels</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {arrayStrings.map((string) => (
                <tr key={string.id} className="border-b">
                  <td className="p-2">{string.id}</td>
                  <td className="p-2">{string.arrayName}</td>
                  <td className="p-2">
                    {string.panelsAssigned} / {string.maxPanels} panels
                  </td>
                  <td className="p-2">
                    <Badge
                      variant={
                        string.status === 'full' ? 'default' :
                        string.status === 'partial' ? 'secondary' :
                        'destructive'
                      }
                    >
                      {string.status}
                    </Badge>
                  </td>
                  <td className="p-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedString({ 
                        arrayId: string.arrayId, 
                        stringNumber: string.stringNumber 
                      })}
                    >
                      Configure
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      {/* Solar Panels Tab */}
      <TabsContent value="panels" className="space-y-4">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setIsImportDialogOpen(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Panels
          </Button>
          <Button
            onClick={() => {
              setSelectedAssetType('Solar Panel');
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Panel
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {solarPanels.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </TabsContent>

      {/* Transformers Tab */}
      <TabsContent value="transformers" className="space-y-4">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setSelectedAssetType('Transformer');
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transformer
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transformers.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </TabsContent>

      {/* Inverters Tab */}
      <TabsContent value="inverters" className="space-y-4">
        <div className="flex justify-end">
          <Button
            onClick={() => {
              setSelectedAssetType('Inverter');
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Inverter
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {inverters.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>
      </TabsContent>

      <AddAssetDialog
        plant={plant}
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        defaultAssetType={selectedAssetType}
      />

      <ImportPanelsDialog
        plant={plant}
        open={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onSuccess={() => setIsImportDialogOpen(false)}
      />

      {selectedString && (
        <StringConfigDialog
          open={true}
          onClose={() => setSelectedString(null)}
          array={solarArrays.find(a => a.id === selectedString.arrayId)!}
          stringNumber={selectedString.stringNumber}
          availablePanels={solarPanels}
          onSave={handleSaveString}
        />
      )}
    </Tabs>
  );
}; 