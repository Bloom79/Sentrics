import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { useToast } from "@/hooks/use-toast";

const baseAssetSchema = z.object({
  serialNumber: z.string().min(1, "Serial number is required"),
  model: z.string().min(1, "Model is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  location: z.string().min(1, "Location is required"),
  installationDate: z.string().min(1, "Installation date is required"),
  status: z.enum(["operational", "maintenance", "fault"]),
});

const solarPanelSchema = baseAssetSchema.extend({
  type: z.literal("panel"),
  ratedPower: z.coerce.number().min(0),
  efficiency: z.coerce.number().min(0).max(100),
  orientation: z.string().optional(),
  tilt: z.coerce.number().min(0).max(90).optional(),
  currentOutput: z.coerce.number().min(0).optional(),
});

const inverterSchema = baseAssetSchema.extend({
  type: z.literal("inverter"),
  efficiency: z.coerce.number().min(0).max(100),
  ratedPower: z.coerce.number().min(0),
  dcInputMin: z.coerce.number().min(0).optional(),
  dcInputMax: z.coerce.number().min(0).optional(),
  currentOutput: z.coerce.number().min(0).optional(),
});

const windTurbineSchema = baseAssetSchema.extend({
  type: z.literal("turbine"),
  ratedCapacity: z.coerce.number().min(0),
  rotorDiameter: z.coerce.number().min(0),
  hubHeight: z.coerce.number().min(0),
  cutInSpeed: z.coerce.number().min(0),
  cutOutSpeed: z.coerce.number().min(0),
  currentOutput: z.coerce.number().min(0).optional(),
});

const transformerSchema = baseAssetSchema.extend({
  type: z.literal("transformer"),
  capacity: z.coerce.number().min(0),
  voltageIn: z.coerce.number().min(0),
  voltageOut: z.coerce.number().min(0),
  efficiency: z.coerce.number().min(0).max(100),
});

const batterySchema = baseAssetSchema.extend({
  type: z.literal("battery"),
  technology: z.enum(["lithium-ion", "lead-acid", "flow"]),
  ratedPower: z.coerce.number().min(0),
  energyCapacity: z.coerce.number().min(0),
  stateOfCharge: z.coerce.number().min(0).max(100).optional(),
  roundTripEfficiency: z.coerce.number().min(0).max(100).optional(),
  cycleCount: z.coerce.number().min(0).optional(),
});

const assetSchema = z.discriminatedUnion("type", [
  solarPanelSchema,
  inverterSchema,
  windTurbineSchema,
  transformerSchema,
  batterySchema,
]);

export const AddAssetForm = ({ plantType }: { plantType: "solar" | "wind" | "hybrid" }) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = React.useState<string>("panel");
  
  const form = useForm<z.infer<typeof assetSchema>>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      type: "panel",
      status: "operational",
    },
  });

  const onSubmit = (values: z.infer<typeof assetSchema>) => {
    console.log(values);
    toast({
      title: "Asset added successfully",
      description: `New ${values.type} has been added to the plant.`,
    });
  };

  // Get available asset types based on plant type
  const getAssetTypes = () => {
    switch (plantType) {
      case "solar":
        return [
          { value: "panel", label: "Solar Panel" },
          { value: "inverter", label: "Inverter" },
          { value: "transformer", label: "Transformer" },
          { value: "battery", label: "Battery Storage" },
        ];
      case "wind":
        return [
          { value: "turbine", label: "Wind Turbine" },
          { value: "transformer", label: "Transformer" },
          { value: "battery", label: "Battery Storage" },
        ];
      case "hybrid":
        return [
          { value: "panel", label: "Solar Panel" },
          { value: "inverter", label: "Inverter" },
          { value: "turbine", label: "Wind Turbine" },
          { value: "transformer", label: "Transformer" },
          { value: "battery", label: "Battery Storage" },
        ];
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
              <FormLabel>Asset Type</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  setSelectedType(value);
                  form.reset({ type: value as any, status: "operational" });
                }} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getAssetTypes().map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Common Fields */}
        <FormField
          control={form.control}
          name="serialNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serial Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter serial number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model</FormLabel>
              <FormControl>
                <Input placeholder="Enter model" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="manufacturer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manufacturer</FormLabel>
              <FormControl>
                <Input placeholder="Enter manufacturer" {...field} />
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
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="installationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Installation Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="fault">Fault</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Type-specific fields */}
        {selectedType === "panel" && (
          <>
            <FormField
              control={form.control}
              name="ratedPower"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rated Power (W)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter rated power" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="efficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Efficiency (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter efficiency" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {selectedType === "inverter" && (
          <>
            <FormField
              control={form.control}
              name="efficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Efficiency (%)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter efficiency" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ratedPower"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rated Power (kW)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter rated power" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {selectedType === "turbine" && (
          <>
            <FormField
              control={form.control}
              name="ratedCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rated Capacity (MW)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter rated capacity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rotorDiameter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rotor Diameter (m)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter rotor diameter" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hubHeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hub Height (m)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter hub height" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {selectedType === "transformer" && (
          <>
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity (MVA)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter capacity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="voltageIn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Input Voltage (kV)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter input voltage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="voltageOut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Output Voltage (kV)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter output voltage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {selectedType === "battery" && (
          <>
            <FormField
              control={form.control}
              name="technology"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Battery Technology</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select technology" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="lithium-ion">Lithium-Ion</SelectItem>
                      <SelectItem value="lead-acid">Lead-Acid</SelectItem>
                      <SelectItem value="flow">Flow Battery</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ratedPower"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rated Power (kW)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter rated power" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="energyCapacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Energy Capacity (kWh)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter energy capacity" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" className="w-full">Add Asset</Button>
      </form>
    </Form>
  );
};