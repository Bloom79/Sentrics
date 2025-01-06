import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { navigationGroups } from "./navigation";
import { SitesList } from "./SitesList";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [expandedSites, setExpandedSites] = useState<string[]>([]);

  const toggleExpand = (title: string) => {
    setExpandedItems(current =>
      current.includes(title)
        ? current.filter(item => item !== title)
        : [...current, title]
    );
  };

  const toggleSite = (siteId: string) => {
    setExpandedSites(current =>
      current.includes(siteId)
        ? current.filter(id => id !== siteId)
        : [...current, siteId]
    );
  };

  const handleNavigate = (path: string) => {
    // Replace :plantId with the current plant ID if it exists in the path
    const currentPlantId = location.pathname.match(/\/plants\/([^\/]+)/)?.[1];
    const finalPath = currentPlantId ? path.replace(':plantId', currentPlantId) : path;
    navigate(finalPath);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">SentricS</h2>
      </SidebarHeader>
      <SidebarContent>
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <React.Fragment key={item.title}>
                    <SidebarMenuItem>
                      {item.isExpandable ? (
                        <SidebarMenuButton
                          onClick={() => toggleExpand(item.title)}
                          className="group"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {expandedItems.includes(item.title) ? (
                            <ChevronRight className="ml-auto h-4 w-4 rotate-90" />
                          ) : (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          onClick={() => item.path && handleNavigate(item.path)}
                          data-active={location.pathname === item.path}
                          className="group"
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto h-4 w-4 opacity-0 group-hover:opacity-100" />
                        </SidebarMenuButton>
                      )}
                    </SidebarMenuItem>
                    {item.isExpandable && expandedItems.includes(item.title) && (
                      <SitesList 
                        expandedSites={expandedSites}
                        toggleSite={toggleSite}
                      />
                    )}
                  </React.Fragment>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}