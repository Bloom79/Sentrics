import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContractFormValues, contractSchema } from "./schema";
import { v4 as uuidv4 } from 'uuid';
import { RateFields } from "./RateFields";
import { BasicContractFields } from "./BasicContractFields";

interface ContractFormProps {
  consumerId: string;
  onSuccess?: () => void;
}

export const ContractForm = ({ consumerId, onSuccess }: ContractFormProps) => {
  const { toast } = useToast();
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      type: "fixed_rate",
      billing_cycle: "monthly",
      auto_renewal: false,
      payment_terms: 30,
      termination_notice_days: 30,
      minimum_purchase: 0,
    },
  });

  const onSubmit = async (data: ContractFormValues) => {
    try {
      const contractData = {
        id: uuidv4(),
        consumer_id: consumerId,
        start_date: new Date().toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        type: data.type,
        rate: data.rate,
        minimum_purchase: data.minimum_purchase,
        billing_cycle: data.billing_cycle,
        payment_terms: data.payment_terms,
        auto_renewal: data.auto_renewal,
        termination_notice_days: data.termination_notice_days,
        status: 'pending' as const,
        peak_rate: data.peak_rate,
        off_peak_rate: data.off_peak_rate,
        variable_rate_base: data.variable_rate_base,
        variable_rate_adjustment_formula: data.variable_rate_adjustment_formula,
      };

      const { error } = await supabase
        .from("contracts")
        .insert(contractData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contract has been created successfully.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating contract:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create contract. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contract Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select contract type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="fixed_rate">Fixed Rate</SelectItem>
                  <SelectItem value="variable_rate">Variable Rate</SelectItem>
                  <SelectItem value="peak_off_peak">Peak/Off-Peak</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <RateFields form={form} contractType={form.watch("type")} />
        <BasicContractFields form={form} />

        <Button type="submit" className="w-full">Create Contract</Button>
      </form>
    </Form>
  );
};