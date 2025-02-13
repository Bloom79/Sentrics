import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Plant, AssetType, Asset } from "@/types/site";
import { assetSchema, AssetFormValues } from "@/lib/validations/asset";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StickyNote, X, Save, Trash2, HelpCircle, Info, Plus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// Common plant zones/locations
const COMMON_LOCATIONS = [
  "Zone A",
  "Zone B",
  "Zone C",
  "Control Room",
  "Transformer Bay",
  "Maintenance Facility",
  "Power Control Section",
  "Substation Building",
  "Other (Specify)",
] as const;

interface EditAssetFormProps {
  plant: Plant;
  asset: Asset;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface AssetType {
  id: string;
  name: string;
  attributes: Record<string, {
    label: string;
    type: string;
    options?: string[];
    unit?: string;
  }>;
}

interface DynamicAttributes {
  strings?: Record<string, {
    code?: string;
    combiner_box?: string;
    fault_status?: "normal" | "warning" | "fault";
    panels?: string[];
  }>;
}

interface FormData {
  name: string;
  type_id: string;
  model: string;
  manufacturer: string;
  location: string;
  installation_date: string;
  notes: string;
  dynamic_attributes: DynamicAttributes;
}

interface SolarArrayAsset {
  dynamic_attributes: DynamicAttributes;
}

interface SolarPanel {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  rated_power: number;
  dynamic_attributes: Record<string, unknown>;
}

export const EditAssetForm = ({ plant, asset, onSuccess, onCancel }: EditAssetFormProps) => {
  const [selectedPanels, setSelectedPanels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<FormData>({
    defaultValues: {
      name: asset?.name || "",
      type_id: asset?.type_id || "",
      model: asset?.model || "",
      manufacturer: asset?.manufacturer || "",
      location: asset?.location || "",
      installation_date: asset?.installation_date ? new Date(asset.installation_date).toISOString().split("T")[0] : "",
      notes: asset?.notes || "",
      dynamic_attributes: {
        strings: (asset?.dynamic_attributes as DynamicAttributes)?.strings || {
          STR001: {
            code: 'STR001',
            combiner_box: '',
            fault_status: 'normal' as const,
            panels: []
          }
        }
      }
    }
  });

  // Debug logging for props
  useEffect(() => {
    console.log('EditAssetForm Props:', {
      plant: {
        id: plant?.id,
        site_id: plant?.site_id,
        name: plant?.name
      },
      asset: {
        id: asset?.id,
        name: asset?.name,
        type_id: asset?.type_id
      }
    });
  }, [plant, asset]);

  // Parse dynamic attributes to ensure proper type
  const parseDynamicAttributes = (attrs: any) => {
    if (!attrs || typeof attrs !== 'object') return {};
    return Object.entries(attrs).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value === null ? "" : value
    }), {});
  };

  const selectedTypeId = form.watch("type_id");
  const selectedLocation = form.watch("location");
  const selectedType = assetTypes.find(type => type.id === selectedTypeId);

  useEffect(() => {
    if (selectedLocation === "Other (Specify)") {
      setIsCustomLocation(true);
    } else if (COMMON_LOCATIONS.includes(selectedLocation as any)) {
      setIsCustomLocation(false);
    } else {
      setIsCustomLocation(true);
    }
  }, [selectedLocation]);

  useEffect(() => {
    const fetchAssetTypes = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('asset_types')
          .select('*')
          .order('name', { ascending: true });
        
        if (error) throw error;
        if (data) {
          setAssetTypes(data);
        }
      } catch (error) {
        console.error('Error fetching asset types:', error);
        toast({
          title: "Error",
          description: "Failed to load asset types. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssetTypes();
  }, [toast]);

  const onSubmit = async (data: FormData) => {
    try {
      // Debug logging for plant data
      console.log('Plant data before update:', {
        plant_object: plant,
        site_id: plant?.site_id,
        plant_id: plant?.id
      });

      // Clean up dynamic attributes
      const cleanDynamicAttributes = Object.entries(data.dynamic_attributes || {}).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: value === "" ? null : value
      }), {});

      // Prepare update data
      const updateData = {
        name: data.name,
        type_id: data.type_id,
        model: data.model,
        manufacturer: data.manufacturer,
        location: data.location,
        installation_date: new Date(data.installation_date).toISOString(),
        notes: data.notes,
        dynamic_attributes: cleanDynamicAttributes,
        site_id: plant?.site_id,
        plant_id: plant?.id,
      };

      // Debug logging for update data
      console.log('Update data prepared:', updateData);

      if (!updateData.site_id || !updateData.plant_id) {
        console.error('Missing plant data:', {
          site_id: updateData.site_id,
          plant_id: updateData.plant_id,
          plant_object: plant
        });
        throw new Error("Missing plant data. Please try again.");
      }

      if (!asset?.id) {
        throw new Error("Missing asset ID. Please try again.");
      }

      // Debug logging before supabase update
      console.log('Attempting to update asset:', {
        asset_id: asset.id,
        update_data: updateData
      });

      const { error } = await supabase
        .from("assets")
        .update(updateData)
        .eq('id', asset.id);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      toast({
        title: "Success",
        description: "Asset updated successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["assets", plant.id] });
      onSuccess?.();
    } catch (error: any) {
      console.error("Error updating asset:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!asset?.id) {
      toast({
        title: "Error",
        description: "Cannot delete asset: Missing asset ID",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("assets")
        .delete()
        .eq('id', asset.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Asset deleted successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["assets", plant?.id] });
      onSuccess?.();
    } catch (error: any) {
      console.error("Error deleting asset:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Query available solar panels
  const { data: availablePanels } = useQuery<SolarPanel[]>({
    queryKey: ['assets', plant.id, 'panels', asset.id],
    queryFn: async () => {
      // First get the solar panel type ID and solar array type ID
      const { data: typeData, error: typeError } = await supabase
        .from('asset_types')
        .select('id, name')
        .in('name', ['Solar Panel', 'Solar Array']);
      
      if (typeError) {
        console.error('Error fetching asset types:', typeError);
        return [];
      }

      const solarPanelTypeId = typeData?.find(t => t.name === 'Solar Panel')?.id;
      const solarArrayTypeId = typeData?.find(t => t.name === 'Solar Array')?.id;

      if (!solarPanelTypeId || !solarArrayTypeId) {
        console.error('Required asset types not found');
        return [];
      }

      // Get all solar arrays (except current one) to check for assigned panels
      const { data: solarArrays, error: arraysError } = await supabase
        .from('assets')
        .select('dynamic_attributes')
        .eq('type_id', solarArrayTypeId)
        .eq('plant_id', plant.id)
        .neq('id', asset.id); // Exclude current array

      if (arraysError) {
        console.error('Error fetching solar arrays:', arraysError);
        return [];
      }

      // Get all panel IDs that are already assigned to other arrays
      const assignedPanelIds = new Set(
        (solarArrays as SolarArrayAsset[])?.flatMap(array => 
          Object.values(array.dynamic_attributes?.strings || {})
            .flatMap(string => string.panels || [])
        ) || []
      );

      // Then fetch all panels
      const { data: panels, error: panelsError } = await supabase
        .from('assets')
        .select(`
          id,
          name,
          manufacturer,
          model,
          rated_power,
          dynamic_attributes
        `)
        .eq('plant_id', plant.id)
        .eq('type_id', solarPanelTypeId);
      
      if (panelsError) {
        console.error('Error fetching solar panels:', panelsError);
        return [];
      }

      // Filter out panels that are already assigned to other arrays
      return (panels || []).filter(panel => !assignedPanelIds.has(panel.id));
    },
    enabled: !!plant?.id && !!asset?.id && asset.asset_type?.name === 'Solar Array'
  });

  if (isLoading) {
    return <div>Loading asset types...</div>;
  }

  // Debug logging for render
  console.log('Rendering EditAssetForm with:', {
    has_plant: !!plant,
    has_asset: !!asset,
    plant_data: {
      id: plant?.id,
      site_id: plant?.site_id
    },
    asset_data: {
      id: asset?.id,
      type_id: asset?.type_id
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
            </CardContent>
          </Card>

          {/* Location & Installation */}
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                      <FormLabel className="flex items-center">
                        Internal Location
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="w-4 h-4 ml-1 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>Specify where this asset is installed within the plant, such as a zone, building, or functional area.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </FormLabel>
                      {!isCustomLocation ? (
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select internal location" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COMMON_LOCATIONS.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                  <FormControl>
                          <Input
                            placeholder="Enter custom location (e.g., Plant_01_ZoneA_Asset12)"
                            {...field}
                            value={field.value === "Other (Specify)" ? "" : field.value}
                          />
                  </FormControl>
                      )}
                      <FormDescription>
                        Define the asset's position within the plant
                      </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="installation_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Installation Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Type-Specific Attributes */}
        {selectedType?.attributes && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(selectedType.attributes).map(([key, attr]) => {
                  type DynamicKey = keyof FormData['dynamic_attributes'];
                  const fieldName = `dynamic_attributes.${key}` as `dynamic_attributes.${DynamicKey}`;
                  return (
              <FormField
                      key={key}
                control={form.control}
                      name={fieldName}
                render={({ field }) => (
                  <FormItem>
                          <FormLabel>{attr.label}</FormLabel>
                    <FormControl>
                            {attr.options ? (
                              <Select
                                value={field.value?.toString() || ""}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {attr.options.map(option => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input 
                                type={attr.type === "number" ? "number" : "text"}
                                placeholder={`Enter ${attr.label.toLowerCase()}`}
                                {...field}
                                value={field.value !== null && field.value !== undefined ? field.value.toString() : ""}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value === "" ? null : attr.type === "number" ? Number(value) : value);
                                }}
                              />
                            )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {asset.asset_type?.name === 'Solar Array' && (
          <div className="space-y-6 col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">String Management</h3>
                <Badge variant="secondary">
                  {Object.keys(form.watch("dynamic_attributes.strings") || {}).length} strings
                </Badge>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const strings = form.watch("dynamic_attributes.strings") || {};
                  const stringCount = Object.keys(strings).length;
                  const newStringCode = `S${(stringCount + 1).toString().padStart(2, '0')}`;
                  form.setValue(`dynamic_attributes.strings.${newStringCode}`, {
                    code: newStringCode,
                    panels: [],
                    fault_status: "normal",
                  });
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add String
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(form.watch("dynamic_attributes.strings") || {}).map(([stringId, string]) => (
                <Card key={stringId}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
              <FormField
                control={form.control}
                          name={`dynamic_attributes.strings.${stringId}.code`}
                render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormLabel className="text-sm font-medium">String Code</FormLabel>
                    <FormControl>
                                <Input {...field} className="w-[120px]" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                          name={`dynamic_attributes.strings.${stringId}.combiner_box`}
                render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormLabel className="text-sm font-medium">Combiner Box</FormLabel>
                    <FormControl>
                                <Input {...field} className="w-[120px]" placeholder="Box ID" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                          name={`dynamic_attributes.strings.${stringId}.fault_status`}
                render={({ field }) => (
                            <FormItem className="flex items-center gap-2">
                              <FormLabel className="text-sm font-medium">Status</FormLabel>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-[120px]">
                                  <SelectValue />
                        </SelectTrigger>
                      <SelectContent>
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="warning">Warning</SelectItem>
                                  <SelectItem value="fault">Fault</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => {
                          const strings = form.watch("dynamic_attributes.strings");
                          const { [stringId]: _, ...rest } = strings;
                          form.setValue("dynamic_attributes.strings", rest);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
          </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Unassigned Panels */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium">Available Panels</h5>
                          {availablePanels?.length > 0 && (
                            <Button
                              size="sm"
                              onClick={() => {
                                const currentPanels = string.panels || [];
                                form.setValue(
                                  `dynamic_attributes.strings.${stringId}.panels`,
                                  [...new Set([...currentPanels, ...availablePanels.map(panel => panel.id)])]
                                );
                                setSelectedPanels([]);
                              }}
                              className="flex items-center gap-2"
                            >
                              <ArrowRight className="w-4 h-4" />
                              Assign Selected
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {availablePanels
                            ?.filter(panel => !(string.panels || []).includes(panel.id))
                            .map((panel) => (
                              <div
                                key={panel.id}
                                className="flex items-center gap-3 p-2 border rounded"
                              >
                                <Checkbox
                                  checked={selectedPanels?.includes(panel.id)}
                                  onCheckedChange={() => {
                                    setSelectedPanels(prev =>
                                      prev.includes(panel.id)
                                        ? prev.filter(id => id !== panel.id)
                                        : [...prev, panel.id]
                                    );
                                  }}
                                />
                                <div>
                                  <div className="font-medium">{panel.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {panel.manufacturer} - {panel.model} ({panel.rated_power}W)
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>

                      {/* Assigned Panels */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium">Assigned Panels</h5>
                          <Badge>
                            {(string.panels || []).length} Panels
                          </Badge>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {availablePanels
                            ?.filter(panel => (string.panels || []).includes(panel.id))
                            .map((panel) => (
                              <div
                                key={panel.id}
                                className="flex items-center justify-between p-2 border rounded"
                              >
                                <div>
                                  <div className="font-medium">{panel.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {panel.manufacturer} - {panel.model} ({panel.rated_power}W)
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const currentPanels = string.panels || [];
                                    form.setValue(
                                      `dynamic_attributes.strings.${stringId}.panels`,
                                      currentPanels.filter(id => id !== panel.id)
                                    );
                                  }}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};