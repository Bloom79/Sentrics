import React from "react";
import { Battery } from "lucide-react";

interface Storage {
  capacity: number;
  currentCharge: number;
}

interface StorageInfoProps {
  storage: Storage;
}

export const StorageInfo = ({ storage }: StorageInfoProps) => {
  return (
    <div className="flex items-center gap-1">
      <Battery className="h-4 w-4 text-green-500" />
      <span className="text-sm">
        {`${Math.round((storage.currentCharge / storage.capacity) * 100)}% (${storage.currentCharge} kWh)`}
      </span>
    </div>
  );
};