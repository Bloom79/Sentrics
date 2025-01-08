import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Play, Upload } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const EnergySimulation = () => {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    dortmund: null,
    castelMadama: null,
    catania: null,
    rome: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handleFileChange = (location: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({
        ...prev,
        [location]: e.target.files![0]
      }));
    }
  };

  const handleSimulation = async () => {
    setIsLoading(true);
    try {
      // Upload files to Supabase storage
      const uploadedFiles = [];
      for (const [location, file] of Object.entries(files)) {
        if (file) {
          const filePath = `simulations/${location}/${file.name}`;
          const { error: uploadError } = await supabase.storage
            .from('consumption_files')
            .upload(filePath, file);

          if (uploadError) throw uploadError;
          
          uploadedFiles.push({
            location,
            filename: file.name
          });
        }
      }

      // Call the simulation edge function
      const { data, error } = await supabase.functions.invoke('run-simulation', {
        body: { files: uploadedFiles }
      });

      if (error) throw error;

      setResults(data);
      toast({
        title: "Simulation Complete",
        description: "The energy simulation has been completed successfully.",
      });

    } catch (error) {
      console.error('Simulation error:', error);
      toast({
        title: "Simulation Error",
        description: "An error occurred while running the simulation.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Energy Simulation</h2>
        <p className="text-muted-foreground">
          Upload CSV files and run energy consumption simulations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Files</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries({
              dortmund: "Dortmund Data",
              castelMadama: "Castel Madama Data",
              catania: "Catania Data",
              rome: "Rome Data"
            }).map(([key, label]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key}>{label}</Label>
                <div className="flex gap-2">
                  <Input
                    id={key}
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange(key)}
                  />
                  {files[key] && (
                    <div className="text-sm text-muted-foreground">
                      {files[key]?.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulation Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleSimulation}
              disabled={isLoading || !Object.values(files).some(f => f)}
              className="w-full"
            >
              {isLoading ? (
                "Running Simulation..."
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Simulation
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {results && (
        <div className="grid grid-cols-1 gap-6">
          {results.data.map((locationData: any, index: number) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{locationData.location} Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={locationData.hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="timestamp" />
                      <YAxis label={{ value: 'MWh', angle: -90, position: 'insideLeft' }} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="production" 
                        stroke="#2563eb" 
                        name="Production"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="consumption" 
                        stroke="#dc2626" 
                        name="Consumption"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="batteryCharge" 
                        stroke="#16a34a" 
                        name="Battery Charge"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="netEnergy" 
                        stroke="#9333ea" 
                        name="Net Energy"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnergySimulation;