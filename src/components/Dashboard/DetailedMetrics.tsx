import React from "react";
import { Plant, GridConnection, Site } from "@/types/site";
import { SiteRow } from "./DetailedMetrics/SiteRow";
import { PlantRow } from "./DetailedMetrics/PlantRow";

interface DetailedMetricsProps {
  selectedSiteId: string | null;
  onSiteSelect: (siteId: string) => void;
  searchTerm: string;
  selectedStatus: string;
  selectedTimeRange: string;
}

const mockSites: Site[] = [
  {
    id: "1",
    name: "Solar Farm Alpha",
    type: "hybrid",
    capacity: 1500,
    status: "operational",
    lastUpdate: new Date().toISOString(),
    efficiency: 85,
    co2Saved: 45.2,
    location: { latitude: 41.9028, longitude: 12.4964 },
    plants: [
      {
        id: "1",
        name: "Solar Array 1",
        type: "solar",
        capacity: 500,
        currentOutput: 350,
        efficiency: 85,
        status: "operational",
        location: { latitude: 41.9028, longitude: 12.4964 }
      },
      {
        id: "2",
        name: "Wind Farm 1",
        type: "wind",
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
      congestion: "Low",
      capacity: 2000
    },
    consumers: [],
    storageUnits: [],
    energySources: [
      { type: "solar", output: 350, capacity: 500, currentOutput: 350, status: "online" },
      { type: "wind", output: 750, capacity: 1000, currentOutput: 750, status: "online" }
    ],
    storage: { capacity: 1000, currentCharge: 800 },
    dailyProduction: 2500,
    monthlyProduction: 75000
  },
  {
    id: "2",
    name: "Wind Farm Beta",
    type: "wind",
    capacity: 1500,
    status: "operational",
    lastUpdate: new Date().toISOString(),
    efficiency: 75,
    co2Saved: 38.5,
    location: { latitude: 34.0522, longitude: -118.2437 },
    plants: [
      {
        id: "3",
        name: "Wind Turbine 1",
        type: "wind",
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
      congestion: "Medium",
      capacity: 1500
    },
    consumers: [],
    storageUnits: [],
    energySources: [
      { type: "wind", output: 1200, capacity: 1500, currentOutput: 1200, status: "online" }
    ],
    storage: { capacity: 800, currentCharge: 600 },
    dailyProduction: 2100,
    monthlyProduction: 63000
  }
];

const DetailedMetrics: React.FC<DetailedMetricsProps> = ({
  selectedSiteId,
  onSiteSelect,
  searchTerm,
  selectedStatus,
  selectedTimeRange
}) => {
  const filteredSites = mockSites.filter(site => {
    if (searchTerm && !site.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (selectedStatus !== "all" && site.status !== selectedStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {filteredSites.map((site) => (
        <div key={site.id} className="space-y-4">
          <SiteRow site={site} isExpanded={selectedSiteId === site.id} onToggle={() => onSiteSelect(site.id)} />
          {selectedSiteId === site.id && site.plants.map((plant) => (
            <PlantRow key={plant.id} plant={plant} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default DetailedMetrics;