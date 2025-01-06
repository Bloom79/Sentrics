import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Site } from "@/types/site";

interface InfoTabProps {
  site: Site;
}

export function InfoTab({ site }: InfoTabProps) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">{site.name}</h3>
            <p className="text-sm text-muted-foreground">{site.location}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Type</p>
            <p className="text-sm text-muted-foreground capitalize">{site.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Capacity</p>
            <p className="text-sm text-muted-foreground">{site.capacity} kW</p>
          </div>
          <div>
            <p className="text-sm font-medium">Efficiency</p>
            <p className="text-sm text-muted-foreground">{site.efficiency}%</p>
          </div>
          <div>
            <p className="text-sm font-medium">CO2 Saved</p>
            <p className="text-sm text-muted-foreground">{site.co2Saved} tons</p>
          </div>
        </div>
      </div>
    </Card>
  );
}