import React from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ConsumerFormData } from "./types";
import { ConsumerBasicInfo } from "./ConsumerBasicInfo";
import { ConsumerContactInfo } from "./ConsumerContactInfo";
import { ConsumerAddressInfo } from "./ConsumerAddressInfo";
import { ConsumerBusinessInfo } from "./ConsumerBusinessInfo";

export const AddConsumerDialog = () => {
  const { toast } = useToast();
  const form = useForm<ConsumerFormData>();

  const onSubmit = async (data: ConsumerFormData) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          full_name: data.name,
          type: data.type,
          consumption: data.consumption,
          address: data.address,
          city: data.city,
          postal_code: data.postal_code,
          country: data.country,
          contact_person: data.contact_person,
          email: data.email,
          phone: data.phone,
          vat_number: data.vat_number,
          notes: data.notes,
          status: 'active'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Consumer has been created successfully.",
      });
      form.reset();
    } catch (error) {
      console.error("Error creating consumer:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create consumer. Please try again.",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Consumer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Consumer</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ConsumerBasicInfo form={form} />
            <ConsumerBusinessInfo form={form} />
            <ConsumerAddressInfo form={form} />
            <ConsumerContactInfo form={form} />
            <Button type="submit" className="w-full">Add Consumer</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};