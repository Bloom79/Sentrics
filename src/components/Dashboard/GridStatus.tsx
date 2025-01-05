import React from "react";
import { Activity, Wind, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Site } from "@/types/site";

// Mock data - replace with actual data later
const mockSites: Site[] = [
  {
    id: "1",
    name: "North Site",
    location: "Northern Region",
    energySources: [
      { id: "1", type: "solar", capacity: 500, currentOutput: 350, status: "active" },
      { id: "2", type: "eolic", capacity: 300, currentOutput: 250, status: "active" },
    ],
    storageUnits: [], // Referenced in BatteryStatus
    totalCapacity: 800,
    currentOutput: 600,
    gridConnection: {
      status: "connected",
      frequency: 50.02,
      voltage: 230.5,
      congestionLevel: "Low",
    },
  },
  {
    id: "2",
    name: "South Site",
    location: "Southern Region",
    energySources: [
      { id: "3", type: "solar", capacity: 400, currentOutput: 280, status: "active" },
      { id: "4", type: "eolic", capacity: 200, currentOutput: 150, status: "maintenance" },
    ],
    storageUnits: [], // Referenced in BatteryStatus
    totalCapacity: 600,
    currentOutput: 430,
    gridConnection: {
      status: "connected",
      frequency: 49.98,
      voltage: 229.8,
      congestionLevel: "Medium",
    },
  },
];

const GridStatus = () => {
  const sites = mockSites;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          Sites Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {sites.map((site) => (
              <div key={site.id} className="space-y-4 pb-4 border-b last:border-0">
                <h3 className="font-semibold">{site.name}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Congestion Level</p>
                      <div className="flex items-center">
                        <div 
                          className={`w-3 h-3 rounded-full mr-2 ${
                            site.gridConnection.congestionLevel === "Low" 
                              ? "bg-green-500" 
                              : site.gridConnection.congestionLevel === "Medium"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`} 
                        />
                        <p className="text-sm text-muted-foreground">
                          {site.gridConnection.congestionLevel}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Grid Frequency</p>
                      <p className="text-sm text-muted-foreground">
                        {site.gridConnection.frequency} Hz
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Voltage</p>
                      <p className="text-sm text-muted-foreground">
                        {site.gridConnection.voltage} V
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {site.energySources.map((source) => (
                      <div key={source.id} className="flex items-center gap-2">
                        {source.type === "solar" ? (
                          <Sun className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <Wind className="w-4 h-4 text-blue-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {source.type} Array
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {source.currentOutput} kW / {source.capacity} kW
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GridStatus;