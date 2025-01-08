import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusIcon } from "./StatusIcon";
import { Plant } from "@/types/site";
import { useNavigate } from "react-router-dom";

interface PlantRowProps {
  plant: Plant;
}

export const PlantRow: React.FC<PlantRowProps> = ({ plant }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/plants/${plant.id}`);
  };

  return (
    <TableRow 
      className="bg-muted/30 cursor-pointer hover:bg-muted/50"
      onClick={handleClick}
    >
      <TableCell></TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <StatusIcon status={plant.status} />
          <span className="text-sm font-medium">
            {plant.status.charAt(0).toUpperCase() + plant.status.slice(1)}
          </span>
        </div>
      </TableCell>
      <TableCell className="pl-8 font-medium text-sm text-muted-foreground">
        {plant.name}
      </TableCell>
      <TableCell>
        <Badge variant="outline">{plant.type}</Badge>
      </TableCell>
      <TableCell>-</TableCell>
      <TableCell>-</TableCell>
      <TableCell className="text-right">{plant.currentOutput.toLocaleString()}</TableCell>
      <TableCell className="text-right">-</TableCell>
      <TableCell className="text-right">{plant.efficiency}%</TableCell>
      <TableCell className="text-right">-</TableCell>
    </TableRow>
  );
};