import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ChargingDirection from "./ChargingDirection";

interface StorageOverviewProps {
  siteId: string;
}

const StorageOverview = ({ siteId }: StorageOverviewProps) => {
  const navigate = useNavigate();
  
  // Mock data - replace with actual API call
  const storageUnits = [
    {
      id: "1",
      name: "Storage Unit 1",
      capacity: 1000,
      currentCharge: 750,
      status: "charging",
      chargingRate: 45,
      temperature: 25,
      health: 98,
      cycles: 342,
    },
    {
      id: "2",
      name: "Storage Unit 2",
      capacity: 800,
      currentCharge: 520,
      status: "discharging",
      chargingRate: -30,
      temperature: 23,
      health: 95,
      cycles: 256,
    },
    {
      id: "3",
      name: "Storage Unit 3",
      capacity: 1200,
      currentCharge: 1080,
      status: "charging",
      chargingRate: 25,
      temperature: 24,
      health: 97,
      cycles: 180,
    },
  ];

  const handleUnitClick = (unitId: string) => {
    navigate(`/storage-unit/${unitId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Battery className="h-5 w-5" />
          Storage Systems Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-8">
            {storageUnits.map((unit) => {
              const chargePercentage = (unit.currentCharge / unit.capacity) * 100;
              
              return (
                <div key={unit.id} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{unit.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {chargePercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={chargePercentage} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Status</p>
                      <div className="flex items-center gap-1">
                        <ChargingDirection direction={unit.status as "charging" | "discharging"} />
                        <p className="text-sm text-muted-foreground capitalize">
                          {unit.status}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Power</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.abs(unit.chargingRate)} kW
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Temperature</p>
                      <p className="text-sm text-muted-foreground">
                        {unit.temperature}°C
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Health</p>
                      <p className="text-sm text-muted-foreground">
                        {unit.health}%
                      </p>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleUnitClick(unit.id)}
                  >
                    View Details
                  </Button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default StorageOverview;