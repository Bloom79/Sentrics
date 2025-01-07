import React from "react";
import { Plant, GridConnection } from "@/types/site";
import { SiteRow } from "./DetailedMetrics/SiteRow";
import { PlantRow } from "./DetailedMetrics/PlantRow";

const mockSites = [
  {
    id: "1",
    name: "Solar Farm Alpha",
    location: { latitude: 41.9028, longitude: 12.4964 },
    plants: [
      {
        id: "1",
        name: "Solar Array 1",
        type: "solar" as const,
        capacity: 500,
        currentOutput: 350,
        efficiency: 85,
        status: "operational",
        location: { latitude: 41.9028, longitude: 12.4964 }
      },
      {
        id: "2",
        name: "Wind Farm 1",
        type: "wind" as const,
        capacity: 1000,
        currentOutput: 750,
        efficiency: 80,
        status: "operational",
        location: { latitude: 41.9028, longitude: 12.4964 }
      }
    ],
    gridConnection: {
      status: "online",
      frequency: 50,
      voltage: 400,
      congestion: "Low" as const,
      capacity: 2000
    }
  },
  {
    id: "2",
    name: "Wind Farm Beta",
    location: { latitude: 34.0522, longitude: -118.2437 },
    plants: [
      {
        id: "3",
        name: "Wind Turbine 1",
        type: "wind" as const,
        capacity: 1500,
        currentOutput: 1200,
        efficiency: 75,
        status: "operational",
        location: { latitude: 34.0522, longitude: -118.2437 }
      }
    ],
    gridConnection: {
      status: "online",
      frequency: 50,
      voltage: 400,
      congestion: "Medium" as const,
      capacity: 1500
    }
  }
];

export const DetailedMetrics = () => {
  return (
    <div className="space-y-8">
      {mockSites.map((site) => (
        <div key={site.id} className="space-y-4">
          <SiteRow site={site} />
          {site.plants.map((plant) => (
            <PlantRow key={plant.id} plant={plant} />
          ))}
        </div>
      ))}
    </div>
  );
};
