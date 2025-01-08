import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Thermometer, Activity, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StorageUnit } from "@/types/site";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StorageOverviewProps {
  storageUnits: StorageUnit[];
}

const StorageOverview: React.FC<StorageOverviewProps> = ({ storageUnits }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {storageUnits.map((unit) => {
          const chargePercentage = (unit.currentCharge / unit.capacity) * 100;
          
          return (
            <Card key={unit.id} className="relative">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Battery className="h-5 w-5" />
                  {unit.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Charge Level</span>
                    <span className="text-sm text-muted-foreground">
                      {chargePercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={chargePercentage} className="h-2" />
                </div>

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
                      {unit.powerRating} kW
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
                    <p className="text-sm text-muted-foreground">
                      {unit.health}%
                    </p>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate(`/storage-unit/${unit.id}`)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StorageOverview;