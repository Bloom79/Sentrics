import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GridConnectionInfo } from "./DetailedMetrics/GridConnectionInfo";
import { StorageInfo } from "./DetailedMetrics/StorageInfo";
import { EnergySourceInfo } from "./DetailedMetrics/EnergySourceInfo";
import { SiteRow } from "./DetailedMetrics/SiteRow";
import { mockSites } from "@/data/mockData";

const DetailedMetrics = () => {
  return (
    <div>
      {mockSites.map((site) => (
        <Card key={site.id} className="mb-4">
          <CardHeader>
            <CardTitle>{site.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <SiteRow site={site} isExpanded={false} onToggle={() => {}} />
            <GridConnectionInfo connection={site.gridConnection} />
            <StorageInfo storage={site.storage} />
            <div className="space-y-4">
              {site.energySources.map((source, index) => (
                <EnergySourceInfo key={index} sources={[source]} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DetailedMetrics;