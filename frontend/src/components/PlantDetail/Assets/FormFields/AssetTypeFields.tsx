import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface AssetTypeFieldsProps {
  form: UseFormReturn<any>;
  assetType: string;
}

export const AssetTypeFields = ({ form, assetType }: AssetTypeFieldsProps) => {
  const renderWindTurbineFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FormField
        control={form.control}
        name="dynamic_attributes.rated_power"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rated Power</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" placeholder="Enter rated power" {...field} />
            </FormControl>
            <FormDescription>Unit: MW</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dynamic_attributes.rotor_diameter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rotor Diameter</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" placeholder="Enter rotor diameter" {...field} />
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
              <Input type="number" step="0.1" placeholder="Enter hub height" {...field} />
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
              <Input type="number" step="0.1" placeholder="Enter cut-in speed" {...field} />
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
              <Input type="number" step="0.1" placeholder="Enter cut-out speed" {...field} />
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
              <Input type="number" step="0.1" placeholder="Enter nominal wind speed" {...field} />
            </FormControl>
            <FormDescription>Unit: m/s</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dynamic_attributes.blade_length"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Blade Length</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" placeholder="Enter blade length" {...field} />
            </FormControl>
            <FormDescription>Unit: m</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dynamic_attributes.swept_area"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Swept Area</FormLabel>
            <FormControl>
              <Input type="number" step="0.1" placeholder="Enter swept area" {...field} />
            </FormControl>
            <FormDescription>Unit: m²</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dynamic_attributes.generator_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Generator Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select generator type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="DFIG">DFIG</SelectItem>
                <SelectItem value="PMSG">PMSG</SelectItem>
                <SelectItem value="SCIG">SCIG</SelectItem>
                <SelectItem value="WRIG">WRIG</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dynamic_attributes.yaw_system"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Yaw System Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select yaw system type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="passive">Passive</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Type-Specific Attributes</h3>
          {assetType === 'Wind Turbine' && renderWindTurbineFields()}
          {/* Add more asset type specific fields here */}
        </CardContent>
      </Card>
    </div>
  );
};