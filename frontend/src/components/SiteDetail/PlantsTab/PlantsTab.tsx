import React from "react";
import { Plant, Site } from "@/types/site";
import { PlantCard } from "./PlantCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { NewPlantDialog } from "@/components/Sites/NewPlantDialog";
import { supabase } from "@/integrations/supabase/client";

interface PlantsTabProps {
  site: Site;
}

export const PlantsTab = ({ site }: PlantsTabProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [plants, setPlants] = React.useState<Plant[]>(site.plants);
  
  const filteredPlants = plants.filter(plant => 
    plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    plant.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCapacity = plants.reduce((sum, plant) => sum + plant.capacity, 0);
  const totalCurrentOutput = plants.reduce((sum, plant) => sum + plant.current_output, 0);

  const refreshPlants = async () => {
    try {
      const { data: updatedPlants, error } = await supabase
        .from('plants')
        .select('*')
        .eq('site_id', site.id);
      
      if (error) throw error;
      if (updatedPlants) {
        setPlants(updatedPlants as Plant[]);
      }
    } catch (error) {
      console.error('Error refreshing plants:', error);
    }
  };

  const handlePlantCreated = () => {
    refreshPlants();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Plants Overview</h3>
          <p className="text-sm text-muted-foreground">
            Total output: {totalCurrentOutput} kW / {totalCapacity} kW
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <NewPlantDialog siteId={site.id} onPlantCreated={handlePlantCreated} />
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
