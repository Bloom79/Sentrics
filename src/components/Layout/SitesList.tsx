import React from "react";
import { useNavigate } from "react-router-dom";
import { Factory, ChevronRight, ChevronDown, Users } from "lucide-react";
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

  const handlePlantClick = (plantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/plants/${plantId}`);
  };

  const handleConsumerClick = (consumerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/consumers/${consumerId}`);
  };

  const handleSiteClick = (siteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/site/${siteId}`);
  };

  return (
    <div className="pl-6 space-y-1">
      {sitesList.map((site) => (
        <React.Fragment key={site.id}>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={(e) => {
                handleSiteClick(site.id, e);
                toggleSite(site.id);
              }}
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
            <div className="pl-4 space-y-2">
              {/* Plants Section */}
              <div>
                <span className="text-sm font-medium text-muted-foreground px-4">Plants</span>
                <div className="space-y-1 mt-1">
                  {site.plants.map((plant) => (
                    <SidebarMenuItem key={plant.id}>
                      <SidebarMenuButton
                        onClick={(e) => handlePlantClick(plant.id, e)}
                        className="group"
                      >
                        <Factory className="h-4 w-4" />
                        <span>{plant.name}</span>
                        <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              </div>
              
              {/* Consumers Section */}
              <div>
                <span className="text-sm font-medium text-muted-foreground px-4">Consumers</span>
                <div className="space-y-1 mt-1">
                  {site.consumers?.map((consumer) => (
                    <SidebarMenuItem key={consumer.id}>
                      <SidebarMenuButton
                        onClick={(e) => handleConsumerClick(consumer.id, e)}
                        className="group"
                      >
                        <Users className="h-4 w-4" />
                        <span>{consumer.name}</span>
                        <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};