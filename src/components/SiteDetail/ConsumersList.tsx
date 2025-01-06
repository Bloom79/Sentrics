import React from "react";
import { Consumer } from "@/types/site";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface ConsumersListProps {
  consumers: Consumer[];
}

const ConsumersList = ({ consumers }: ConsumersListProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRowClick = (consumerId: string) => {
    navigate(`/consumers/${consumerId}`);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Consumption (kW)</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {consumers.map((consumer) => (
          <TableRow
            key={consumer.id}
            onClick={() => handleRowClick(consumer.id)}
            className="cursor-pointer hover:bg-muted/50"
          >
            <TableCell className="font-medium">{consumer.full_name}</TableCell>
            <TableCell className="capitalize">{consumer.type}</TableCell>
            <TableCell>{consumer.consumption}</TableCell>
            <TableCell>
              <Badge variant="secondary" className={getStatusColor(consumer.status)}>
                {consumer.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ConsumersList;