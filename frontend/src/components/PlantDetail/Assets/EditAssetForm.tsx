import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Asset } from "@/types/site";
import { useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const assetFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  model: z.string().min(1, "Model is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  location: z.string().min(1, "Location is required"),
  installation_date: z.string().min(1, "Installation date is required"),
  rated_power: z.coerce.number().min(0, "Must be a positive number"),
  efficiency: z.coerce.number().min(0).max(100, "Must be between 0 and 100"),
  notes: z.string().optional(),
  dynamic_attributes: z.object({
    degradation_rate: z.coerce.number().min(0).max(100).optional(),
    nominal_power_dc: z.coerce.number().min(0).optional(),
    temperature_coefficient: z.coerce.number().optional(),
    module_technology: z.string().optional(),
    irradiance_measurement_type: z.string().optional(),
  }).optional(),
});

type AssetFormValues = z.infer<typeof assetFormSchema>;

interface EditAssetFormProps {
  asset: Asset;
}

export const EditAssetForm = ({ asset }: EditAssetFormProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: asset.name,
      model: asset.model,
      manufacturer: asset.manufacturer,
      location: asset.location,
      installation_date: asset.installation_date,
      rated_power: asset.rated_power || 0,
      efficiency: asset.efficiency || 0,
      notes: asset.notes || "",
      dynamic_attributes: {
        degradation_rate: asset.dynamic_attributes?.degradation_rate || 0,
        nominal_power_dc: asset.dynamic_attributes?.nominal_power_dc || 0,
        temperature_coefficient: asset.dynamic_attributes?.temperature_coefficient || 0,
        module_technology: asset.dynamic_attributes?.module_technology || "",
        irradiance_measurement_type: asset.dynamic_attributes?.irradiance_measurement_type || "",
      },
    },
  });

  async function onSubmit(data: AssetFormValues) {
    try {
      const { error } = await supabase
        .from("assets")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", asset.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Asset updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["asset", asset.id] });
    } catch (error) {
      console.error("Error updating asset:", error);
      toast({
        title: "Error",
        description: "Failed to update asset",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
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
          </div>

          {/* Technical Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Technical Details</h3>
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

          {/* Performance Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Performance Specifications</h3>
            <FormField
              control={form.control}
              name="rated_power"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rated Power (kW)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="efficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Efficiency (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" min="0" max="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Location & Installation */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location & Installation</h3>
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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

          {/* Type-Specific Attributes */}
          <div className="space-y-4 col-span-2">
            <h3 className="text-lg font-medium">Type-Specific Attributes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="dynamic_attributes.degradation_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Degradation Rate (%/year)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dynamic_attributes.nominal_power_dc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nominal Power (DC)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dynamic_attributes.temperature_coefficient"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature Coefficient (%/°C)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dynamic_attributes.module_technology"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Module Technology</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select module technology" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="monocrystalline">Monocrystalline</SelectItem>
                        <SelectItem value="polycrystalline">Polycrystalline</SelectItem>
                        <SelectItem value="thin_film">Thin Film</SelectItem>
                        <SelectItem value="bifacial">Bifacial</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dynamic_attributes.irradiance_measurement_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Irradiance Measurement Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select measurement type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pyranometer">Pyranometer</SelectItem>
                        <SelectItem value="reference_cell">Reference Cell</SelectItem>
                        <SelectItem value="satellite">Satellite Data</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Additional Information */}
          <div className="col-span-2">
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  );
};