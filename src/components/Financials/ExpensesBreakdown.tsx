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

interface ExpensesBreakdownProps {
  timeRange: TimeRange;
}

const ExpensesBreakdown = ({ timeRange }: ExpensesBreakdownProps) => {
  // Mock data - in a real app, this would come from an API
  const expenses = [
    {
      category: "Operations & Maintenance",
      amount: "15,000.00",
      details: "Regular maintenance and repairs",
    },
    {
      category: "Fixed Costs",
      amount: "12,500.00",
      details: "Lease, insurance, administrative overhead",
    },
    {
      category: "Variable Costs",
      amount: "8,900.00",
      details: "Fuel for backup, reactive power charges",
    },
    {
      category: "Other",
      amount: "4,500.00",
      details: "Licensing, fees, taxes",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operating Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Details</TableHead>
              <TableHead className="text-right">Amount ($)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((row) => (
              <TableRow key={row.category}>
                <TableCell className="font-medium">{row.category}</TableCell>
                <TableCell>{row.details}</TableCell>
                <TableCell className="text-right">{row.amount}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell className="font-bold">Total</TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right font-bold">40,900.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExpensesBreakdown;