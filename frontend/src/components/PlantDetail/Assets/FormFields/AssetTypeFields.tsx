import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AssetTypeFieldsProps {
  form: UseFormReturn<any>;
  assetType: string;
}

export const AssetTypeFields = ({ form, assetType }: AssetTypeFieldsProps) => {
  // Only render wind turbine specific fields here, common fields are handled elsewhere
  if (assetType === 'Wind Turbine') {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Type-Specific Attributes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="dynamic_attributes.rotor_diameter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rotor Diameter</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormDescription>Unit: m</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dynamic_attributes.hub_height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hub Height</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormDescription>Unit: m</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dynamic_attributes.cut_in_speed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cut-in Wind Speed</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormDescription>Unit: m/s</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dynamic_attributes.cut_out_speed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cut-out Wind Speed</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormDescription>Unit: m/s</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dynamic_attributes.nominal_wind_speed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nominal Wind Speed</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormDescription>Unit: m/s</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    );
  }

  return null;
};