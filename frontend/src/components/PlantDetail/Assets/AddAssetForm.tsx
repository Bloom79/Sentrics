import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Plant } from "@/types/site";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { CommonFields } from "./FormFields/CommonFields";
import { AssetTypeFields } from "./FormFields/AssetTypeFields";
import { DynamicFields } from "./FormFields/DynamicFields";

const assetSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type_id: z.string().min(1, "Asset type is required"),
  model: z.string().min(1, "Model is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  installation_date: z.string().min(1, "Installation date is required"),
  location: z.string().min(1, "Location is required"),
  rated_power: z.coerce.number().min(0).optional(),
  efficiency: z.coerce.number().min(0).max(100).optional(),
  notes: z.string().optional(),
  dynamic_attributes: z.record(z.any()).optional(),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface AddAssetFormProps {
  plant: Plant;
  onSuccess?: () => void;
}

export const AddAssetForm = ({ plant, onSuccess }: AddAssetFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: assetTypes, isLoading: isLoadingAssetTypes } = useQuery({
    queryKey: ['asset_types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('asset_types')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      type_id: "",
      model: "",
      manufacturer: "",
      location: "",
      installation_date: new Date().toISOString().split("T")[0],
      notes: "",
      dynamic_attributes: {},
    },
  });

  const selectedTypeId = form.watch("type_id");
  const selectedType = assetTypes?.find(type => type.id === selectedTypeId);

  const onSubmit = async (data: AssetFormValues) => {
    try {
      const { error } = await supabase
        .from("assets")
        .insert({
          ...data,
          plant_id: plant.id,
          status: "operational",
          installation_date: new Date(data.installation_date).toISOString(),
          dynamic_attributes: data.dynamic_attributes || {},
        });

      if (error) throw error;

      toast({
        title: "Asset created",
        description: "The asset has been created successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["assets", plant.id] });
      form.reset();
      onSuccess?.();
    } catch (error: any) {
      console.error("Error creating asset:", error);
      toast({
        title: "Error",
        description: "There was an error creating the asset. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingAssetTypes) {
    return <div>Loading asset types...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <CommonFields form={form} assetTypes={assetTypes || []} />
        
        {selectedType && (
          <AssetTypeFields 
            form={form} 
            assetType={selectedType.name}
          />
        )}

        {selectedType?.attributes && (
          <DynamicFields 
            form={form} 
            attributes={selectedType.attributes} 
          />
        )}

        <Button type="submit" className="w-full">Add Asset</Button>
      </form>
    </Form>
  );
};