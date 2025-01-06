import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface TransformerFieldsProps {
  form: UseFormReturn<any>;
}

export const TransformerFields = ({ form }: TransformerFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacity (MVA)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter capacity" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="voltageIn"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Input Voltage (kV)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter input voltage" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="voltageOut"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Output Voltage (kV)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Enter output voltage" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};