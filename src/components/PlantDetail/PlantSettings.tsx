import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Plant } from "@/types/site";
import { useToast } from "@/components/ui/use-toast";

const plantFormSchema = z.object({
  name: z.string().min(2, {
    message: "Plant name must be at least 2 characters.",
  }),
  type: z.enum(["solar", "wind"]),
  capacity: z.coerce.number().positive({
    message: "Capacity must be a positive number.",
  }),
  location: z.string().optional(),
});

type PlantFormValues = z.infer<typeof plantFormSchema>;

interface PlantSettingsProps {
  plant: Plant;
  onUpdate: (values: PlantFormValues) => void;
}

export function PlantSettings({ plant, onUpdate }: PlantSettingsProps) {
  const { toast } = useToast();
  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      name: plant.name,
      type: plant.type,
      capacity: plant.capacity,
      location: plant.location || "",
    },
  });

  function onSubmit(data: PlantFormValues) {
    onUpdate(data);
    toast({
      title: "Settings updated",
      description: "Plant settings have been successfully updated.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plant Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The display name for this plant.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plant Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plant type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="solar">Solar</SelectItem>
                  <SelectItem value="wind">Wind</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                The type of energy generation for this plant.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Capacity (kW)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                The total generation capacity of the plant in kilowatts.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The physical location of the plant (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
}