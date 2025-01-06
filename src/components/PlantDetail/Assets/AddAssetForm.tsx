import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { assetSchema } from "./schemas/assetSchemas";
import { CommonFields } from "./FormFields/CommonFields";
import { SolarPanelFields } from "./FormFields/SolarPanelFields";
import { InverterFields } from "./FormFields/InverterFields";
import { WindTurbineFields } from "./FormFields/WindTurbineFields";
import { TransformerFields } from "./FormFields/TransformerFields";
import { BatteryFields } from "./FormFields/BatteryFields";

interface AddAssetFormProps {
  plantType: "solar" | "wind" | "hybrid";
}

export const AddAssetForm = ({ plantType }: AddAssetFormProps) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = React.useState<string>("panel");
  
  const form = useForm({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      type: "panel",
      status: "operational",
    },
  });

  const onSubmit = (values: any) => {
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

  const renderAssetSpecificFields = () => {
    switch (selectedType) {
      case "panel":
        return <SolarPanelFields form={form} />;
      case "inverter":
        return <InverterFields form={form} />;
      case "turbine":
        return <WindTurbineFields form={form} />;
      case "transformer":
        return <TransformerFields form={form} />;
      case "battery":
        return <BatteryFields form={form} />;
      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div className="mb-6">
            <label className="text-sm font-medium">Asset Type</label>
            <Select 
              onValueChange={(value) => {
                setSelectedType(value);
                form.reset({ type: value as any, status: "operational" });
              }} 
              defaultValue={selectedType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select asset type" />
              </SelectTrigger>
              <SelectContent>
                {getAssetTypes().map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <CommonFields form={form} />
          {renderAssetSpecificFields()}
        </div>

        <Button type="submit" className="w-full">Add Asset</Button>
      </form>
    </Form>
  );
};