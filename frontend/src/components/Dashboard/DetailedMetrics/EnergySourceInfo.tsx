import React from "react";
import { Sun, Wind } from "lucide-react";

interface EnergySource {
  type: string;
  output: number;
  capacity: number;
}

interface EnergySourceInfoProps {
  sources: EnergySource[];
}

export const EnergySourceInfo = ({ sources }: EnergySourceInfoProps) => {
  return (
    <div className="flex flex-col gap-1">
      {sources.map((source) => (
        <div key={source.type} className="flex items-center gap-1">
          {source.type === "solar" ? (
            <Sun className="h-4 w-4 text-yellow-500" />
          ) : (
            <Wind className="h-4 w-4 text-blue-500" />
          )}
          <span className="text-sm">{`${source.output}/${source.capacity} kW`}</span>
        </div>
      ))}
    </div>
  );
};