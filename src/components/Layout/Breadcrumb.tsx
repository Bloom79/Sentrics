import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export function AppBreadcrumb({ items = [] }: BreadcrumbProps) {
  const location = useLocation();
  
  const getBreadcrumbItems = () => {
    if (items.length > 0) return items;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return [];

    return pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { label, path };
    });
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.label}>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            {index === breadcrumbItems.length - 1 ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={item.path || "#"}>{item.label}</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </Breadcrumb>
  );
}