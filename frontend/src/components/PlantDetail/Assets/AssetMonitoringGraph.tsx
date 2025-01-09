import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import { useSensorData } from "@/hooks/useSensorData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface AssetMonitoringGraphProps {
  assetId: string;
  nominalValues?: {
    irradiance?: number;
    temperature?: number;
  };
}

const mockSensors = [
  {
    id: "sensor1",
    type: "pyranometer" as const,
    baseValue: 800,
    variance: 50,
    unit: "W/m²",
    location: "Panel Array A",
    description: "Primary irradiance sensor",
    measurementType: "pyranometer"
  },
  {
    id: "sensor2",
    type: "reference_cell" as const,
    baseValue: 25,
    variance: 2,
    unit: "°C",
    location: "Panel Array B",
    description: "Temperature reference cell",
    measurementType: "reference_cell"
  }
];

export const AssetMonitoringGraph = ({
  assetId,
  nominalValues = { irradiance: 1000, temperature: 25 }
}: AssetMonitoringGraphProps) => {
  const sensorData = useSensorData(mockSensors);

  const formatData = (readings: typeof sensorData[string]) => {
    return readings?.map(reading => ({
      timestamp: format(reading.timestamp, 'HH:mm:ss'),
      value: reading.value
    })) || [];
  };

  const getThresholdStatus = (currentValue: number, nominalValue: number, threshold: number) => {
    if (Math.abs(currentValue - nominalValue) / nominalValue > threshold) {
      return {
        status: "warning",
        message: `Value deviation exceeds ${threshold * 100}% of nominal value`
      };
    }
    return {
      status: "normal",
      message: "Operating within normal range"
    };
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Sensor Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="irradiance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="irradiance">Irradiance</TabsTrigger>
            <TabsTrigger value="temperature">Temperature</TabsTrigger>
          </TabsList>

          <TabsContent value="irradiance">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatData(sensorData["sensor1"])}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ 
                      value: "W/m²", 
                      angle: -90, 
                      position: 'insideLeft' 
                    }}
                  />
                  <Tooltip />
                  {nominalValues.irradiance && (
                    <ReferenceLine 
                      y={nominalValues.irradiance} 
                      label="Nominal" 
                      stroke="#ff0000" 
                      strokeDasharray="3 3" 
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    dot={false}
                    name="Irradiance"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="temperature">
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formatData(sensorData["sensor2"])}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="timestamp"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    label={{ 
                      value: "°C", 
                      angle: -90, 
                      position: 'insideLeft' 
                    }}
                  />
                  <Tooltip />
                  {nominalValues.temperature && (
                    <ReferenceLine 
                      y={nominalValues.temperature} 
                      label="Nominal" 
                      stroke="#ff0000" 
                      strokeDasharray="3 3" 
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563eb"
                    dot={false}
                    name="Temperature"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Sensor Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockSensors.map(sensor => {
              const readings = sensorData[sensor.id];
              const latestReading = readings?.[readings.length - 1];
              const nominalValue = sensor.type === 'pyranometer' ? 
                nominalValues.irradiance : 
                nominalValues.temperature;
              
              const status = latestReading && nominalValue ? 
                getThresholdStatus(latestReading.value, nominalValue, 0.15) :
                null;

              return (
                <Card key={sensor.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {sensor.type === 'pyranometer' ? 'Irradiance Sensor' : 'Temperature Sensor'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Location: {sensor.location}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge>{sensor.type}</Badge>
                        <Badge variant="outline">{sensor.measurementType}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{sensor.description}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Reading</p>
                        <p className="font-medium">
                          {latestReading?.value.toFixed(2)} {sensor.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Nominal Value</p>
                        <p className="font-medium">
                          {nominalValue} {sensor.unit}
                        </p>
                      </div>
                    </div>
                    {status && (
                      <div className="mt-2">
                        <Badge variant={status.status === "normal" ? "default" : "destructive"}>
                          {status.message}
                        </Badge>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};