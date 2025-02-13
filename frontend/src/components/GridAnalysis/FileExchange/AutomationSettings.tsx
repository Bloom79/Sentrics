import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AutomationSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automation Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-send Daily Schedule</Label>
            <p className="text-sm text-muted-foreground">
              Automatically generate and send daily schedule at specified time
            </p>
          </div>
          <Switch />
        </div>

        <div className="space-y-2">
          <Label>Schedule Time</Label>
          <Select defaultValue="10">
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 24 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {i.toString().padStart(2, "0")}:00
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Auto-import Settlement Files</Label>
            <p className="text-sm text-muted-foreground">
              Automatically import settlement files when available
            </p>
          </div>
          <Switch />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Real-time Data Sync</Label>
            <p className="text-sm text-muted-foreground">
              Sync metering data in real-time (15-minute intervals)
            </p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  );
};