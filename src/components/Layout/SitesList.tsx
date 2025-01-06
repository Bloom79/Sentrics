import React from "react";
import { useNavigate } from "react-router-dom";
import { Factory, ChevronRight, ChevronDown } from "lucide-react";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { sitesList } from "./navigation";

interface SitesListProps {
  expandedSites: string[];
  toggleSite: (siteId: string) => void;
}

export const SitesList: React.FC<SitesListProps> = ({ expandedSites, toggleSite }) => {
  const navigate = useNavigate();

  const handlePlantClick = (plantId: string) => {
    navigate(`/plants/${plantId}`);
  };

  return (
    <div className="pl-6 space-y-1">
      {sitesList.map((site) => (
        <React.Fragment key={site.id}>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleSite(site.id)}
              className="group"
            >
              <span>{site.name}</span>
              {expandedSites.includes(site.id) ? (
                <ChevronDown className="ml-auto h-4 w-4" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          {expandedSites.includes(site.id) && (
            <div className="pl-4 space-y-1">
              {site.plants.map((plant) => (
                <SidebarMenuItem key={plant.id}>
                  <SidebarMenuButton
                    onClick={() => handlePlantClick(plant.id)}
                    className="group"
                  >
                    <Factory className="h-4 w-4" />
                    <span>{plant.name}</span>
                    <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};