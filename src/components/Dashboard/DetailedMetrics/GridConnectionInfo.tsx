import React from "react";
import { Zap } from "lucide-react";

interface GridConnection {
  status: string;
  frequency: number;
  voltage: number;
  congestion: string;
}

interface GridConnectionInfoProps {
  connection: GridConnection;
}

export const GridConnectionInfo = ({ connection }: GridConnectionInfoProps) => {
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
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getCongestionColor(connection.congestion)}`} />
        <span className="text-sm">{connection.congestion}</span>
      </div>
      <div className="flex items-center gap-1">
        <Zap className="h-4 w-4 text-accent" />
        <span className="text-sm">
          {`${connection.frequency} Hz / ${connection.voltage} V`}
        </span>
      </div>
    </div>
  );
};