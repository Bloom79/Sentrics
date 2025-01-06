import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StorageUnit } from "@/types/site";

const mockBatteries: (StorageUnit & { siteName: string; siteId: string; })[] = [
  {
    id: "1",
    name: "Battery Pack A",
    siteId: "1",
    siteName: "Milano Nord",
    capacity: 1000,
    currentCharge: 850,
    status: "charging",
    health: 98,
    temperature: 25,
    powerRating: 500
  },
  {
    id: "2",
    name: "Battery Pack B",
    siteId: "2",
    siteName: "Roma Sud",
    capacity: 800,
    currentCharge: 240,
    status: "discharging",
    health: 95,
    temperature: 28,
    powerRating: 400
  },
  {
    id: "3",
    name: "Battery Pack C",
    siteId: "3",
    siteName: "Torino Est",
    capacity: 1200,
    currentCharge: 960,
    status: "charging",
    health: 97,
    temperature: 26,
    powerRating: 600
  }
];

const BatteryStatus = () => {
  return (
    <div className="space-y-4">
      {mockBatteries.map((battery) => (
        <Card key={battery.id}>
          <CardHeader>
            <CardTitle>{battery.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Site: {battery.siteName}</span>
                <span>Status: {battery.status}</span>
              </div>
              <Progress value={(battery.currentCharge / battery.capacity) * 100} className="h-2" />
              <div className="flex justify-between">
                <span>Charge: {battery.currentCharge} kWh</span>
                <span>Health: {battery.health}%</span>
              </div>
              <div className="flex justify-between">
                <span>Temperature: {battery.temperature}°C</span>
                <span>Power Rating: {battery.powerRating} kW</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default BatteryStatus;
