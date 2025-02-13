import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface NewPlantDialogProps {
  siteId: string;
  onPlantCreated: () => void;
}

export function NewPlantDialog({ siteId, onPlantCreated }: NewPlantDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantFormSchema),
    defaultValues: {
      name: "",
      type: "solar",
      capacity: 100,
      location: "",
    },
  });

  async function onSubmit(data: PlantFormValues) {
    try {
      const { error } = await supabase
        .from("plants")
        .insert([
          {
            site_id: siteId,
            name: data.name,
            type: data.type,
            capacity: data.capacity,
            location: data.location || null,
          },
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Plant created successfully",
      });
      
      form.reset();
      setOpen(false);
      onPlantCreated();
    } catch (error) {
      console.error("Error creating plant:", error);
      toast({
        title: "Error",
        description: "Failed to create plant. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Plant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Plant</DialogTitle>
          <DialogDescription>
            Add a new power generation plant to your site.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plant Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter plant name" />
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
                    <Input {...field} placeholder="Enter location (optional)" />
                  </FormControl>
                  <FormDescription>
                    The physical location of the plant (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Plant</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 