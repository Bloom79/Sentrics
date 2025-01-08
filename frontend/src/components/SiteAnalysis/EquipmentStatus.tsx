import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, CheckCircle, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EquipmentStatusProps {
  siteId: string;
}

// Mock data - replace with actual API call
const mockEquipment = [
  {
    id: "1",
    name: "Solar Inverter A",
    status: "operational",
    health: 95,
    lastMaintenance: "2024-02-01",
    temperature: 42,
  },
  {
    id: "2",
    name: "Wind Turbine 1",
    status: "operational",
    health: 88,
    lastMaintenance: "2024-01-15",
    temperature: 38,
  },
  {
    id: "3",
    name: "Battery System",
    status: "warning",
    health: 76,
    lastMaintenance: "2024-01-30",
    temperature: 45,
  },
];

const EquipmentStatus = ({ siteId }: EquipmentStatusProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Equipment Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockEquipment.map((equipment) => (
            <div key={equipment.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {equipment.status === "operational" ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  )}
                  <span className="font-medium">{equipment.name}</span>
                </div>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    equipment.status === "operational"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                  }`}
                >
                  {equipment.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Health</span>
                  <span>{equipment.health}%</span>
                </div>
                <Progress value={equipment.health} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Last Maintenance</p>
                  <p>{new Date(equipment.lastMaintenance).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Temperature</p>
                  <p>{equipment.temperature}°C</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentStatus;