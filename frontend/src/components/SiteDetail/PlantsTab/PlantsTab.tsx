import React from "react";
import { Plant } from "@/types/site";
import { PlantCard } from "./PlantCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface PlantsTabProps {
  plants: Plant[];
}

export const PlantsTab = ({ plants }: PlantsTabProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  const filteredPlants = plants.filter(plant => 
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCapacity = plants.reduce((sum, plant) => sum + plant.capacity, 0);
  const totalCurrentOutput = plants.reduce((sum, plant) => sum + plant.currentOutput, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Plants Overview</h3>
          <p className="text-sm text-muted-foreground">
            Total output: {totalCurrentOutput} kW / {totalCapacity} kW
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search plants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} />
        ))}
      </div>

      {filteredPlants.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No plants found matching your search.
        </div>
      )}
    </div>
  );
};