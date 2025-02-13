import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Download, Upload, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plant } from "@/types/site";
import { supabase } from "@/lib/supabase";
import Papa from 'papaparse';
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImportPanelsDialogProps {
  plant: Plant;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface PanelData {
  name: string;
  model: string;
  location: string;
  installation_date: string;
  status: string;
  power_capacity?: number;
  efficiency?: number;
  manufacturer?: string;
  notes?: string;
  string_number?: number;
}

const REQUIRED_FIELDS = ['name', 'model', 'location', 'installation_date', 'status'];
const TEMPLATE_HEADERS = [
  'name',
  'model',
  'location',
  'installation_date',
  'status',
  'power_capacity',
  'efficiency',
  'manufacturer',
  'notes',
  'string_number'
];

const TEMPLATE_DATA = [
  {
    name: 'Panel-01',
    model: 'Model-X',
    location: 'Zone A',
    installation_date: '2025-01-15',
    status: 'operational',
    power_capacity: '5.0',
    efficiency: '18.5',
    manufacturer: 'SolarCo',
    notes: 'Installed near inverter',
    string_number: '1'
  },
  {
    name: 'Panel-02',
    model: 'Model-Y',
    location: 'Zone B',
    installation_date: '2025-02-01',
    status: 'operational',
    power_capacity: '4.5',
    efficiency: '16.7',
    manufacturer: 'SolarTech',
    notes: 'Requires maintenance',
    string_number: '1'
  }
];

export const ImportPanelsDialog: React.FC<ImportPanelsDialogProps> = ({
  plant,
  open,
  onClose,
  onSuccess
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<PanelData[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedArrayId, setSelectedArrayId] = useState<string>("");
  const [panelsPerString, setPanelsPerString] = useState<number>(0);
  const [numberOfStrings, setNumberOfStrings] = useState<number>(0);

  // Fetch available solar arrays with their configuration
  const { data: solarArrays } = useQuery({
    queryKey: ['assets', plant.id, 'arrays'],
    queryFn: async () => {
      const { data: typeData } = await supabase
        .from('asset_types')
        .select('id')
        .eq('name', 'Solar Array')
        .single();

      if (!typeData) return [];

      const { data, error } = await supabase
        .from('assets')
        .select(`
          id, 
          name,
          dynamic_attributes
        `)
        .eq('plant_id', plant.id)
        .eq('type_id', typeData.id);
      
      if (error) throw error;
      return data;
    }
  });

  // Update configuration when array is selected
  useEffect(() => {
    const selectedArray = solarArrays?.find(array => array.id === selectedArrayId);
    if (selectedArray?.dynamic_attributes) {
      setPanelsPerString(selectedArray.dynamic_attributes.panels_per_string || 0);
      setNumberOfStrings(selectedArray.dynamic_attributes.number_of_strings || 0);
    }
  }, [selectedArrayId, solarArrays]);

  const validateData = (data: PanelData[]): string[] => {
    const errors: string[] = [];
    
    // Group panels by string number
    const stringAssignments: Record<number, number> = {};
    
    data.forEach((row, index) => {
      REQUIRED_FIELDS.forEach(field => {
        if (!row[field as keyof PanelData]) {
          errors.push(`Row ${index + 1}: Missing required field '${field}'`);
        }
      });

      if (row.power_capacity && isNaN(Number(row.power_capacity))) {
        errors.push(`Row ${index + 1}: Invalid power capacity value`);
      }

      if (row.efficiency && (isNaN(Number(row.efficiency)) || Number(row.efficiency) < 0 || Number(row.efficiency) > 100)) {
        errors.push(`Row ${index + 1}: Invalid efficiency value (must be between 0 and 100)`);
      }

      if (row.installation_date && !/^\d{4}-\d{2}-\d{2}$/.test(row.installation_date)) {
        errors.push(`Row ${index + 1}: Invalid date format (use YYYY-MM-DD)`);
      }

      if (row.status && !['operational', 'maintenance', 'offline'].includes(row.status)) {
        errors.push(`Row ${index + 1}: Invalid status (must be operational, maintenance, or offline)`);
      }

      // Validate string assignments
      if (row.string_number) {
        const stringNum = Number(row.string_number);
        if (isNaN(stringNum) || stringNum < 1 || stringNum > numberOfStrings) {
          errors.push(`Row ${index + 1}: Invalid string number (must be between 1 and ${numberOfStrings})`);
        } else {
          stringAssignments[stringNum] = (stringAssignments[stringNum] || 0) + 1;
          if (stringAssignments[stringNum] > panelsPerString) {
            errors.push(`Row ${index + 1}: String ${stringNum} exceeds maximum panels per string (${panelsPerString})`);
          }
        }
      } else {
        errors.push(`Row ${index + 1}: Missing string number assignment`);
      }
    });

    return errors;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);
    
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data as PanelData[];
        setParsedData(data);
        const errors = validateData(data);
        setValidationErrors(errors);
      },
      error: (error) => {
        toast({
          title: "Error",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive",
        });
      }
    });
  };

  const handleImport = async () => {
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please fix all errors before importing.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedArrayId) {
      toast({
        title: "Validation Error",
        description: "Please select a solar array to associate the panels with.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsImporting(true);

      // First get the solar panel type ID
      const { data: typeData, error: typeError } = await supabase
        .from('asset_types')
        .select('id')
        .eq('name', 'Solar Panel')
        .single();
      
      if (typeError) throw new Error('Failed to get solar panel type');
      
      const panelTypeId = typeData.id;

      // Get current string assignments for the array
      const { data: currentArray } = await supabase
        .from('assets')
        .select('dynamic_attributes')
        .eq('id', selectedArrayId)
        .single();

      const currentAssignments = currentArray?.dynamic_attributes?.string_assignments || {};

      // Prepare the data for import
      const assetsToInsert = parsedData.map(panel => ({
        name: panel.name,
        type_id: panelTypeId,
        plant_id: plant.id,
        site_id: plant.site_id,
        model: panel.model,
        manufacturer: panel.manufacturer,
        location: panel.location,
        installation_date: panel.installation_date,
        status: panel.status,
        rated_power: panel.power_capacity ? Number(panel.power_capacity) : null,
        efficiency: panel.efficiency ? Number(panel.efficiency) : null,
        notes: panel.notes,
        parent_asset_id: selectedArrayId,
      }));

      // Insert the panels
      const { data: insertedPanels, error: insertError } = await supabase
        .from('assets')
        .insert(assetsToInsert)
        .select('id');

      if (insertError) throw insertError;

      // Update the array's string assignments
      const newAssignments = { ...currentAssignments };
      insertedPanels?.forEach((panel, index) => {
        const stringNumber = parsedData[index].string_number;
        if (stringNumber) {
          newAssignments[panel.id] = Number(stringNumber);
        }
      });

      const { error: updateError } = await supabase
        .from('assets')
        .update({
          dynamic_attributes: {
            ...currentArray?.dynamic_attributes,
            string_assignments: newAssignments,
            attached_panels: Object.keys(newAssignments)
          }
        })
        .eq('id', selectedArrayId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Successfully imported ${parsedData.length} panels`,
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to import panels",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Import Solar Panels</DialogTitle>
          <DialogDescription>
            Upload a CSV file with solar panel details and assign them to strings in the selected array.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4 overflow-hidden">
          {/* Solar Array Selection */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Select Solar Array</h4>
            <Select
              value={selectedArrayId}
              onValueChange={setSelectedArrayId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a solar array" />
              </SelectTrigger>
              <SelectContent>
                {solarArrays?.map((array) => (
                  <SelectItem key={array.id} value={array.id}>
                    {array.name} ({array.dynamic_attributes?.number_of_strings || 0} strings, {array.dynamic_attributes?.panels_per_string || 0} panels/string)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedArrayId && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Selected array configuration: {numberOfStrings} strings with {panelsPerString} panels per string.
                Please ensure your CSV includes a 'string_number' column (1-{numberOfStrings}).
              </AlertDescription>
            </Alert>
          )}

          {/* Template Download */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Template</h4>
              <p className="text-sm text-muted-foreground">
                Download the template file to see the required format
              </p>
            </div>
            <Button onClick={() => {
              const csv = Papa.unparse({
                fields: TEMPLATE_HEADERS,
                data: TEMPLATE_DATA
              });
              
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'solar_panels_template.csv';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>

            {file && (
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm">{file.name}</span>
                <Badge variant="outline">
                  {parsedData.length} panels
                </Badge>
              </div>
            )}
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Please fix the following errors:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index} className="text-sm">{error}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Preview Table */}
          {parsedData.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Preview</h4>
              <ScrollArea className="h-[300px] border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {TEMPLATE_HEADERS.map((header) => (
                        <TableHead key={header}>
                          {header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.map((row, index) => (
                      <TableRow key={index}>
                        {TEMPLATE_HEADERS.map((header) => (
                          <TableCell key={header}>
                            {row[header as keyof PanelData] || '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={!parsedData.length || validationErrors.length > 0 || isImporting}
          >
            {isImporting ? "Importing..." : "Import Panels"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 