import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface WindTurbineFieldsProps {
  form: UseFormReturn<any>;
}

export const WindTurbineFields = ({ form }: WindTurbineFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="ratedCapacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rated Capacity (MW)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter rated capacity" {...field} />
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
              <Input type="number" placeholder="Enter rotor diameter" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="hubHeight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hub Height (m)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter hub height" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};