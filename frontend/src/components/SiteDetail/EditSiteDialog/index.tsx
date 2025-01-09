import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { Site } from "@/types/site";
import { siteFormSchema, type SiteFormValues } from "./schema";
import { SiteBasicInfoFields } from "./SiteBasicInfoFields";
import { SiteLocationFields } from "./SiteLocationFields";
import { SiteOperationalFields } from "./SiteOperationalFields";
import { SiteManagementFields } from "./SiteManagementFields";

interface EditSiteDialogProps {
  site: Site;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSiteDialog({ site, open, onOpenChange }: EditSiteDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SiteFormValues>({
    resolver: zodResolver(siteFormSchema),
    defaultValues: {
      name: site.name,
      code: site.code || "",
      description: site.description || "",
      type: site.type || "industrial",
      status: site.status || "active",
      site_type: site.site_type || "Solar",
      operational_status: site.operational_status || "Active",
      capacity: site.capacity || 0,
      efficiency: site.efficiency || 0,
      location: site.location || "",
      region: site.region || "",
      street_address: site.street_address || "",
      city: site.city || "",
      postal_code: site.postal_code || "",
      country: site.country || "",
      available_area: site.available_area || 0,
      reserved_area: site.reserved_area || 0,
      owner: site.owner || "",
      operator: site.operator || "",
      maintenance_provider: site.maintenance_provider || "",
      environmental_impact_rating: site.environmental_impact_rating || "",
      notes: site.notes || "",
      tags: site.tags || [],
    },
  });

  async function onSubmit(data: SiteFormValues) {
    try {
      const { error } = await supabase
        .from("sites")
        .update({
          ...data,
          last_updated_by: (await supabase.auth.getUser()).data.user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", site.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Site details updated successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["site", site.id] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating site:", error);
      toast({
        title: "Error",
        description: "Failed to update site details",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Site Details</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-6">
              <SiteBasicInfoFields form={form} />
              <SiteLocationFields form={form} />
              <SiteOperationalFields form={form} />
              <SiteManagementFields form={form} />
            </div>
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}