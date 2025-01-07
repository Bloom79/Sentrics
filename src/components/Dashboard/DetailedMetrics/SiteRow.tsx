import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { StatusIcon } from "./StatusIcon";
import { EnergySourceInfo } from "./EnergySourceInfo";
import { StorageInfo } from "./StorageInfo";
import { GridConnectionInfo } from "./GridConnectionInfo";
import { Site } from "@/types/site";
import { useNavigate } from "react-router-dom";

interface SiteRowProps {
  site: Site;
  isExpanded: boolean;
  onToggle: () => void;
}

export const SiteRow: React.FC<SiteRowProps> = ({ site, isExpanded, onToggle }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Only navigate if clicking the row itself, not the expand toggle
    if (!target.closest('button')) {
      navigate(`/site/${site.id}`);
    }
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <TableRow 
      className="cursor-pointer hover:bg-muted/50" 
      onClick={handleClick}
    >
      <TableCell>
        <button onClick={handleToggle}>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <StatusIcon status={site.status} />
          <span className="text-sm font-medium">
            {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
          </span>
        </div>
      </TableCell>
      <TableCell className="font-medium">{site.name}</TableCell>
      <TableCell>
        <EnergySourceInfo sources={site.energySources} />
      </TableCell>
      <TableCell>
        <StorageInfo storage={site.storage} />
      </TableCell>
      <TableCell>
        <GridConnectionInfo connection={site.gridConnection} />
      </TableCell>
      <TableCell className="text-right">{site.dailyProduction.toLocaleString()}</TableCell>
      <TableCell className="text-right">{site.monthlyProduction.toLocaleString()}</TableCell>
      <TableCell className="text-right">{site.efficiency}%</TableCell>
      <TableCell className="text-right">{site.co2Saved.toFixed(1)}</TableCell>
    </TableRow>
  );
};