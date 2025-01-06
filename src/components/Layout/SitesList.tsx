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
              className="group hover:bg-accent/50 transition-colors duration-200"
            >
              <span className="font-medium">{site.name}</span>
              {expandedSites.includes(site.id) ? (
                <ChevronDown className="ml-auto h-4 w-4 text-muted-foreground transition-transform duration-200" />
              ) : (
                <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform duration-200" />
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
          {expandedSites.includes(site.id) && (
            <div className="pl-4 space-y-3 animate-in slide-in-from-left-2 duration-200">
              {/* Plants Section */}
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
                  Plants
                </span>
                <div className="space-y-1 mt-2">
                  {site.plants.map((plant) => (
                    <SidebarMenuItem key={plant.id}>
                      <SidebarMenuButton
                        onClick={(e) => handlePlantClick(plant.id, e)}
                        className="group hover:bg-accent/50 transition-colors duration-200"
                      >
                        <Factory className="h-4 w-4 text-muted-foreground" />
                        <span className="ml-2">{plant.name}</span>
                        <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 text-muted-foreground transition-all duration-200" />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              </div>
              
              {/* Consumers Section */}
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
                  Consumers
                </span>
                <div className="space-y-1 mt-2">
                  {site.consumers?.map((consumer) => (
                    <SidebarMenuItem key={consumer.id}>
                      <SidebarMenuButton
                        onClick={(e) => handleConsumerClick(consumer.id, e)}
                        className="group hover:bg-accent/50 transition-colors duration-200"
                      >
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="ml-2">{consumer.name}</span>
                        <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100 text-muted-foreground transition-all duration-200" />
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