import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

interface DynamicFieldsProps {
  form: UseFormReturn<any>;
  attributes: Record<string, any>;
}

export const DynamicFields = ({ form, attributes }: DynamicFieldsProps) => {
  if (!attributes || Object.keys(attributes).length === 0) return null;

  const formatFieldLabel = (key: string) => {
    if (!key) return '';
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <Card className="md:col-span-2">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Type-Specific Attributes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(attributes).map(([key, config]: [string, any]) => {
            const fieldConfig = config as {
              type: string;
              label: string;
              unit?: string;
              options?: string[];
            };

            const fieldLabel = fieldConfig.label || formatFieldLabel(key);

            return (
              <FormField
                key={key}
                control={form.control}
                name={`dynamic_attributes.${key}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{fieldLabel}</FormLabel>
                    <FormControl>
                      {fieldConfig.type === 'select' && fieldConfig.options ? (
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={`Select ${fieldLabel.toLowerCase()}`} />
                          </SelectTrigger>
                          <SelectContent>
                            {fieldConfig.options.map((option) => (
                              <SelectItem key={option} value={option}>
                                {formatFieldLabel(option)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          type={fieldConfig.type === 'number' ? 'number' : 'text'}
                          {...field}
                          placeholder={`Enter ${fieldLabel.toLowerCase()}`}
                        />
                      )}
                    </FormControl>
                    {fieldConfig.unit && (
                      <FormDescription>
                        Unit: {fieldConfig.unit}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};