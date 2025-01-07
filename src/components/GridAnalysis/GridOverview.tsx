import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Zap } from "lucide-react";

const GridOverview = () => {
  // Mock data - in a real app, this would come from an API
  const gridStatus = {
    status: "online",
    importPower: 200,
    exportPower: 50,
    netExchangeToday: -150, // negative means net import
    alerts: [
      {
        type: "warning",
        message: "Approaching export limit (80% of capacity)",
      },
    ],
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Grid Status</CardTitle>
            <Zap className={`h-4 w-4 ${
              gridStatus.status === "online" ? "text-green-500" : "text-yellow-500"
            }`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{gridStatus.status}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Exchange</CardTitle>
            <div className="flex gap-2">
              <ArrowDownToLine className="h-4 w-4 text-blue-500" />
              <ArrowUpFromLine className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Import: {gridStatus.importPower} kW
              </p>
              <p className="text-sm text-muted-foreground">
                Export: {gridStatus.exportPower} kW
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Net Exchange</CardTitle>
            {gridStatus.netExchangeToday < 0 ? (
              <ArrowDownToLine className="h-4 w-4 text-blue-500" />
            ) : (
              <ArrowUpFromLine className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.abs(gridStatus.netExchangeToday)} kWh
            </div>
            <p className="text-xs text-muted-foreground">
              Net {gridStatus.netExchangeToday < 0 ? "Import" : "Export"}
            </p>
          </CardContent>
        </Card>
      </div>

      {gridStatus.alerts.map((alert, index) => (
        <Alert key={index} variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default GridOverview;