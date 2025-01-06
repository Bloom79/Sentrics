import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { ContractFormValues } from "./schema";

interface RateFieldsProps {
  form: UseFormReturn<ContractFormValues>;
  contractType: ContractFormValues["type"];
}

export const RateFields = ({ form, contractType }: RateFieldsProps) => {
  if (contractType === "fixed_rate") {
    return (
      <FormField
        control={form.control}
        name="rate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rate (per kWh)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01" 
                {...field} 
                onChange={e => field.onChange(parseFloat(e.target.value))} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  if (contractType === "peak_off_peak") {
    return (
      <>
        <FormField
          control={form.control}
          name="peak_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Peak Rate (per kWh)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="off_peak_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Off-Peak Rate (per kWh)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  }

  if (contractType === "variable_rate") {
    return (
      <>
        <FormField
          control={form.control}
          name="variable_rate_base"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Rate (per kWh)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  step="0.01" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="variable_rate_adjustment_formula"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rate Adjustment Formula</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  }

  return null;
};