import React from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Info, Settings, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AssetType } from "@/types/site";
import { AssetFormValues } from "@/lib/validations/asset";

// Common plant zones/locations
const COMMON_LOCATIONS = [
  "Zone A",
  "Zone B",
  "Zone C",
  "Control Room",
  "Transformer Bay",
  "Maintenance Facility",
  "Power Control Section",
  "Substation Building",
  "Other (Specify)",
] as const;

interface CommonFieldsProps {
  form: UseFormReturn<AssetFormValues>;
  assetTypes: AssetType[];
  selectedType: AssetType | null;
  onTypeChange: (type: AssetType | null) => void;
}

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="flex items-center gap-1">
    {children}
    <span className="text-destructive">*</span>
  </span>
);

const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
    <Icon className="w-5 h-5 text-muted-foreground" />
    {title}
  </h3>
);

export const CommonFields = ({ form, assetTypes, selectedType, onTypeChange }: CommonFieldsProps) => {
  const [isCustomLocation, setIsCustomLocation] = React.useState(false);
  const selectedLocation = form.watch("location");

  React.useEffect(() => {
    if (selectedLocation === "Other (Specify)") {
      setIsCustomLocation(true);
    } else {
      setIsCustomLocation(false);
    }
  }, [selectedLocation]);

  return (
    <Card>
      <CardContent className="pt-6">
        <SectionTitle icon={Settings} title="Basic Information" />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabel>Asset Name</RequiredLabel>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter asset name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabel>Asset Type</RequiredLabel>
                </FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    const type = assetTypes?.find(t => t.id === value) || null;
                    onTypeChange(type);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <RequiredLabel>Model</RequiredLabel>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter model number" {...field} />
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
                <FormLabel>
                  <RequiredLabel>Manufacturer</RequiredLabel>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter manufacturer name" {...field} />
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
                <FormLabel className="flex items-center gap-2">
                  <RequiredLabel>Internal Location</RequiredLabel>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Specify where this asset is located within the plant</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
                {!isCustomLocation ? (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_LOCATIONS.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <FormControl>
                    <Input placeholder="Enter custom location" {...field} />
                  </FormControl>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="installation_date"
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
        </div>
      </CardContent>
    </Card>
  );
};