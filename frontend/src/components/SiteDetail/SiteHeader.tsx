import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Settings } from "lucide-react";
import { Site } from "@/types/site";
import { EditSiteDialog } from "./EditSiteDialog";

interface SiteHeaderProps {
  site: Site;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ site }) => {
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <h2 className="text-2xl font-bold">{site.name}</h2>
                <p className="text-sm text-muted-foreground">{site.location}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-8 ml-8">
              <div>
                <p className="text-sm font-medium">Type</p>
                <p className="text-sm text-muted-foreground capitalize">{site.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <p className="text-sm text-muted-foreground capitalize">{site.operational_status}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Capacity</p>
                <p className="text-sm text-muted-foreground">{site.capacity} kW</p>
              </div>
            </div>
          </div>
          <EditSiteDialog site={site} open={showEditDialog} onOpenChange={setShowEditDialog}>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </EditSiteDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteHeader;