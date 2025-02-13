import React from "react";
import { Card } from "@/components/ui/card";
import { Plug } from "lucide-react";
import { Site } from "@/types/site";

interface GridTabProps {
  site: Site;
}

export function GridTab({ site }: GridTabProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Plug className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Grid Connection Status</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Status</p>
            <p className="text-sm text-muted-foreground capitalize">
              {site.gridConnection.status}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Frequency</p>
            <p className="text-sm text-muted-foreground">
              {site.gridConnection.frequency} Hz
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Voltage</p>
            <p className="text-sm text-muted-foreground">
              {site.gridConnection.voltage} V
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Congestion</p>
            <p className="text-sm text-muted-foreground capitalize">
              {site.gridConnection.congestion}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}