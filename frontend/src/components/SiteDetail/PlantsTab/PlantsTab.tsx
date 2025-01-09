import React from "react";
import { Plant } from "@/types/site";
import { PlantCard } from "./PlantCard";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const plantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["solar", "wind"]),
  capacity: z.number().min(0),
  location: z.string().min(1, "Location is required"),
});

type PlantFormValues = z.infer<typeof plantSchema>;

export const PlantsTab = () => {
  const { siteId } = useParams();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<PlantFormValues>({
    resolver: zodResolver(plantSchema),
    defaultValues: {
      name: "",
      type: "solar",
      capacity: 0,
      location: "",
    },
  });

  const { data: plants = [], isLoading } = useQuery({
    queryKey: ["plants", siteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("plants")
        .select("*")
        .eq("site_id", siteId);

      if (error) throw error;
      return data || [];
    }
  });

  const createDefaultAssets = async (plantId: string, plantType: string) => {
    // Get asset types
    const { data: assetTypes } = await supabase
      .from('asset_types')
      .select('*');

    if (!assetTypes) return;

    // Create SCADA system first
    const scadaType = assetTypes.find(type => type.name === 'SCADA System');
    if (scadaType) {
      const { data: scada } = await supabase
        .from('assets')
        .insert({
          plant_id: plantId,
          type_id: scadaType.id,
          name: `${plantType === 'solar' ? 'Solar' : 'Wind'} SCADA System`,
          model: 'Default Model',
          manufacturer: 'Default Manufacturer',
          installation_date: new Date().toISOString(),
          location: 'Main Control Room',
          status: 'operational',
        })
        .select()
        .single();

      // Create sensors connected to SCADA
      const sensorType = assetTypes.find(type => type.name === 'Sensor');
      if (sensorType && scada) {
        const defaultSensors = plantType === 'solar' 
          ? ['pyranometer', 'ambient_temperature', 'panel_temperature']
          : ['wind_speed', 'wind_direction', 'ambient_temperature'];

        for (const sensorName of defaultSensors) {
          await supabase
            .from('assets')
            .insert({
              plant_id: plantId,
              type_id: sensorType.id,
              parent_id: scada.id,
              name: `${sensorName.replace('_', ' ')} Sensor`,
              model: 'Default Model',
              manufacturer: 'Default Manufacturer',
              installation_date: new Date().toISOString(),
              location: 'Field',
              status: 'operational',
              component_type: 'sensor',
              dynamic_attributes: {
                sensor_type: sensorName,
                measurement_unit: sensorName.includes('temperature') ? '°C' : 'm/s',
                calibration_date: new Date().toISOString(),
              },
            });
        }
      }
    }

    if (plantType === 'wind') {
      const turbineType = assetTypes.find(type => type.name === 'Wind Turbine');
      if (turbineType) {
        // Create 3 default wind turbines
        for (let i = 1; i <= 3; i++) {
          await supabase
            .from('assets')
            .insert({
              plant_id: plantId,
              type_id: turbineType.id,
              name: `Wind Turbine ${i}`,
              model: 'Default Wind Turbine',
              manufacturer: 'Default Manufacturer',
              installation_date: new Date().toISOString(),
              location: `Turbine Location ${i}`,
              status: 'operational',
              rated_power: 2000, // 2MW default capacity
              efficiency: 95,
              component_type: 'turbine',
              dynamic_attributes: {
                hub_height: 80,
                rotor_diameter: 90,
                cut_in_speed: 3,
                cut_out_speed: 25,
                rated_wind_speed: 12,
              },
            });
        }
      }
    }

    // For solar plants, keep existing solar array creation logic
    if (plantType === 'solar') {
      const arrayType = assetTypes.find(type => type.name === 'Solar Array');
      const panelType = assetTypes.find(type => type.name === 'Solar Panel');
      const inverterType = assetTypes.find(type => type.name === 'Inverter');

      if (arrayType && panelType && inverterType) {
        // Create array
        const { data: array } = await supabase
          .from('assets')
          .insert({
            plant_id: plantId,
            type_id: arrayType.id,
            name: 'Solar Array 1',
            model: 'Default Array',
            manufacturer: 'Default Manufacturer',
            installation_date: new Date().toISOString(),
            location: 'Field',
            status: 'operational',
            component_type: 'array',
          })
          .select()
          .single();

        if (array) {
          // Create panels
          for (let i = 1; i <= 10; i++) {
            await supabase
              .from('assets')
              .insert({
                plant_id: plantId,
                type_id: panelType.id,
                parent_id: array.id,
                name: `Solar Panel ${i}`,
                model: 'Default Panel',
                manufacturer: 'Default Manufacturer',
                installation_date: new Date().toISOString(),
                location: 'Field',
                status: 'operational',
                component_type: 'panel',
              });
          }

          // Create inverter
          await supabase
            .from('assets')
            .insert({
              plant_id: plantId,
              type_id: inverterType.id,
              parent_id: array.id,
              name: 'Main Inverter',
              model: 'Default Inverter',
              manufacturer: 'Default Manufacturer',
              installation_date: new Date().toISOString(),
              location: 'Field',
              status: 'operational',
              component_type: 'inverter',
            });
        }
      }
    }
  };

  const onSubmit = async (values: PlantFormValues) => {
    try {
      const { data: plant, error } = await supabase
        .from("plants")
        .insert({
          site_id: siteId,
          name: values.name,
          type: values.type,
          capacity: values.capacity,
          location: values.location,
          current_output: 0,
          efficiency: 0,
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;

      if (plant) {
        await createDefaultAssets(plant.id, values.type);
      }

      toast({
        title: "Success",
        description: "Plant created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["plants", siteId] });
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error creating plant:", error);
      toast({
        title: "Error",
        description: "Failed to create plant",
        variant: "destructive",
      });
    }
  };

  const handleDeletePlant = async (plantId: string) => {
    try {
      const { error } = await supabase
        .from("plants")
        .delete()
        .eq("id", plantId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Plant deleted successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["plants", siteId] });
    } catch (error) {
      console.error("Error deleting plant:", error);
      toast({
        title: "Error",
        description: "Failed to delete plant",
        variant: "destructive",
      });
    }
  };
  
  const filteredPlants = plants.filter(plant => 
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCapacity = plants.reduce((sum, plant) => sum + Number(plant.capacity), 0);
  const totalCurrentOutput = plants.reduce((sum, plant) => sum + Number(plant.current_output), 0);

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground">Loading plants...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Plants Overview</h3>
          <p className="text-sm text-muted-foreground">
            Total output: {totalCurrentOutput} kW / {totalCapacity} kW
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Plant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Plant</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacity (kW)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full">
                    Create Plant
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlants.map((plant) => (
          <PlantCard 
            key={plant.id} 
            plant={plant} 
            onDelete={() => handleDeletePlant(plant.id)}
          />
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No plants found matching your search.
        </div>
      )}
    </div>
  );
};
