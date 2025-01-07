import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, ArrowDownToLine, ArrowUpFromLine, Power } from "lucide-react";

export const GridOverview = () => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grid Status</CardTitle>
            <Power className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Online</div>
            <p className="text-xs text-muted-foreground">Normal operation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Import Power</CardTitle>
            <ArrowDownToLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">200 kW</div>
            <p className="text-xs text-muted-foreground">Current import rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Export Power</CardTitle>
            <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50 kW</div>
            <p className="text-xs text-muted-foreground">Current export rate</p>
          </CardContent>
        </Card>
      </div>

      <Alert variant="warning">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          Grid frequency deviation detected: 50.2 Hz (Normal range: 49.8-50.2 Hz)
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Today's Net Exchange</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium">Total Import</p>
              <p className="text-2xl font-bold">2,450 kWh</p>
            </div>
            <div>
              <p className="text-sm font-medium">Total Export</p>
              <p className="text-2xl font-bold">1,280 kWh</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};