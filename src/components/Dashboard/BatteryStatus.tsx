import React from "react";
import { Battery, BatteryCharging, BatteryFull, BatteryLow, BatteryMedium, BatteryWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StorageUnit } from "@/types/site";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";

const mockStorageUnits: (StorageUnit & { siteName: string; siteId: string })[] = [
  {
    id: "1",
    siteId: "1",
    siteName: "Milano Nord",
    capacity: 1000,
    currentCharge: 850,
    status: "charging",
    health: 98,
    temperature: 25,
    powerRating: 250,
  },
  {
    id: "2",
    siteId: "2",
    siteName: "Roma Est",
    capacity: 1500,
    currentCharge: 450,
    status: "discharging",
    health: 95,
    temperature: 27,
    powerRating: 350,
  },
  {
    id: "3",
    siteId: "1",
    siteName: "Milano Nord",
    capacity: 1200,
    currentCharge: 960,
    status: "charging",
    health: 97,
    temperature: 26,
    powerRating: 300,
  },
];

interface BatteryStatusProps {
  selectedSiteId: string[] | null;
}

const BatteryStatus: React.FC<BatteryStatusProps> = ({ selectedSiteId }) => {
  const { t } = useLanguage();
  
  const filteredStorageUnits = selectedSiteId
    ? mockStorageUnits.filter(unit => selectedSiteId.includes(unit.siteId))
    : mockStorageUnits;

  const getBatteryIcon = (percentage: number, status: string) => {
    if (status === "charging") return <BatteryCharging className="w-5 h-5 text-green-500" />;
    if (percentage >= 90) return <BatteryFull className="w-5 h-5 text-green-500" />;
    if (percentage >= 50) return <BatteryMedium className="w-5 h-5 text-yellow-500" />;
    if (percentage >= 20) return <BatteryLow className="w-5 h-5 text-orange-500" />;
    return <BatteryWarning className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (status: string) => {
    return status === "charging" ? "text-green-500" : "text-amber-500";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Battery className="w-5 h-5" />
            {t('dashboard.storageUnits')}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {filteredStorageUnits.map((unit) => {
              const chargePercentage = (unit.currentCharge / unit.capacity) * 100;
              
              return (
                <div key={unit.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        {getBatteryIcon(chargePercentage, unit.status)}
                        <span className="text-sm font-medium">Storage Unit {unit.id}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{unit.siteName}</p>
                    </div>
                    <span className="text-sm font-medium">
                      {chargePercentage.toFixed(1)}%
                    </span>
                  </div>
                  
                  <Progress 
                    value={chargePercentage} 
                    className={`h-2 ${
                      unit.status === "charging" ? "animate-flow-right bg-green-100" : ""
                    }`}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <p className={`text-sm capitalize ${getStatusColor(unit.status)}`}>
                        {unit.status === "charging" ? "+250 kW Charging" : "-180 kW Discharging"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Capacity</p>
                      <p className="text-sm text-muted-foreground">
                        {unit.powerRating} kW / {unit.capacity} kWh
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Temperature</p>
                      <p className="text-sm text-muted-foreground">
                        {unit.temperature}°C
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Health</p>
                      <p className="text-sm text-muted-foreground">{unit.health}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BatteryStatus;