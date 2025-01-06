import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Activity, Gauge } from "lucide-react";

interface GridConnection {
  status: string;
  frequency: number;
  voltage: number;
  congestion: string;
}

interface GridConnectionInfoProps {
  gridConnection: GridConnection;
}

const GridConnectionInfo = ({ gridConnection }: GridConnectionInfoProps) => {
  const getCongestionColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Grid Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Connection Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${
                gridConnection.status === "connected" ? "bg-green-500" : "bg-red-500"
              }`} />
              <span className="capitalize">{gridConnection.status}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Grid Frequency</span>
            </div>
            <p className="text-2xl font-semibold">
              {gridConnection.frequency.toFixed(2)} <span className="text-sm font-normal">Hz</span>
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Grid Voltage</span>
            </div>
            <p className="text-2xl font-semibold">
              {gridConnection.voltage.toFixed(1)} <span className="text-sm font-normal">V</span>
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Congestion Level</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${getCongestionColor(gridConnection.congestion)}`} />
              <span>{gridConnection.congestion}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GridConnectionInfo;