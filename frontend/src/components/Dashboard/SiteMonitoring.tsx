import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Site {
  id: string;
  name: string;
  status: "online" | "offline" | "maintenance";
  lastUpdate: string;
}

interface SiteMonitoringProps {
  onSiteSelect: (siteId: string | null) => void;
}

const SiteMonitoring = ({ onSiteSelect }: SiteMonitoringProps) => {
  // Mock data - replace with actual API call
  const sites: Site[] = [
    {
      id: "1",
      name: "North Site",
      status: "online",
      lastUpdate: "2024-02-20T10:30:00Z",
    },
    {
      id: "2",
      name: "South Site",
      status: "maintenance",
      lastUpdate: "2024-02-20T09:15:00Z",
    },
    {
      id: "3",
      name: "East Site",
      status: "online",
      lastUpdate: "2024-02-20T10:25:00Z",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Monitoring</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sites.map((site) => (
            <Link
              key={site.id}
              to={`/site/${site.id}`}
              className="block"
              onClick={() => onSiteSelect(site.id)}
            >
              <div className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors">
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
                    <p className="font-medium">{site.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Last update: {new Date(site.lastUpdate).toLocaleString()}
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteMonitoring;