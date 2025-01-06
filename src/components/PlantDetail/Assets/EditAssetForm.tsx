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
import { AssetType } from "@/types/site";

const baseAssetSchema = {
  serialNumber: z.string().min(1, "Serial number is required"),
  model: z.string().min(1, "Model is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  location: z.string().min(1, "Location is required"),
  status: z.enum(["operational", "faulty", "maintenance"]),
};

const solarPanelSchema = z.object({
  type: z.literal("panel"),
  ...baseAssetSchema,
  ratedPower: z.coerce.number().min(0),
  efficiency: z.coerce.number().min(0).max(100),
  orientation: z.string().optional(),
  tilt: z.coerce.number().min(0).max(90).optional(),
});

const inverterSchema = z.object({
  type: z.literal("inverter"),
  ...baseAssetSchema,
  efficiency: z.coerce.number().min(0).max(100),
  ratedPower: z.coerce.number().min(0),
});

const windTurbineSchema = z.object({
  type: z.literal("turbine"),
  ...baseAssetSchema,
  ratedCapacity: z.coerce.number().min(0),
  rotorDiameter: z.coerce.number().min(0),
  hubHeight: z.coerce.number().min(0),
  cutInSpeed: z.coerce.number().min(0),
  cutOutSpeed: z.coerce.number().min(0),
});

const transformerSchema = z.object({
  type: z.literal("transformer"),
  ...baseAssetSchema,
  capacity: z.coerce.number().min(0),
  voltageIn: z.coerce.number().min(0),
  voltageOut: z.coerce.number().min(0),
  efficiency: z.coerce.number().min(0).max(100),
});

const batterySchema = z.object({
  type: z.literal("battery"),
  ...baseAssetSchema,
  technology: z.enum(["lithium-ion", "lead-acid", "flow"]),
  ratedPower: z.coerce.number().min(0),
  energyCapacity: z.coerce.number().min(0),
  roundTripEfficiency: z.coerce.number().min(0).max(100).optional(),
});

const assetSchema = z.discriminatedUnion("type", [
  solarPanelSchema,
  inverterSchema,
  windTurbineSchema,
  transformerSchema,
  batterySchema,
]);

interface EditAssetFormProps {
  asset: AssetType;
  onSubmit: (values: AssetType) => void;
}

export const EditAssetForm = ({ asset, onSubmit }: EditAssetFormProps) => {
  const form = useForm<z.infer<typeof assetSchema>>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      ...asset,
    },
  });

  const handleSubmit = (values: z.infer<typeof assetSchema>) => {
    onSubmit(values as AssetType);
  };

  const renderAssetSpecificFields = () => {
    switch (asset.type) {
      case "panel":
        return (
          <>
            <FormField
              control={form.control}
              name="ratedPower"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rated Power (W)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      case "turbine":
        return (
          <>
            <FormField
              control={form.control}
              name="ratedCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rated Capacity (kW)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rotorDiameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rotor Diameter (m)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        );
      // Add cases for other asset types
      default:
        return null;
    }
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

        {renderAssetSpecificFields()}

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