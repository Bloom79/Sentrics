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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SolarAsset, WindAsset } from "@/types/site";

const solarAssetSchema = z.object({
  type: z.enum(["panel", "inverter"]),
  serialNumber: z.string().min(1, "Serial number is required"),
  model: z.string().min(1, "Model is required"),
  location: z.string().min(1, "Location is required"),
  efficiency: z.coerce.number().min(0).max(100),
  status: z.enum(["operational", "faulty", "maintenance"]),
});

const windAssetSchema = z.object({
  type: z.literal("turbine"),
  serialNumber: z.string().min(1, "Serial number is required"),
  model: z.string().min(1, "Model is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  location: z.string().min(1, "Location is required"),
  ratedCapacity: z.coerce.number().min(0),
  status: z.enum(["operational", "faulty", "maintenance"]),
});

interface EditAssetFormProps {
  asset: SolarAsset | WindAsset;
  onSubmit: (values: SolarAsset | WindAsset) => void;
}

export const EditAssetForm = ({ asset, onSubmit }: EditAssetFormProps) => {
  const isSolarAsset = 'efficiency' in asset;
  const schema = isSolarAsset ? solarAssetSchema : windAssetSchema;
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...asset,
      efficiency: isSolarAsset ? asset.efficiency : undefined,
      ratedCapacity: !isSolarAsset ? asset.ratedCapacity : undefined,
    },
  });

  const handleSubmit = (values: z.infer<typeof schema>) => {
    const updatedAsset = {
      ...asset,
      ...values,
    };
    onSubmit(updatedAsset);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter serial number" {...field} />
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
                <Input placeholder="Enter model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isSolarAsset && (
          <FormField
            control={form.control}
            name="manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter manufacturer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSolarAsset ? (
          <FormField
            control={form.control}
            name="efficiency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Efficiency (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter efficiency" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="ratedCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rated Capacity (kW)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter rated capacity" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="faulty">Faulty</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Update Asset</Button>
      </form>
    </Form>
  );
};