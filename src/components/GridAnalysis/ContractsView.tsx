import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign } from "lucide-react";

export const ContractsView = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Active Grid Connection Agreement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Contract ID</p>
              <p className="text-lg">GCA-2024-001</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Validity Period</p>
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span>Jan 1, 2024 - Dec 31, 2024</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Maximum Export Capacity</p>
              <p className="text-lg">500 kW</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Tariff Information</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium">Feed-in Tariff</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>0.12 €/kWh</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Import Rate</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>0.15 €/kWh</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};