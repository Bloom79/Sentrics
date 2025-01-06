import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Factory, Building2, Home, ExternalLink } from "lucide-react";
import { Consumer } from "@/types/site";

interface ConsumersListProps {
  consumers: Consumer[];
}

const getConsumerIcon = (type: Consumer["type"]) => {
  switch (type) {
    case "industrial":
      return <Factory className="h-4 w-4" />;
    case "commercial":
      return <Building2 className="h-4 w-4" />;
    case "residential":
      return <Home className="h-4 w-4" />;
  }
};

const getStatusColor = (status: Consumer["status"]) => {
  switch (status) {
    case "online":
      return "bg-green-500/10 text-green-500";
    case "maintenance":
      return "bg-yellow-500/10 text-yellow-500";
    case "offline":
      return "bg-red-500/10 text-red-500";
  }
};

const ConsumersList = ({ consumers }: ConsumersListProps) => {
  const totalConsumption = consumers.reduce((sum, consumer) => sum + consumer.consumption, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Consumers</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Total Consumption: {totalConsumption.toLocaleString()} kW
            </Badge>
            <Badge variant="outline">{consumers.length} consumers</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Current Consumption</TableHead>
              <TableHead>Peak Demand</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consumers.map((consumer) => (
              <TableRow key={consumer.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getConsumerIcon(consumer.type)}
                    <span className="capitalize">{consumer.type}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{consumer.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(consumer.status)}>
                    {consumer.status}
                  </Badge>
                </TableCell>
                <TableCell>{consumer.consumption.toLocaleString()} kW</TableCell>
                <TableCell>{consumer.peakDemand?.toLocaleString() ?? "N/A"} kW</TableCell>
                <TableCell>{consumer.location ?? "N/A"}</TableCell>
                <TableCell>
                  {consumer.lastUpdate 
                    ? new Date(consumer.lastUpdate).toLocaleString()
                    : "N/A"}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ConsumersList;