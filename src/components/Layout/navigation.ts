import { 
  LayoutDashboard, 
  Factory, 
  Users, 
  Power, 
  LineChart, 
  Settings, 
  Wrench,
  DollarSign
} from "lucide-react";

export const sitesList = [
  { 
    id: "1", 
    name: "Milano Nord",
    plants: [
      { id: "p1", name: "Solar Farm A", type: "solar" },
      { id: "p2", name: "Wind Farm B", type: "wind" }
    ]
  },
  { 
    id: "2", 
    name: "Roma Sud",
    plants: [
      { id: "p3", name: "Solar Farm C", type: "solar" },
      { id: "p4", name: "Wind Farm D", type: "wind" }
    ]
  },
  { 
    id: "3", 
    name: "Torino Est",
    plants: [
      { id: "p5", name: "Solar Farm E", type: "solar" },
      { id: "p6", name: "Wind Farm F", type: "wind" }
    ]
  },
];

export const navigationGroups = [
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
        icon: Factory,
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
    label: "Financials",
    items: [
      {
        title: "Earnings & Expenses",
        paths: {
          site: "/sites/:siteId/financials",
          plant: "/plants/:plantId/financials",
          consumer: "/consumers/:consumerId/financials"
        },
        icon: DollarSign,
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