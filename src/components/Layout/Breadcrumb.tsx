import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Mock data for site names - replace with actual data fetching
const mockSiteNames: Record<string, string> = {
  "1": "Milano Nord",
  "2": "Roma Est",
  "3": "Torino Sud",
};

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
}

export function AppBreadcrumb({ items = [] }: BreadcrumbProps) {
  const location = useLocation();
  const params = useParams();
  
  const getBreadcrumbItems = () => {
    if (items.length > 0) return items;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return [];

    return pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      let label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Handle special cases
      if (segment === 'site' && params.siteId) {
        return { label: 'Site', path };
      }
      if (params.siteId && segment === params.siteId) {
        label = mockSiteNames[params.siteId] || `Site ${params.siteId}`;
      }

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