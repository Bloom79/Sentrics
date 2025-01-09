import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plant } from "@/types/site";
import { useNavigate } from "react-router-dom";
import { Sun, Wind, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface PlantCardProps {
  plant: Plant;
  onDelete: () => void;
}

export const PlantCard = ({ plant, onDelete }: PlantCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="relative cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => navigate(`/plants/${plant.id}`)}
    >
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {plant.type === "solar" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Wind className="h-5 w-5 text-blue-500" />
            )}
            <div>
              <h3 className="font-semibold">{plant.name}</h3>
              <p className="text-sm text-muted-foreground">
                {plant.current_output} kW / {plant.capacity} kW
              </p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Plant</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this plant? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};