import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Edit2, Check, X } from "lucide-react";
import { Site } from "@/types/site";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InfoTabProps {
  site: Site;
  onUpdate: (data: Partial<Site>) => void;
}

export function InfoTab({ site, onUpdate }: InfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: site.name,
    type: site.type,
    capacity: site.capacity.toString(),
  });

  const handleSave = () => {
    onUpdate({
      ...site,
      name: editedData.name,
      type: editedData.type,
      capacity: parseInt(editedData.capacity),
    });
    setIsEditing(false);
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              {isEditing ? (
                <Input
                  value={editedData.name}
                  onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                  className="max-w-xs"
                />
              ) : (
                <h3 className="font-semibold">{site.name}</h3>
              )}
              <p className="text-sm text-muted-foreground">
                {`${site.location.latitude}, ${site.location.longitude}`}
              </p>
            </div>
          </div>
          {!isEditing ? (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleSave}>
                <Check className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Type</p>
            {isEditing ? (
              <Input
                value={editedData.type}
                onChange={(e) => setEditedData({ ...editedData, type: e.target.value })}
                className="max-w-xs"
              />
            ) : (
              <p className="text-sm text-muted-foreground capitalize">{site.type}</p>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">Capacity</p>
            {isEditing ? (
              <Input
                value={editedData.capacity}
                onChange={(e) => setEditedData({ ...editedData, capacity: e.target.value })}
                type="number"
                className="max-w-xs"
              />
            ) : (
              <p className="text-sm text-muted-foreground">{site.capacity} kW</p>
            )}
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