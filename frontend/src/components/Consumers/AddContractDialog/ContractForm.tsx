import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
import { useToast } from "@/components/ui/use-toast";

const contractSchema = z.object({
  type: z.enum(["fixed_rate", "variable_rate", "peak_off_peak"]),
  rate: z.coerce.number().min(0).optional(),
  peak_rate: z.coerce.number().min(0).optional(),
  off_peak_rate: z.coerce.number().min(0).optional(),
  variable_rate_base: z.coerce.number().min(0).optional(),
  variable_rate_adjustment_formula: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  minimum_purchase: z.coerce.number().min(0),
  billing_cycle: z.enum(["monthly", "quarterly", "annually"]),
  payment_terms: z.coerce.number().min(1),
  auto_renewal: z.boolean(),
  termination_notice_days: z.coerce.number().min(1),
  penalties_for_breach: z.string().optional(),
});

type ContractFormValues = z.infer<typeof contractSchema>;

interface ContractFormProps {
  onSuccess: () => void;
}

export const ContractForm = ({ onSuccess }: ContractFormProps) => {
  const { consumerId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      type: "fixed_rate",
      billing_cycle: "monthly",
      payment_terms: 30,
      auto_renewal: false,
      termination_notice_days: 30,
      start_date: format(new Date(), "yyyy-MM-dd"),
      end_date: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), "yyyy-MM-dd"),
    },
  });

  const onSubmit = async (data: ContractFormValues) => {
    try {
      const { error } = await supabase.from("contracts").insert({
        ...data,
        consumer_id: consumerId,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Contract created",
        description: "The contract has been created successfully.",
      });

      queryClient.invalidateQueries({ queryKey: ["contract", consumerId] });
      onSuccess();
    } catch (error) {
      console.error("Error creating contract:", error);
      toast({
        title: "Error",
        description: "There was an error creating the contract. Please try again.",
        variant: "destructive",
      });
    }
  };

  const contractType = form.watch("type");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        {contractType === "fixed_rate" && (
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rate (per kWh)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {contractType === "peak_off_peak" && (
          <>
            <FormField
              control={form.control}
              name="peak_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peak Rate (per kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
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
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {contractType === "variable_rate" && (
          <>
            <FormField
              control={form.control}
              name="variable_rate_base"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Rate (per kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
        </div>

        <FormField
          control={form.control}
          name="minimum_purchase"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Purchase (kWh)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
                <Input type="number" {...field} />
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
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="penalties_for_breach"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Penalties for Breach</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="submit">Create Contract</Button>
        </div>
      </form>
    </Form>
  );
};