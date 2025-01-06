import { 
  LayoutDashboard, 
  Factory, 
  Users, 
  Power, 
  LineChart, 
  Settings, 
  Wrench,
  DollarSign,
  FileText
} from "lucide-react";

export const navigationGroups = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
      },
      {
        title: "Users",
        path: "/users",
        icon: Users,
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
        path: "/plants/:plantId/financials",
        icon: DollarSign,
      },
      {
        title: "Consumer Contracts",
        paths: {
          site: "/sites/:siteId/contracts/consumers",
          plant: "/plants/:plantId/contracts/consumers",
        },
        icon: FileText,
      },
      {
        title: "Grid Contracts",
        paths: {
          site: "/sites/:siteId/contracts/grid",
          plant: "/plants/:plantId/contracts/grid",
        },
        icon: FileText,
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

export const sitesList = [
  { 
    id: "1", 
    name: "Milano Nord",
    plants: [
      { id: "p1", name: "Solar Farm A", type: "solar" },
      { id: "p2", name: "Wind Farm B", type: "wind" }
    ],
    consumers: [
      { id: "123e4567-e89b-12d3-a456-426614174000", name: "Industrial Park A" },
      { id: "223e4567-e89b-12d3-a456-426614174000", name: "Commercial Center B" }
    ]
  },
  { 
    id: "2", 
    name: "Roma Sud",
    plants: [
      { id: "p3", name: "Solar Farm C", type: "solar" },
      { id: "p4", name: "Wind Farm D", type: "wind" }
    ],
    consumers: [
      { id: "323e4567-e89b-12d3-a456-426614174000", name: "Residential Complex A" },
      { id: "423e4567-e89b-12d3-a456-426614174000", name: "Shopping Mall C" }
    ]
  },
  { 
    id: "3", 
    name: "Torino Est",
    plants: [
      { id: "p5", name: "Solar Farm E", type: "solar" },
      { id: "p6", name: "Wind Farm F", type: "wind" }
    ],
    consumers: [
      { id: "523e4567-e89b-12d3-a456-426614174000", name: "Factory Complex D" },
      { id: "623e4567-e89b-12d3-a456-426614174000", name: "Office Park E" }
    ]
  },
];
