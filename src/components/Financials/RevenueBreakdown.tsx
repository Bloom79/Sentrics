import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeRange } from "@/types/flowComponents";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RevenueBreakdownProps {
  timeRange: TimeRange;
}

const RevenueBreakdown = ({ timeRange }: RevenueBreakdownProps) => {
  // Mock data - in a real app, this would come from an API
  const gridRevenue = [
    {
      period: "Peak",
      energyExported: "2,500",
      tariff: "0.15",
      revenue: "375.00",
    },
    {
      period: "Off-Peak",
      energyExported: "4,200",
      tariff: "0.08",
      revenue: "336.00",
    },
    {
      period: "Shoulder",
      energyExported: "3,300",
      tariff: "0.12",
      revenue: "396.00",
    },
  ];

  const consumerRevenue = [
    {
      name: "Industrial Park A",
      energySold: "15,000",
      rate: "0.13",
      revenue: "1,950.00",
    },
    {
      name: "Commercial Center B",
      energySold: "8,500",
      rate: "0.14",
      revenue: "1,190.00",
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grid Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Energy Exported (kWh)</TableHead>
                <TableHead className="text-right">Tariff ($/kWh)</TableHead>
                <TableHead className="text-right">Revenue ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gridRevenue.map((row) => (
                <TableRow key={row.period}>
                  <TableCell>{row.period}</TableCell>
                  <TableCell className="text-right">{row.energyExported}</TableCell>
                  <TableCell className="text-right">{row.tariff}</TableCell>
                  <TableCell className="text-right">{row.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consumer Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Consumer</TableHead>
                <TableHead className="text-right">Energy Sold (kWh)</TableHead>
                <TableHead className="text-right">Rate ($/kWh)</TableHead>
                <TableHead className="text-right">Revenue ($)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consumerRevenue.map((row) => (
                <TableRow key={row.name}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell className="text-right">{row.energySold}</TableCell>
                  <TableCell className="text-right">{row.rate}</TableCell>
                  <TableCell className="text-right">{row.revenue}</TableCell>
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