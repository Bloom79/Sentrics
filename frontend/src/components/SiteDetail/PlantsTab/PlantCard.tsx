import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plant } from "@/types/site";
import { useNavigate } from "react-router-dom";
import { Sun, Wind, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PlantCardProps {
  plant: Plant;
  onDelete?: (id: string) => void;
}

export const PlantCard = ({ plant, onDelete }: PlantCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/plants/${plant.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking delete
    if (onDelete) {
      onDelete(plant.id);
    }
  };

  return (
    <Card 
      onClick={handleClick}
      className="cursor-pointer transition-colors hover:bg-accent/50"
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {plant.type === 'solar' ? (
              <Sun className="h-4 w-4 text-yellow-500" />
            ) : (
              <Wind className="h-4 w-4 text-blue-500" />
            )}
            <CardTitle className="text-base">{plant.name}</CardTitle>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Output:</span>
            <span>{plant.current_output} kW / {plant.capacity} kW</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Efficiency:</span>
            <span>{plant.efficiency}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={plant.status === 'active' ? 'default' : 'secondary'}>
              {plant.status}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};