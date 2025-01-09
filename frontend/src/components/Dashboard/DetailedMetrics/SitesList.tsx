import React from "react";
import { Site } from "@/types/site";
import { SiteRow } from "./SiteRow";

interface SitesListProps {
  sites: Site[];
  expandedSites: string[];
  onToggleSite: (siteId: string) => void;
}

export const SitesList = ({ sites, expandedSites, onToggleSite }: SitesListProps) => {
  return (
    <>
      {sites.map((site) => (
        <SiteRow
          key={site.id}
          site={site}
          isExpanded={expandedSites.includes(site.id)}
          onToggle={() => onToggleSite(site.id)}
        />
      ))}
    </>
  );
};