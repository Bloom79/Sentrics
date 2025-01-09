import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Asset, AssetMonitoring } from "@/types/site";
import { formatDistanceToNow } from "date-fns";
import { Battery, Gauge, Activity, Cpu, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AssetOverviewProps {
  asset: Asset;
  monitoringData?: AssetMonitoring[];
}

export const AssetOverview = ({ asset, monitoringData }: AssetOverviewProps) => {
  const getLatestValue = () => {
    if (!monitoringData?.length) return null;
    return monitoringData[0].value;
  };

  const latestValue = getLatestValue();
  const nominalPower = asset.rated_power || 0;
  const efficiency = asset.efficiency || 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Nominal Power
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nominal power value registered in Gaudì</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <Gauge className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{nominalPower} kW</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Current Output
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 ml-1 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Real-time power output from monitoring system</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <Activity className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {latestValue ? `${latestValue} kW` : "N/A"}
          </div>
          {latestValue && (
            <p className="text-xs text-muted-foreground">
              {((latestValue / nominalPower) * 100).toFixed(1)}% of nominal
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
          <Battery className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{efficiency}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Update</CardTitle>
          <Cpu className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {monitoringData?.length ? (
              formatDistanceToNow(new Date(monitoringData[0].timestamp), { addSuffix: true })
            ) : (
              "No data"
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};