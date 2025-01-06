import React from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface Site {
  id: string;
  name: string;
  status: string;
  lastUpdate: string;
  dailyProduction: number;
  monthlyProduction: number;
  efficiency: number;
  co2Saved: number;
}

interface SitesListProps {
  sites: Site[];
  selectedTimeRange: string;
}

const SitesList = ({ sites, selectedTimeRange }: SitesListProps) => {
  const navigate = useNavigate();

  const handleSiteClick = (siteId: string) => {
    navigate(`/site/${siteId}`);
  };

  return (
    <div className="bg-card rounded-lg shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Sites Overview</h2>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{selectedTimeRange}</Badge>
            <Badge variant="outline">{`${sites.length} sites`}</Badge>
          </div>
        </div>
        <div className="space-y-4">
          {sites.map((site) => (
            <div
              key={site.id}
              className="bg-background rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => handleSiteClick(site.id)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        site.status === "online"
                          ? "bg-green-500"
                          : site.status === "maintenance"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium hover:underline">{site.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Last update: {new Date(site.lastUpdate).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Daily Production</p>
                    <p className="font-medium">{site.dailyProduction.toLocaleString()} kWh</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Production</p>
                    <p className="font-medium">{site.monthlyProduction.toLocaleString()} kWh</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="font-medium">{site.efficiency}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CO2 Saved</p>
                    <p className="font-medium">{site.co2Saved.toFixed(1)} tons</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SitesList;