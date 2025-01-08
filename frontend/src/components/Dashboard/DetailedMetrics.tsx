import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteRow } from "./DetailedMetrics/SiteRow";
import { PlantRow } from "./DetailedMetrics/PlantRow";
import { Plant } from "@/types/site";

const mockData = {
  sites: [
    {
      id: "1",
      name: "Milano Nord",
      plants: [
        {
          id: "1",
          name: "Solar Array A",
          type: "solar" as const,
          capacity: 500,
          currentOutput: 350,
          efficiency: 95,
          status: "online" as const,
          location: "Array A"
        },
        {
          id: "2",
          name: "Wind Farm B",
          type: "wind" as const,
          capacity: 300,
          currentOutput: 250,
          efficiency: 89,
          status: "online" as const,
          location: "Array B"
        }
      ],
      energySources: [
        {
          type: "solar",
          output: 350,
          capacity: 500,
          currentOutput: 350,
          status: "online"
        },
        {
          type: "wind",
          output: 250,
          capacity: 300,
          currentOutput: 250,
          status: "online"
        }
      ],
      storage: {
        capacity: 2000,
        currentCharge: 1350
      },
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
      plants: [
        {
          id: "3",
          name: "Solar Array C",
          type: "solar" as const,
          capacity: 400,
          currentOutput: 0,
          efficiency: 92,
          status: "maintenance" as const,
          location: "Array C"
        },
        {
          id: "4",
          name: "Wind Farm D",
          type: "wind" as const,
          capacity: 250,
          currentOutput: 200,
          efficiency: 88,
          status: "online" as const,
          location: "Array D"
        }
      ],
      energySources: [
        {
          type: "solar",
          output: 0,
          capacity: 400,
          currentOutput: 0,
          status: "maintenance"
        },
        {
          type: "wind",
          output: 200,
          capacity: 250,
          currentOutput: 200,
          status: "online"
        }
      ],
      storage: {
        capacity: 1500,
        currentCharge: 900
      },
      gridConnection: {
        status: "connected",
        frequency: 49.98,
        voltage: 230.2,
        congestion: "Medium"
      }
    },
    {
      id: "3",
      name: "Torino Est",
      plants: [
        {
          id: "5",
          name: "Solar Array E",
          type: "solar" as const,
          capacity: 300,
          currentOutput: 280,
          efficiency: 93,
          status: "online" as const,
          location: "Array E"
        },
        {
          id: "6",
          name: "Wind Farm F",
          type: "wind" as const,
          capacity: 200,
          currentOutput: 180,
          efficiency: 90,
          status: "online" as const,
          location: "Array F"
        }
      ],
      energySources: [
        {
          type: "solar",
          output: 280,
          capacity: 300,
          currentOutput: 280,
          status: "online"
        },
        {
          type: "wind",
          output: 180,
          capacity: 200,
          currentOutput: 180,
          status: "online"
        }
      ],
      storage: {
        capacity: 1000,
        currentCharge: 800
      },
      gridConnection: {
        status: "connected",
        frequency: 50.00,
        voltage: 230.0,
        congestion: "Low"
      }
    }
  ]
};

const DetailedMetrics = () => {
  const [expandedSites, setExpandedSites] = React.useState<string[]>([]);

  const toggleSite = (siteId: string) => {
    setExpandedSites(prev =>
      prev.includes(siteId)
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockData.sites.map((site) => (
            <React.Fragment key={site.id}>
              <SiteRow
                site={site}
                isExpanded={expandedSites.includes(site.id)}
                onToggle={() => toggleSite(site.id)}
              />
              {expandedSites.includes(site.id) && site.plants.map((plant: Plant) => (
                <PlantRow key={plant.id} plant={plant} />
              ))}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedMetrics;