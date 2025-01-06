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
    <div className="space-y-1">
      {sitesList.map((site) => (
        <React.Fragment key={site.id}>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={(e) => {
                handleSiteClick(site.id, e);
                toggleSite(site.id);
              }}
              className="group w-full px-3 py-2 hover:bg-accent/50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-medium text-sm">{site.name}</span>
                {expandedSites.includes(site.id) ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform duration-200" />
                )}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          {expandedSites.includes(site.id) && (
            <div className="ml-3 border-l border-border/50 pl-3 animate-in slide-in-from-left-2 duration-200">
              <div className="py-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2 block">
                  Plants
                </span>
                <div className="space-y-1">
                  {site.plants.map((plant) => (
                    <SidebarMenuItem key={plant.id}>
                      <SidebarMenuButton
                        onClick={(e) => handlePlantClick(plant.id, e)}
                        className="w-full group px-2 py-1.5 text-sm hover:bg-accent/50 transition-colors duration-200 rounded-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Factory className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="truncate">{plant.name}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              </div>
              
              <div className="py-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2 block">
                  Consumers
                </span>
                <div className="space-y-1">
                  {site.consumers?.map((consumer) => (
                    <SidebarMenuItem key={consumer.id}>
                      <SidebarMenuButton
                        onClick={(e) => handleConsumerClick(consumer.id, e)}
                        className="w-full group px-2 py-1.5 text-sm hover:bg-accent/50 transition-colors duration-200 rounded-sm"
                      >
                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="truncate">{consumer.name}</span>
                        </div>
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