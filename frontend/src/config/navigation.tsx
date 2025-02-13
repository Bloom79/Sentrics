import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Activity,
  Share2, 
  LineChart,
  FileText,
  Settings,
  Wallet,
  Receipt,
  CreditCard,
  Home,
  Grid,
  UserPlus,
  ClipboardCheck,
  Cog,
  User
} from "lucide-react";
import { Navigation } from "@/types/navigation";

export const navigation: Navigation = [
  {
    title: "Asset Management",
    key: "asset-management",
    items: [
      {
        title: "Workspace",
        key: "workspace",
        items: [
          {
            title: "Dashboard",
            path: "/",
            icon: Home,
            key: "dashboard",
          },
          {
            title: "Sites",
            path: "/sites",
            icon: Building2,
            key: "sites",
          },
          {
            title: "Grid Analysis",
            path: "/grid-analysis",
            icon: Grid,
            key: "grid-analysis",
          },
          {
            title: "Financials",
            path: "/financials",
            icon: FileText,
            key: "financials",
          },
        ]
      },  
      {
        title: "Admin",
        key: "admin",
        items: [
          {
            title: "Users",
            path: "/AssetUsers",
            icon: Users,
            key: "am-users",
          },
        ]     
      },    
    ],
  },
  {
    title: "Energy Communities",
    key: "energy-communities",
    items: [
      {
        title: "CER User",
        key: "cer-user",
        items: [
          {
            title: "Dashboard",
            path: "/cer/user/dashboard",
            icon: LayoutDashboard,
            key: "cer-user-dashboard",
          },
          {
            title: "Workspace",
            path: "/cer/user/workspace",
            icon: User,
            key: "cer-user-workspace",
          }
        ]
      },
      {
        title: "CER Admin",
        key: "cer-admin",
        items: [
          {
            title: "CER Users",
            path: "/cer/users",
            icon: Users,
            key: "cer-users",
          },
          {
            title: "Members",
            path: "/cer/members",
            icon: UserPlus,
            key: "cer-members",
          },
          {
            title: "Energy Configurations",
            path: "/cer/configurations",
            icon: Cog,
            key: "energy-configurations",
          },
          {
            title: "Energy Sharing",
            path: "/cer/configurations/transactions",
            icon: Share2,
            key: "energy-sharing",
          },
          {
            title: "GSE Compliance",
            path: "/cer/configurations/compliance",
            icon: ClipboardCheck,
            key: "gse-compliance",
          },
          {
            title: "Billing",
            path: "/cer/configurations/billing",
            icon: Receipt,
            key: "cer-billing",
          }
        ]
      }
    ],
  },  
  {
    title: "Administration",
    key: "administration",
    items: [
      {
        title: "Users",
        path: "/users",
        icon: Users,
        key: "admin-users",
      },
      {
        title: "Billing & Payments",
        key: "billing-payments",
        icon: Wallet,
        items: [
          {
            title: "Overview",
            path: "/admin/financials/billing",
            icon: CreditCard,
            key: "billing-overview",
          },
          {
            title: "Tariffs",
            path: "/admin/financials/tariffs",
            icon: Receipt,
            key: "tariffs",
          }
        ]
      },
      {
        title: "Settings",
        path: "/settings",
        icon: Settings,
        key: "settings",
      },
    ],
  },
]; 