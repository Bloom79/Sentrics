import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Factory, Settings, Calendar } from "lucide-react";
import { Site } from "@/types/site";
import { format } from "date-fns";

interface InfoTabProps {
  site: Site;
}

export function InfoTab({ site }: InfoTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Location Details</h3>
              <p className="text-sm text-muted-foreground">{site.location || 'N/A'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Region</p>
              <p className="text-sm text-muted-foreground">{site.region || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">City</p>
              <p className="text-sm text-muted-foreground">{site.city || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Country</p>
              <p className="text-sm text-muted-foreground">{site.country || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Postal Code</p>
              <p className="text-sm text-muted-foreground">{site.postal_code || 'N/A'}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Factory className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Site Information</h3>
              <p className="text-sm text-muted-foreground">{site.description || 'No description available'}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Site Type</p>
              <p className="text-sm text-muted-foreground capitalize">{site.site_type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Type</p>
              <p className="text-sm text-muted-foreground capitalize">{site.type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground capitalize">{site.operational_status || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Code</p>
              <p className="text-sm text-muted-foreground">{site.code || 'N/A'}</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Technical Details</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Capacity</p>
              <p className="text-sm text-muted-foreground">{site.capacity || 0} kW</p>
            </div>
            <div>
              <p className="text-sm font-medium">Efficiency</p>
              <p className="text-sm text-muted-foreground">{site.efficiency || 0}%</p>
            </div>
            <div>
              <p className="text-sm font-medium">Available Area</p>
              <p className="text-sm text-muted-foreground">{site.available_area || 0} m²</p>
            </div>
            <div>
              <p className="text-sm font-medium">Reserved Area</p>
              <p className="text-sm text-muted-foreground">{site.reserved_area || 0} m²</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="font-semibold">Management Details</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Owner</p>
              <p className="text-sm text-muted-foreground">{site.owner || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Operator</p>
              <p className="text-sm text-muted-foreground">{site.operator || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Maintenance Provider</p>
              <p className="text-sm text-muted-foreground">{site.maintenance_provider || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-sm text-muted-foreground">
                {site.updated_at ? format(new Date(site.updated_at), 'PPp') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}