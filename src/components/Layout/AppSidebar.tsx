import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Factory,
  Users,
  Power,
  LineChart,
  Settings,
  Wrench,
  ChevronRight,
  Building2,
  ChevronDown,
} from "lucide-react";
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

// Mock sites data - in a real app, this would come from an API
const sitesList = [
  { 
    id: "1", 
    name: "Milano Nord",
    plants: [
      { id: "1", name: "Solar Farm A", type: "solar" },
      { id: "2", name: "Wind Farm B", type: "wind" }
    ]
  },
  { 
    id: "2", 
    name: "Roma Sud",
    plants: [
      { id: "3", name: "Solar Farm C", type: "solar" },
      { id: "4", name: "Wind Farm D", type: "wind" }
    ]
  },
  { 
    id: "3", 
    name: "Torino Est",
    plants: [
      { id: "5", name: "Solar Farm E", type: "solar" },
      { id: "6", name: "Wind Farm F", type: "wind" }
    ]
  },
];

const navigationGroups = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Asset Management",
    items: [
      {
        title: "Sites",
        icon: Building2,
        isExpandable: true,
      },
      {
        title: "Consumers",
        path: "/consumers",
        icon: Users,
      },
      {
        title: "Energy Grid",
        path: "/grid-analysis",
        icon: Power,
      },
    ],
  },
  {
    label: "Analysis & Admin",
    items: [
      {
        title: "Analytics",
        path: "/analytics",
        icon: LineChart,
      },
      {
        title: "Maintenance",
        path: "/maintenance",
        icon: Wrench,
      },
      {
        title: "Settings",
        path: "/settings",
        icon: Settings,
      },
    ],
  },
];

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
                            <ChevronDown className="ml-auto h-4 w-4" />
                          ) : (
                            <ChevronRight className="ml-auto h-4 w-4" />
                          )}
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          onClick={() => navigate(item.path)}
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
                      <div className="pl-6 space-y-1">
                        {sitesList.map((site) => (
                          <React.Fragment key={site.id}>
                            <SidebarMenuItem>
                              <SidebarMenuButton
                                onClick={() => toggleSite(site.id)}
                                data-active={location.pathname === `/site/${site.id}`}
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
                                      onClick={() => navigate(`/plant/${plant.id}`)}
                                      data-active={location.pathname === `/plant/${plant.id}`}
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