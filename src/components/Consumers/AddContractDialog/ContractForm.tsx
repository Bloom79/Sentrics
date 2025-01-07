import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContractFormValues, contractSchema } from "./schema";
import { v4 as uuidv4 } from 'uuid';

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
    if (!consumerId) return;

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

        {form.watch("type") === "fixed_rate" && (
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate (per kWh)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("type") === "peak_off_peak" && (
          <>
            <FormField
              control={form.control}
              name="peak_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peak Rate (per kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
                    <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {form.watch("type") === "variable_rate" && (
          <>
            <FormField
              control={form.control}
              name="variable_rate_base"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Rate (per kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
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
        )}

        <FormField
          control={form.control}
          name="minimum_purchase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Purchase (kWh)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billing_cycle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Billing Cycle</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select billing cycle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_terms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Terms (days)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="termination_notice_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Termination Notice (days)</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="auto_renewal"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Auto Renewal</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Create Contract</Button>
      </form>
    </Form>
  );
};