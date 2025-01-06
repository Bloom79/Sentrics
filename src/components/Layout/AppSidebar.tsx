import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Wind,
  Battery,
  Activity,
  Settings,
  ChevronRight,
  Search,
  Wrench,
  LineChart,
  MonitorCheck,
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
  SidebarInput,
} from "@/components/ui/sidebar";

type NavigationItem = {
  title: string;
  path: string;
  icon: React.ComponentType<any>;
  children?: NavigationItem[];
};

type NavigationGroup = {
  label: string;
  items: NavigationItem[];
};

const navigationItems: NavigationGroup[] = [
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
    label: "Monitoring",
    items: [
      {
        title: "Grid Analysis",
        path: "/grid-analysis",
        icon: Activity,
      },
      {
        title: "Sites",
        path: "/sites",
        icon: Wind,
      },
      {
        title: "Storage Units",
        path: "/storage",
        icon: Battery,
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
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    // TODO: Implement search functionality
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarInput
          type="search"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full"
        />
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      data-active={location.pathname === item.path}
                      tooltip={item.title}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      {item.children && <ChevronRight className="ml-auto h-4 w-4" />}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}