import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plant } from "@/types/site";
import { useNavigate } from "react-router-dom";
import { Sun, Wind, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlantsListProps {
  plants: Plant[];
}

const PlantsList = ({ plants }: PlantsListProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-red-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Plants</span>
          <span className="text-sm font-normal text-muted-foreground">
            Total: {plants.length} plants
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plants.map((plant) => (
            <Card 
              key={plant.id}
              className="hover:bg-accent/50 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                    {plant.type === "solar" ? (
                      <Sun className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Wind className="h-5 w-5 text-blue-500" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold">{plant.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {plant.currentOutput} kW / {plant.capacity} kW
                      </p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(plant.status)}`} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">
                      {plant.type}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="gap-2"
                      onClick={() => navigate(`/plant/${plant.id}`)}
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
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