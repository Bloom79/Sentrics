import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface Alert {
  id: string;
  type: "warning" | "error" | "info";
  message: string;
  timestamp: string;
}

// Mock data - replace with actual API call
const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    message: "Battery temperature above normal range",
    timestamp: "2024-02-20T10:30:00Z",
  },
  {
    id: "2",
    type: "info",
    message: "Scheduled maintenance upcoming",
    timestamp: "2024-02-20T09:15:00Z",
  },
];

interface SiteAlertsProps {
  siteId: string;
}

const SiteAlerts = ({ siteId }: SiteAlertsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Active Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
            >
              {alert.type === "warning" ? (
                <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteAlerts;