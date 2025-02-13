import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { POD } from "@/types/pod";

const podSchema = z.object({
  name: z.string().min(1, "Name is required"),
  connection_type: z.enum(["high-voltage", "low-voltage"]),
  installed_capacity: z.string().transform(Number),
  street_address: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postal_code: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  energy_type: z.string().default("Electricity"),
  power_factor: z.string().transform(Number).optional(),
  tariff_plan: z.string().optional(),
  meter_id: z.string().optional(),
  smart_meter_id: z.string().optional(),
  metering_type: z.enum(["manual", "smart"]).optional(),
  maintenance_status: z.enum(["scheduled", "completed", "urgent", "none"]).default("none"),
  maintenance_notes: z.string().optional(),
  billing_cycle: z.enum(["monthly", "quarterly", "annually"]).default("monthly"),
  billing_status: z.enum(["up-to-date", "overdue", "pending"]).default("up-to-date"),
  status: z.enum(["active", "inactive"]),
});

type PODFormValues = z.infer<typeof podSchema>;

interface EditPODDialogProps {
  pod: POD;
  consumerId: string;
}

export const EditPODDialog = ({ pod, consumerId }: EditPODDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<PODFormValues>({
    resolver: zodResolver(podSchema),
    defaultValues: {
      name: pod.name,
      connection_type: pod.connection_type,
      installed_capacity: String(pod.installed_capacity),
      street_address: pod.street_address || "",
      city: pod.city || "",
      state: pod.state || "",
      postal_code: pod.postal_code || "",
      country: pod.country || "",
      energy_type: pod.energy_type || "Electricity",
      power_factor: pod.power_factor ? String(pod.power_factor) : "",
      tariff_plan: pod.tariff_plan || "",
      meter_id: pod.meter_id || "",
      smart_meter_id: pod.smart_meter_id || "",
      metering_type: pod.metering_type || "smart",
      maintenance_status: pod.maintenance_status || "none",
      maintenance_notes: pod.maintenance_notes || "",
      billing_cycle: pod.billing_cycle || "monthly",
      billing_status: pod.billing_status || "up-to-date",
      status: pod.status,
    },
  });

  const onSubmit = async (data: PODFormValues) => {
    try {
      const { error } = await supabase
        .from("pods")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", pod.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "POD has been updated successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ["pods", consumerId] });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update POD",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit POD</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="connection_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Connection Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select connection type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="high-voltage">High Voltage</SelectItem>
                        <SelectItem value="low-voltage">Low Voltage</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="installed_capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Installed Capacity (kW)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="power_factor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Power Factor</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" max="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Location Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="street_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postal_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Metering Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="meter_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meter ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="smart_meter_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Smart Meter ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="metering_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Metering Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select metering type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="smart">Smart</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Maintenance & Billing</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maintenance_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maintenance Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select maintenance status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maintenance_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maintenance Notes</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                  name="billing_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Billing Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select billing status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="up-to-date">Up to Date</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Update POD</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};