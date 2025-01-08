import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plant } from "@/types/site";
import { useNavigate } from "react-router-dom";
import { Sun, Wind } from "lucide-react";

interface PlantsListProps {
  plants: Plant[];
}

const PlantsList = ({ plants }: PlantsListProps) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plants</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plants.map((plant) => (
            <Card 
              key={plant.id}
              className="cursor-pointer hover:bg-accent/50 transition-colors"
              onClick={() => navigate(`/plant/${plant.id}`)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  {plant.type === "solar" ? (
                    <Sun className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <Wind className="h-5 w-5 text-blue-500" />
                  )}
                  <div>
                    <h3 className="font-semibold">{plant.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {plant.currentOutput} kW / {plant.capacity} kW
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PlantsList;