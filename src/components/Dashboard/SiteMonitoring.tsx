import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Sun, Wind, Battery, Activity } from "lucide-react";

type SiteStatus = {
  id: string;
  name: string;
  status: "operational" | "warning" | "critical";
  solarOutput: number;
  windOutput: number;
  storageLevel: number;
  efficiency: number;
};

const mockSites: SiteStatus[] = [
  {
    id: "1",
    name: "Milano Nord",
    status: "operational",
    solarOutput: 450,
    windOutput: 300,
    storageLevel: 85,
    efficiency: 94,
  },
  {
    id: "2",
    name: "Roma Est",
    status: "warning",
    solarOutput: 380,
    windOutput: 250,
    storageLevel: 65,
    efficiency: 88,
  },
  {
    id: "3",
    name: "Torino Sud",
    status: "operational",
    solarOutput: 420,
    windOutput: 280,
    storageLevel: 92,
    efficiency: 96,
  },
];

const SiteMonitoring = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          Monitoraggio Siti
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {mockSites.map((site) => (
              <div
                key={site.id}
                className="rounded-lg border p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{site.name}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        site.status === "operational"
                          ? "bg-green-500"
                          : site.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-sm capitalize text-muted-foreground">
                      {site.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium">Solare</p>
                      <p className="text-sm text-muted-foreground">
                        {site.solarOutput} kW
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Eolico</p>
                      <p className="text-sm text-muted-foreground">
                        {site.windOutput} kW
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">Storage</p>
                      <p className="text-sm text-muted-foreground">
                        {site.storageLevel}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-purple-500" />
                    <div>
                      <p className="text-sm font-medium">Efficienza</p>
                      <p className="text-sm text-muted-foreground">
                        {site.efficiency}%
                      </p>
                    </div>
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

export default SiteMonitoring;