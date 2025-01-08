import React from "react";
import { Card } from "@/components/ui/card";
import StorageOverview from "./StorageTab/StorageOverview";
import StorageMetrics from "./StorageTab/StorageMetrics";
import { Site } from "@/types/site";

interface StorageTabProps {
  site: Site;
}

const StorageTab: React.FC<StorageTabProps> = ({ site }) => {
  return (
    <div className="space-y-6">
      <StorageMetrics storageUnits={site.storageUnits} />
      <StorageOverview storageUnits={site.storageUnits} />
    </div>
  );
};

export default StorageTab;