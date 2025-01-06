import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Site } from "@/types/site";
import { GridConnectionInfo } from "./DetailedMetrics/GridConnectionInfo";
import { StorageInfo } from "./DetailedMetrics/StorageInfo";
import { EnergySourceInfo } from "./DetailedMetrics/EnergySourceInfo";
import { SiteRow } from "./DetailedMetrics/SiteRow";

const mockSites: Site[] = [
  {
    id: "1",
    name: "Milano Nord",
    location: "Northern Region",
    type: "hybrid",
    capacity: 800,
    status: "online",
    lastUpdate: new Date().toISOString(),
    dailyProduction: 2500,
    monthlyProduction: 75000,
    efficiency: 92,
    co2Saved: 45.2,
    plants: [
      {
        id: "1",
        name: "Solar Array A",
        type: "solar",
        capacity: 500,
        currentOutput: 350,
        efficiency: 95,
        status: "online"
      },
      {
        id: "2",
        name: "Wind Farm B",
        type: "wind",
        capacity: 300,
        currentOutput: 250,
        efficiency: 89,
        status: "online"
      }
    ],
    energySources: [
      { type: "solar", output: 350, capacity: 500, currentOutput: 350, status: "online" },
      { type: "wind", output: 250, capacity: 300, currentOutput: 250, status: "online" }
    ],
    storage: { capacity: 1000, currentCharge: 750 },
    storageUnits: [
      {
        id: "1",
        name: "BESS Unit 1",
        capacity: 1000,
        currentCharge: 750,
        status: "charging"
      }
    ],
    gridConnection: {
      status: "connected",
      frequency: 50.02,
      voltage: 230.5,
      congestion: "Low"
    }
  },
  {
    id: "2",
    name: "Roma Sud",
    location: "Central Region",
    type: "solar",
    capacity: 500,
    status: "offline",
    lastUpdate: new Date().toISOString(),
    dailyProduction: 0,
    monthlyProduction: 0,
    efficiency: 0,
    co2Saved: 0,
    plants: [],
    energySources: [],
    storage: { capacity: 500, currentCharge: 0 },
    storageUnits: [],
    gridConnection: {
      status: "disconnected",
      frequency: 0,
      voltage: 0,
      congestion: "None"
    }
  },
  {
    id: "3",
    name: "Torino Est",
    location: "Northern Region",
    type: "wind",
    capacity: 600,
    status: "maintenance",
    lastUpdate: new Date().toISOString(),
    dailyProduction: 1000,
    monthlyProduction: 30000,
    efficiency: 85,
    co2Saved: 20,
    plants: [
      {
        id: "3",
        name: "Wind Turbine A",
        type: "wind",
        capacity: 600,
        currentOutput: 500,
        efficiency: 85,
        status: "maintenance"
      }
    ],
    energySources: [
      { type: "wind", output: 500, capacity: 600, currentOutput: 500, status: "maintenance" }
    ],
    storage: { capacity: 300, currentCharge: 150 },
    storageUnits: [],
    gridConnection: {
      status: "connected",
      frequency: 50.00,
      voltage: 230.0,
      congestion: "Low"
    }
  }
];

const DetailedMetrics = () => {
  return (
    <div>
      {mockSites.map((site) => (
        <Card key={site.id} className="mb-4">
          <CardHeader>
            <CardTitle>{site.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <SiteRow site={site} />
            <GridConnectionInfo connection={site.gridConnection} />
            <StorageInfo storage={site.storage} />
            <div className="space-y-4">
              {site.energySources.map((source, index) => (
                <EnergySourceInfo key={index} sources={[source]} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DetailedMetrics;
