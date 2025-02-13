import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sliders, HelpCircle, Plus, Trash2, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AssetFormValues } from "@/lib/validations/asset";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AssetType } from "@/types/site";
import { Checkbox } from "@/components/ui/checkbox";

interface StringData {
  code: string;
  combiner_box: string;
  fault_status: "normal" | "warning" | "fault";
  panels: string[];
}

interface DynamicFieldsProps {
  form: UseFormReturn<AssetFormValues>;
  attributes: Record<string, any>;
  assetType?: AssetType | null;
  availablePanels?: Array<{
    id: string;
    name: string;
    manufacturer: string;
    model: string;
    rated_power: number;
  }>;
}

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="flex items-center gap-1">
    {children}
    <span className="text-destructive">*</span>
  </span>
);

const FieldHelp = ({ text }: { text: string }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <HelpCircle className="w-4 h-4 ml-1 text-muted-foreground" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export const DynamicFields = ({ form, attributes, assetType, availablePanels = [] }: DynamicFieldsProps) => {
  const attributeEntries = Object.entries(attributes);
  const numColumns = Math.min(3, Math.ceil(attributeEntries.length / 2));
  const isSolarArray = assetType?.name === "Solar Array";
  const [selectedPanels, setSelectedPanels] = useState<string[]>([]);

  const strings = form.watch("dynamic_attributes.strings") as Record<string, StringData>;

  const addNewString = () => {
    const currentStrings = form.getValues("dynamic_attributes.strings") as Record<string, StringData> || {};
    const stringCount = Object.keys(currentStrings).length;
    const newStringCode = `STR${(stringCount + 1).toString().padStart(3, '0')}`;
    
    form.setValue("dynamic_attributes.strings", {
      ...currentStrings,
      [newStringCode]: {
        code: newStringCode,
        combiner_box: "",
        fault_status: "normal",
        panels: []
      }
    });
  };

  const removeString = (stringId: string) => {
    const currentStrings = form.getValues("dynamic_attributes.strings") as Record<string, StringData>;
    const { [stringId]: _, ...rest } = currentStrings;
    form.setValue("dynamic_attributes.strings", rest);
  };

  const getAssignedPanels = (stringId: string): string[] => {
    const strings = form.getValues("dynamic_attributes.strings") as Record<string, StringData>;
    return strings[stringId]?.panels || [];
  };

  const getUnassignedPanels = () => {
    const strings = form.getValues("dynamic_attributes.strings") as Record<string, StringData>;
    const allAssignedPanels = new Set(
      Object.values(strings).flatMap(string => string.panels || [])
    );
    return availablePanels?.filter(panel => !allAssignedPanels.has(panel.id)) || [];
  };

  const handlePanelSelection = (panelId: string) => {
    setSelectedPanels(prev => 
      prev.includes(panelId) 
        ? prev.filter(id => id !== panelId)
        : [...prev, panelId]
    );
  };

  const assignSelectedPanels = (stringId: string) => {
    const strings = form.getValues("dynamic_attributes.strings") as Record<string, StringData>;
    const currentString = strings[stringId];
    if (!currentString) return;

    const updatedString = {
      ...currentString,
      panels: [...new Set([...currentString.panels, ...selectedPanels])]
    };

    form.setValue("dynamic_attributes.strings", {
      ...strings,
      [stringId]: updatedString
    });
    setSelectedPanels([]);
  };

  const unassignPanels = (stringId: string, panelIds: string[]) => {
    const strings = form.getValues("dynamic_attributes.strings") as Record<string, StringData>;
    const currentString = strings[stringId];
    if (!currentString) return;

    const updatedString = {
      ...currentString,
      panels: currentString.panels.filter(id => !panelIds.includes(id))
    };

    form.setValue("dynamic_attributes.strings", {
      ...strings,
      [stringId]: updatedString
    });
  };

  return (
    <div className="space-y-6">
      <Card>
      <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-muted-foreground" />
            Type-Specific Attributes
          </h3>
          <div className={`grid grid-cols-${numColumns} gap-6`}>
            {attributeEntries.map(([key, attr]) => {
              const fieldName = `dynamic_attributes.${key}` as const;
              const isRequired = attr.required ?? true;

            return (
              <FormField
                key={key}
                control={form.control}
                  name={fieldName}
                render={({ field }) => (
                  <FormItem>
                      <FormLabel>
                        {isRequired ? (
                          <RequiredLabel>{attr.label}</RequiredLabel>
                        ) : (
                          <span className="flex items-center gap-1">
                            {attr.label}
                            {attr.description && <FieldHelp text={attr.description} />}
                          </span>
                        )}
                      </FormLabel>
                    <FormControl>
                        {attr.type === "select" ? (
                        <Select
                            value={field.value?.toString() || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                              <SelectValue placeholder={`Select ${attr.label.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                              {attr.options?.map((opt: string) => (
                                <SelectItem key={opt} value={opt}>
                                  {opt}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          {...field}
                            type={attr.type === "number" ? "number" : "text"}
                            step={attr.type === "number" ? "any" : undefined}
                            placeholder={attr.placeholder}
                            value={field.value?.toString() || ""}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>

      {isSolarArray && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                String Management
                <Badge variant="secondary">
                  {Object.keys(strings || {}).length} Strings
                </Badge>
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addNewString}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add String
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {Object.entries(strings || {}).map(([stringId, string]) => (
                <Card key={stringId}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">String {stringId}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeString(stringId)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-6 mb-6">
                      <FormField
                        control={form.control}
                        name={`dynamic_attributes.strings.${stringId}.code` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              <RequiredLabel>String Code</RequiredLabel>
                            </FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="STR001" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`dynamic_attributes.strings.${stringId}.combiner_box` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Combiner Box</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="CB001" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`dynamic_attributes.strings.${stringId}.fault_status` as const}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fault Status</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="warning">Warning</SelectItem>
                                  <SelectItem value="fault">Fault</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Unassigned Panels */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium">Available Panels</h5>
                          {selectedPanels.length > 0 && (
                            <Button
                              size="sm"
                              onClick={() => assignSelectedPanels(stringId)}
                              className="flex items-center gap-2"
                            >
                              <ArrowRight className="w-4 h-4" />
                              Assign Selected
                            </Button>
                          )}
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {getUnassignedPanels().map((panel) => (
                            <div
                              key={panel.id}
                              className="flex items-center gap-3 p-2 border rounded"
                            >
                              <Checkbox
                                checked={selectedPanels.includes(panel.id)}
                                onCheckedChange={() => handlePanelSelection(panel.id)}
                              />
                              <div>
                                <div className="font-medium">{panel.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {panel.manufacturer} - {panel.model} ({panel.rated_power}W)
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Assigned Panels */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium">Assigned Panels</h5>
                          <Badge>
                            {getAssignedPanels(stringId).length} Panels
                          </Badge>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {availablePanels
                            ?.filter(panel => getAssignedPanels(stringId).includes(panel.id))
                            .map((panel) => (
                              <div
                                key={panel.id}
                                className="flex items-center justify-between p-2 border rounded"
                              >
                                <div>
                                  <div className="font-medium">{panel.name}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {panel.manufacturer} - {panel.model} ({panel.rated_power}W)
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => unassignPanels(stringId, [panel.id])}
                                  className="text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}