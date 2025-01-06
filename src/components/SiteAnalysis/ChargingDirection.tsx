import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { ChargingDirection } from "@/types/battery";

interface ChargingDirectionProps {
  direction: ChargingDirection;
}

const ChargingDirection: React.FC<ChargingDirectionProps> = ({ direction }) => {
  if (direction === "charging") {
    return <ArrowUp className="h-4 w-4 text-green-500" />;
  }
  return <ArrowDown className="h-4 w-4 text-amber-500" />;
};

export default ChargingDirection;