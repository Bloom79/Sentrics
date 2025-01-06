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
import { useToast } from "@/hooks/use-toast";

const solarAssetSchema = z.object({
  type: z.enum(["panel", "inverter"]),
  serialNumber: z.string().min(1, "Serial number is required"),
  model: z.string().min(1, "Model is required"),
  location: z.string().min(1, "Location is required"),
  efficiency: z.string().transform((val) => Number(val)),
});

const windAssetSchema = z.object({
  type: z.literal("turbine"),
  serialNumber: z.string().min(1, "Serial number is required"),
  model: z.string().min(1, "Model is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  location: z.string().min(1, "Location is required"),
  ratedCapacity: z.string().transform((val) => Number(val)),
});

export const AddAssetForm = ({ plantType }: { plantType: "solar" | "wind" }) => {
  const { toast } = useToast();
  const schema = plantType === "solar" ? solarAssetSchema : windAssetSchema;
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: plantType === "solar" 
      ? { type: "panel" }
      : { type: "turbine" },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log(values);
    // Here you would typically make an API call to save the new asset
    toast({
      title: "Asset added successfully",
      description: `New ${values.type} has been added to the plant.`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {plantType === "solar" && (
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Asset Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="panel">Solar Panel</SelectItem>
                    <SelectItem value="inverter">Inverter</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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

        {plantType === "wind" && (
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

        {plantType === "solar" ? (
          <FormField
            control={form.control}
            name="efficiency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Efficiency (%)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter efficiency" {...field} />
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
                  <Input type="number" placeholder="Enter rated capacity" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full">Add Asset</Button>
      </form>
    </Form>
  );
};