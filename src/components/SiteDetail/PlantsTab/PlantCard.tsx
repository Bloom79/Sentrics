import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plant } from "@/types/site";
import { Sun, Wind } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface PlantCardProps {
  plant: Plant;
}

export const PlantCard = ({ plant }: PlantCardProps) => {
  const navigate = useNavigate();
  const PlantIcon = plant.type === "solar" ? Sun : Wind;
  const iconColor = plant.type === "solar" ? "text-yellow-500" : "text-blue-500";

  return (
    <Card 
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => navigate(`/plant/${plant.id}`)}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlantIcon className={`h-5 w-5 ${iconColor}`} />
            <div>
              <h3 className="font-semibold">{plant.name}</h3>
              <p className="text-sm text-muted-foreground">
                {plant.currentOutput} kW / {plant.capacity} kW
              </p>
            </div>
          </div>
          <Badge 
            variant={plant.status === "online" ? "default" : "destructive"}
            className="capitalize"
          >
            {plant.status}
          </Badge>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Efficiency</p>
            <p className="font-medium">{plant.efficiency}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last Update</p>
            <p className="font-medium">
              {plant.lastUpdate ? new Date(plant.lastUpdate).toLocaleTimeString() : 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};