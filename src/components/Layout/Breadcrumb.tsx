import React from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface BreadcrumbProps {
  items?: Array<{
    label: string;
    path?: string;
  }>;
}

export function AppBreadcrumb({ items = [] }: BreadcrumbProps) {
  const location = useLocation();
  
  // Generate breadcrumb items based on current path if no items provided
  const getBreadcrumbItems = () => {
    if (items.length > 0) return items;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const label = segment.charAt(0).toUpperCase() + segment.slice(1);
      return { label, path };
    });
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.label}>
            <BreadcrumbSeparator />
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
      </BreadcrumbList>
    </Breadcrumb>
  );
}