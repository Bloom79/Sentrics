import React from "react";
import { Factory, ChevronRight, LineChart } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface PlantMenuItemProps {
  plant: {
    id: string;
    name: string;
    type: string;
  };
  onPlantClick: (plantId: string) => void;
}

export const PlantMenuItem = ({ plant, onPlantClick }: PlantMenuItemProps) => {
  const location = useLocation();
  const isPlantPage = location.pathname.startsWith(`/plants/${plant.id}`);
  const isFinancialsPage = location.pathname === `/plants/${plant.id}/financials`;

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => onPlantClick(plant.id)}
          data-active={isPlantPage && !isFinancialsPage}
          className="group"
        >
          <Factory className="h-4 w-4" />
          <span>{plant.name}</span>
          <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
        </SidebarMenuButton>
      </SidebarMenuItem>
      {isPlantPage && (
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => onPlantClick(`${plant.id}/financials`)}
            data-active={isFinancialsPage}
            className="group pl-8"
          >
            <LineChart className="h-4 w-4" />
            <span>Financials</span>
            <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </>
  );
};