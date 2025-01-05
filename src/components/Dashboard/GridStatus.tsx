import React from "react";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const GridStatus = () => {
  const congestionLevel = "Low";
  const gridFrequency = 50.02;
  const voltage = 230.5;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          Grid Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Congestion Level</p>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                <p className="text-sm text-muted-foreground">{congestionLevel}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Grid Frequency</p>
              <p className="text-sm text-muted-foreground">{gridFrequency} Hz</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Voltage</p>
              <p className="text-sm text-muted-foreground">{voltage} V</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GridStatus;