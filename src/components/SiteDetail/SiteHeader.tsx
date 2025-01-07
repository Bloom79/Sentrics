import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Site } from "@/types/site";

interface SiteHeaderProps {
  site: Site;
  onUpdate?: (data: Partial<Site>) => void;
}

const SiteHeader = ({ site }: SiteHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">{site.name}</CardTitle>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{`${site.location.latitude}, ${site.location.longitude}`}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-sm ${
              site.status === "online" 
                ? "bg-green-100 text-green-800" 
                : site.status === "maintenance"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}>
              {site.status}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default SiteHeader;