import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Asset } from "@/types/site";
import { Settings, Power, Calendar, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const router = useRouter();

  const statusColor = {
    operational: "bg-green-500",
    maintenance: "bg-yellow-500",
    offline: "bg-red-500",
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{asset.name}</h3>
            <div className={cn("w-2 h-2 rounded-full", statusColor[asset.status])} />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/assets/${asset.id}`)}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {asset.model && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Power className="w-4 h-4" />
              <span>{asset.model}</span>
            </div>
          )}
          {asset.installation_date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(asset.installation_date).toLocaleDateString()}</span>
            </div>
          )}
          {asset.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{asset.location}</span>
            </div>
          )}
        </div>

        {/* Asset Type Specific Information */}
        {asset.asset_type?.name === 'Solar Panel' && (
          <div className="pt-2 border-t space-y-2">
            {asset.rated_power && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Rated Power</span>
                <Badge variant="secondary">{asset.rated_power}W</Badge>
              </div>
            )}
            {asset.efficiency && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Efficiency</span>
                <Badge variant="secondary">{asset.efficiency}%</Badge>
              </div>
            )}
          </div>
        )}

        {asset.asset_type?.name === 'Solar Array' && (
          <div className="pt-2 border-t space-y-2">
            {asset.dynamic_attributes?.panels_per_string && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Panels per String</span>
                <Badge variant="secondary">
                  {asset.dynamic_attributes.panels_per_string}
                </Badge>
              </div>
            )}
            {asset.dynamic_attributes?.number_of_strings && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Number of Strings</span>
                <Badge variant="secondary">
                  {asset.dynamic_attributes.number_of_strings}
                </Badge>
              </div>
            )}
            {asset.dynamic_attributes?.attached_panels && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Attached Panels</span>
                <Badge variant="secondary">
                  {asset.dynamic_attributes.attached_panels.length} panels
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 