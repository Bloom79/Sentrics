import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface BatteryFieldsProps {
  form: UseFormReturn<any>;
}

export const BatteryFields = ({ form }: BatteryFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="technology"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Battery Technology</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select technology" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="lithium-ion">Lithium-Ion</SelectItem>
                <SelectItem value="lead-acid">Lead-Acid</SelectItem>
                <SelectItem value="flow">Flow Battery</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="ratedPower"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rated Power (kW)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter rated power" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="energyCapacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Energy Capacity (kWh)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter energy capacity" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};