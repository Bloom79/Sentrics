import React from "react";
import { Asset, AssetMonitoring } from "@/types/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface AssetMonitoringViewProps {
  assets: Asset[];
  monitoringData: AssetMonitoring[];
}

export const AssetMonitoringView: React.FC<AssetMonitoringViewProps> = ({ 
  assets, 
  monitoringData 
}) => {
  const getSensorInfo = (asset: Asset) => {
    const sensors = asset.dynamic_attributes?.sensors || [];
    return sensors.map((sensor: any) => {
      const latestReading = monitoringData
        .filter(data => data.parameter === sensor.type.toLowerCase())
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

      return {
        ...sensor,
        latestReading: latestReading?.value || 'N/A',
        timestamp: latestReading?.timestamp
      };
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sensor Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {assets.map(asset => (
            <div key={asset.id} className="space-y-4">
              <h3 className="text-lg font-semibold">{asset.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSensorInfo(asset).map((sensor: any, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{sensor.type}</p>
                            <p className="text-sm text-muted-foreground">
                              Location: {sensor.location}
                            </p>
                          </div>
                          <Badge>{sensor.status || 'Active'}</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Current Reading</p>
                            <p className="font-medium">
                              {sensor.latestReading} {sensor.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Last Updated</p>
                            <p className="font-medium">
                              {sensor.timestamp ? format(new Date(sensor.timestamp), 'HH:mm:ss') : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Last Calibration</p>
                          <p className="font-medium">
                            {sensor.calibrationDate ? format(new Date(sensor.calibrationDate), 'dd/MM/yyyy') : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};