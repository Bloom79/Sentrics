import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { assetSchema, type AssetFormValues } from "@/lib/validations/asset";
import { supabase } from "@/lib/supabase";
import type { Plant, AssetType } from "@/types/site";

import { CommonFields } from "./FormFields/CommonFields";
import { DynamicFields } from "./FormFields/DynamicFields";

interface StringData {
  code: string;
  combiner_box: string;
  fault_status: "normal" | "warning" | "fault";
  panels: string[];
}

interface AddAssetFormProps {
  plant: Plant;
  defaultAssetType?: AssetType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface SolarArrayAsset {
  dynamic_attributes: {
    strings?: Record<string, {
      panels?: string[];
    }>;
  };
}

export const AddAssetForm: React.FC<AddAssetFormProps> = ({
  plant,
  defaultAssetType,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedType, setSelectedType] = React.useState<AssetType | null>(defaultAssetType || null);

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      type_id: defaultAssetType?.id || "",
      model: "",
      manufacturer: "",
      location: "",
      installation_date: new Date().toISOString().split('T')[0],
      notes: "",
      dynamic_attributes: {
        strings: {
          STR001: {
            code: "STR001",
            combiner_box: "",
            fault_status: "normal" as const,
            panels: []
          }
        }
      },
    },
  });

  const { data: assetTypes } = useQuery({
    queryKey: ["asset_types"],
    queryFn: async () => {
        const { data, error } = await supabase
        .from("asset_types")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as AssetType[];
    },
  });

  // Query available solar panels
  const { data: availablePanels } = useQuery({
    queryKey: ['assets', plant.id, 'panels'],
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

      // Get all solar arrays to check for assigned panels
      const { data: solarArrays, error: arraysError } = await supabase
        .from('assets')
        .select('dynamic_attributes')
        .eq('type_id', solarArrayTypeId)
        .eq('plant_id', plant.id);

      if (arraysError) {
        console.error('Error fetching solar arrays:', arraysError);
        return [];
      }

      // Get all panel IDs that are already assigned to any string
      const assignedPanelIds = new Set(
        (solarArrays as SolarArrayAsset[])?.flatMap(array => 
          Object.values(array.dynamic_attributes?.strings || {})
            .flatMap(string => string.panels || [])
        ) || []
      );

      // Then fetch available panels that are not assigned to any string
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
    enabled: !!plant?.id && selectedType?.name === 'Solar Array'
  });

  React.useEffect(() => {
          if (defaultAssetType) {
      setSelectedType(defaultAssetType);
      form.setValue("type_id", defaultAssetType.id);
    }
  }, [defaultAssetType, form]);

  const onSubmit = async (values: AssetFormValues) => {
    try {
      console.log("Submitting form with values:", values);

      // Validate required fields for solar array
      if (selectedType?.name === 'Solar Array') {
        const strings = values.dynamic_attributes?.strings;
        if (!strings || Object.keys(strings).length === 0) {
          throw new Error("At least one string is required for a solar array");
        }
      }

      // Clean up dynamic attributes
      const cleanDynamicAttributes = {
        ...values.dynamic_attributes,
        strings: values.dynamic_attributes?.strings || {}
      };

      // Prepare the asset data
      const assetData = {
        ...values,
        plant_id: plant.id,
        site_id: plant.site_id,
        status: "operational",
        dynamic_attributes: cleanDynamicAttributes,
        installation_date: new Date(values.installation_date).toISOString(),
      };

      console.log("Sending asset data to server:", assetData);

      const { data, error } = await supabase
        .from("assets")
        .insert(assetData)
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Asset created successfully:", data);

      toast({
        title: "Success",
        description: "Asset created successfully",
      });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["assets", plant.id] });
      queryClient.invalidateQueries({ queryKey: ["assets", plant.id, "panels"] });

      // Call success callback
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating asset:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CommonFields 
          form={form} 
          assetTypes={assetTypes || []} 
          selectedType={selectedType} 
          onTypeChange={setSelectedType} 
        />
        
        {selectedType?.attributes && (
          <DynamicFields
            form={form} 
            attributes={selectedType.attributes}
            assetType={selectedType}
            availablePanels={availablePanels}
          />
        )}

        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">Add Asset</Button>
            </div>
      </form>
    </Form>
  );
}