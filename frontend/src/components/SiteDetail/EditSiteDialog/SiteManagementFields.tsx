import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { SiteFormValues } from "./schema";

interface SiteManagementFieldsProps {
  form: UseFormReturn<SiteFormValues>;
}

export function SiteManagementFields({ form }: SiteManagementFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Management Details</h3>
      <FormField
        control={form.control}
        name="owner"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Owner</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="operator"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Operator</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="maintenance_provider"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Maintenance Provider</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="environmental_impact_rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Environmental Impact Rating</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notes</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}