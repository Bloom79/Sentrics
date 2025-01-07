import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const FinancialSettlement = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Current Billing Period</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Import Cost</p>
              <p className="text-2xl font-bold">€367.50</p>
            </div>
            <div>
              <p className="text-sm font-medium">Export Credit</p>
              <p className="text-2xl font-bold">€153.60</p>
            </div>
            <div>
              <p className="text-sm font-medium">Net Balance</p>
              <p className="text-2xl font-bold text-red-500">€213.90</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settlement History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Import (kWh)</TableHead>
                <TableHead>Export (kWh)</TableHead>
                <TableHead>Net Cost</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>March 2024</TableCell>
                <TableCell>2,450</TableCell>
                <TableCell>1,280</TableCell>
                <TableCell>€213.90</TableCell>
                <TableCell>Pending</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>February 2024</TableCell>
                <TableCell>2,100</TableCell>
                <TableCell>1,450</TableCell>
                <TableCell>€175.50</TableCell>
                <TableCell>Paid</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>January 2024</TableCell>
                <TableCell>2,300</TableCell>
                <TableCell>1,350</TableCell>
                <TableCell>€192.75</TableCell>
                <TableCell>Paid</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};