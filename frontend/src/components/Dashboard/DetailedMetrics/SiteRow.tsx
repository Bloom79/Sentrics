import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Site } from "@/types/site";
import { useNavigate } from "react-router-dom";
import { PlantRow } from "./PlantRow";

interface SiteRowProps {
  site: Site;
  isExpanded: boolean;
  onToggle: () => void;
}

export const SiteRow = ({ site, isExpanded, onToggle }: SiteRowProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/sites/${site.id}`);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'offline':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <TableRow 
        className="bg-background cursor-pointer hover:bg-muted/50"
        onClick={handleClick}
      >
        <TableCell>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="p-1 hover:bg-muted rounded"
          >
            <svg
              className={`h-4 w-4 transition-transform ${isExpanded ? 'transform rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(site.status)}`} />
            <span className="text-sm font-medium capitalize">
              {site.status || 'Unknown'}
            </span>
          </div>
        </TableCell>
        <TableCell className="font-medium">{site.name}</TableCell>
        <TableCell>
          <Badge variant="outline">{site.type || 'Unknown'}</Badge>
        </TableCell>
        <TableCell>{site.plants?.length || 0}</TableCell>
        <TableCell>{site.plants?.length || 0}</TableCell>
        <TableCell className="text-right">-</TableCell>
        <TableCell className="text-right">-</TableCell>
        <TableCell className="text-right">{site.efficiency || 0}%</TableCell>
        <TableCell className="text-right">-</TableCell>
      </TableRow>
      {isExpanded && site.plants?.map((plant) => (
        <PlantRow key={plant.id} plant={plant} />
      ))}
    </>
  );
};