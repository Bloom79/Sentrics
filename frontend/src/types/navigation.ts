import { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  path?: string;
  icon?: LucideIcon;
  items?: NavItem[];
  key?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
  key?: string;
}

export type Navigation = NavSection[]; 