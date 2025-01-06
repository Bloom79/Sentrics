import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface InverterFieldsProps {
  form: UseFormReturn<any>;
}

export const InverterFields = ({ form }: InverterFieldsProps) => {
  return (
    <>
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
    </>
  );
};