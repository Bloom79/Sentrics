import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const Breadcrumb = () => {
  const pathSegments = window.location.pathname.split('/').filter(Boolean);

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathSegments.length === 0) {
      return [{ label: 'Home' }];
    }

    // Handle assets routes
    if (pathSegments[0] === 'assets' && pathSegments[1]) {
      const assetId = pathSegments[1];
      
      const { data: asset } = useQuery({
        queryKey: ['asset-breadcrumb', assetId],
        queryFn: async () => {
          if (!assetId) return null;
          const { data, error } = await supabase
            .from('assets')
            .select(`
              id,
              name,
              plant:plant_id (
                id,
                name,
                site:site_id (
                  id,
                  name
                )
              )
            `)
            .eq('id', assetId)
            .single();
          
          if (error) throw error;
          return data;
        },
        enabled: !!assetId
      });

      if (asset?.plant?.site) {
        return [
          { label: 'Sites', path: '/sites' },
          { label: asset.plant.site.name, path: `/sites/${asset.plant.site.id}` },
          { label: asset.plant.name, path: `/plants/${asset.plant.id}` },
          { label: asset.name }
        ];
      }

      return [
        { label: 'Assets', path: '/assets' },
        { label: asset?.name || 'Loading...' }
      ];
    }

    // Handle plants routes
    if (pathSegments[0] === 'plants' && pathSegments[1]) {
      const plantId = pathSegments[1];
      
      const { data: plant } = useQuery({
        queryKey: ['plant-breadcrumb', plantId],
        queryFn: async () => {
          if (!plantId) return null;
          const { data, error } = await supabase
            .from('plants')
            .select(`
              id,
              name,
              site:site_id (
                id,
                name
              )
            `)
            .eq('id', plantId)
            .single();
          
          if (error) throw error;
          return data;
        },
        enabled: !!plantId
      });

      if (plant?.site) {
        return [
          { label: 'Sites', path: '/sites' },
          { label: plant.site.name, path: `/sites/${plant.site.id}` },
          { label: plant.name }
        ];
      }

      return [
        { label: 'Plants', path: '/plants' },
        { label: plant?.name || 'Loading...' }
      ];
    }

    // Handle sites routes
    if (pathSegments[0] === 'sites' && pathSegments[1]) {
      const siteId = pathSegments[1];
      
      const { data: site } = useQuery({
        queryKey: ['site-breadcrumb', siteId],
        queryFn: async () => {
          if (!siteId) return null;
          const { data, error } = await supabase
            .from('sites')
            .select('id, name')
            .eq('id', siteId)
            .single();
          
          if (error) throw error;
          return data;
        },
        enabled: !!siteId
      });

      return [
        { label: 'Sites', path: '/sites' },
        { label: site?.name || 'Loading...' }
      ];
    }

    // Default breadcrumb for other routes
    return [
      { label: pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1) }
    ];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link to="/" className="hover:text-foreground">
        Home
      </Link>
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="h-4 w-4" />
          {item.path ? (
            <Link to={item.path} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};