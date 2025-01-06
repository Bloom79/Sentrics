import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Zap } from "lucide-react";
import { Site } from "@/types/site";

const mockSites: Site[] = [
  {
    id: "1",
    name: "North Site",
    location: "Northern Region",
    type: "hybrid",
    capacity: 800,
    status: "online",
    lastUpdate: "2024-02-20T11:30:00",
    dailyProduction: 2500,
    monthlyProduction: 75000,
    efficiency: 92,
    co2Saved: 45.2,
    plants: [],
    consumers: [],
    storageUnits: [],
    energySources: [
      { type: "solar", output: 350, capacity: 500, currentOutput: 350, status: "online" },
      { type: "wind", output: 250, capacity: 300, currentOutput: 250, status: "online" }
    ],
    storage: { capacity: 5000, currentCharge: 4200 },
    gridConnection: { status: "connected", frequency: 50.02, voltage: 230.5, congestion: "Low" }
  },
  {
    id: "2",
    name: "South Site",
    location: "Southern Region",
    type: "hybrid",
    capacity: 700,
    status: "online",
    lastUpdate: "2024-02-20T11:25:00",
    dailyProduction: 2100,
    monthlyProduction: 63000,
    efficiency: 88,
    co2Saved: 38.5,
    plants: [],
    consumers: [],
    storageUnits: [],
    energySources: [
      { type: "solar", output: 300, capacity: 450, currentOutput: 300, status: "online" },
      { type: "wind", output: 200, capacity: 250, currentOutput: 200, status: "online" }
    ],
    storage: { capacity: 4000, currentCharge: 2800 },
    gridConnection: { status: "connected", frequency: 49.98, voltage: 229.8, congestion: "Medium" }
  }
];

const GridStatus = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          Grid Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSites.map((site) => (
            <div key={site.id} className="space-y-2">
              <h3 className="text-lg font-semibold">{site.name}</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Congestion Level</p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        site.gridConnection.congestion === "Low"
                          ? "bg-green-500"
                          : site.gridConnection.congestion === "Medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span>{site.gridConnection.congestion}</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Grid Frequency</p>
                  <p>{site.gridConnection.frequency.toFixed(2)} Hz</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Voltage</p>
                  <p>{site.gridConnection.voltage.toFixed(1)} V</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  {site.energySources.map((source) => (
                    <div key={`${site.id}-${source.type}`} className="flex items-center gap-2">
                      <span className="text-sm">
                        {source.type === "solar" ? "Solar Array" : "Eolic Array"}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {source.output} kW / {source.capacity} kW
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GridStatus;

