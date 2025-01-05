import React, { useState } from "react";
import { Battery } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StorageUnit } from "@/types/site";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock data - replace with actual data later
const mockStorageUnits: (StorageUnit & { siteName: string })[] = [
  {
    id: "1",
    siteName: "Milano Nord",
    capacity: 100,
    currentCharge: 85,
    status: "charging",
    health: 98,
    temperature: 25,
  },
  {
    id: "2",
    siteName: "Roma Est",
    capacity: 150,
    currentCharge: 120,
    status: "discharging",
    health: 95,
    temperature: 27,
  },
  {
    id: "3",
    siteName: "Milano Nord",
    capacity: 120,
    currentCharge: 90,
    status: "charging",
    health: 97,
    temperature: 26,
  },
];

const BatteryStatus = () => {
  const [selectedSite, setSelectedSite] = useState<string>("all");
  
  // Get unique site names
  const sites = Array.from(new Set(mockStorageUnits.map(unit => unit.siteName)));
  
  // Filter storage units based on selected site
  const filteredStorageUnits = selectedSite === "all" 
    ? mockStorageUnits 
    : mockStorageUnits.filter(unit => unit.siteName === selectedSite);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Battery className="w-5 h-5" />
            Storage Units Status
          </CardTitle>
          <Select value={selectedSite} onValueChange={setSelectedSite}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select site" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sites</SelectItem>
              {sites.map((site) => (
                <SelectItem key={site} value={site}>
                  {site}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-6">
            {filteredStorageUnits.map((unit) => (
              <div key={unit.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Storage Unit {unit.id}</span>
                    <p className="text-xs text-muted-foreground">{unit.siteName}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {(unit.currentCharge / unit.capacity * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={(unit.currentCharge / unit.capacity) * 100} 
                  className="h-2" 
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {unit.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Power</p>
                    <p className="text-sm text-muted-foreground">
                      {unit.currentCharge.toFixed(1)} kWh
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Temperature</p>
                    <p className="text-sm text-muted-foreground">
                      {unit.temperature}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Health</p>
                    <p className="text-sm text-muted-foreground">{unit.health}%</p>
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

export default BatteryStatus;