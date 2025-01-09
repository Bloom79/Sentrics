import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
    <TableRow 
      className="bg-muted/30 cursor-pointer hover:bg-muted/50"
      onClick={handleClick}
    >
      <TableCell></TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${getStatusColor(plant.status)}`} />
          <span className="text-sm font-medium capitalize">
            {plant.status || 'Unknown'}
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
      <TableCell className="text-right">{plant.current_output?.toLocaleString() || 0}</TableCell>
      <TableCell className="text-right">-</TableCell>
      <TableCell className="text-right">{plant.efficiency || 0}%</TableCell>
      <TableCell className="text-right">-</TableCell>
    </TableRow>
  );
};