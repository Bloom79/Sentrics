import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RevenueBreakdownProps {
  plantId?: string;
  dateRange: { from: Date; to: Date };
}

const RevenueBreakdown = ({ plantId, dateRange }: RevenueBreakdownProps) => {
  // Mock data - in a real app, this would come from an API
  const gridRevenue = [
    {
      period: "Peak Hours",
      energyExported: 45000,
      tariff: 0.12,
      revenue: 5400,
    },
    {
      period: "Off-Peak Hours",
      energyExported: 65000,
      tariff: 0.08,
      revenue: 5200,
    },
  ];

  const consumerRevenue = [
    {
      name: "Industrial Park A",
      energySold: 25000,
      rate: 0.15,
      revenue: 3750,
    },
    {
      name: "Commercial Center B",
      energySold: 15000,
      rate: 0.13,
      revenue: 1950,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Grid Sales</CardTitle>
          <CardDescription>Revenue from energy exported to the grid</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Energy (kWh)</TableHead>
                <TableHead className="text-right">Tariff ($/kWh)</TableHead>
                <TableHead className="text-right">Revenue ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gridRevenue.map((row) => (
                <TableRow key={row.period}>
                  <TableCell>{row.period}</TableCell>
                  <TableCell className="text-right">{row.energyExported.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${row.tariff.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${row.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consumer Sales</CardTitle>
          <CardDescription>Revenue from direct consumer contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consumer</TableHead>
                <TableHead className="text-right">Energy (kWh)</TableHead>
                <TableHead className="text-right">Rate ($/kWh)</TableHead>
                <TableHead className="text-right">Revenue ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consumerRevenue.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-right">{row.energySold.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${row.rate.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${row.revenue.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueBreakdown;