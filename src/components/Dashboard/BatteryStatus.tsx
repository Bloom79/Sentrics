import React from "react";
import { Battery } from "lucide-react";
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
    capacity: 100,
    currentCharge: 85,
    status: "charging",
    health: 98,
    temperature: 25,
  },
  {
    id: "2",
    siteId: "2",
    siteName: "Roma Est",
    capacity: 150,
    currentCharge: 120,
    status: "discharging",
    health: 95,
    temperature: 27,
  },
  {
    id: "3",
    siteId: "1",
    siteName: "Milano Nord",
    capacity: 120,
    currentCharge: 90,
    status: "charging",
    health: 97,
    temperature: 26,
  },
];

interface BatteryStatusProps {
  selectedSiteId: string | null;
}

const BatteryStatus: React.FC<BatteryStatusProps> = ({ selectedSiteId }) => {
  const { t } = useLanguage();
  
  const filteredStorageUnits = selectedSiteId
    ? mockStorageUnits.filter(unit => unit.siteId === selectedSiteId)
    : mockStorageUnits;

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
            {filteredStorageUnits.map((unit) => (
              <div key={unit.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">Storage Unit {unit.id}</span>
                    <p className="text-xs text-muted-foreground">{unit.siteName}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {(unit.currentCharge / unit.capacity * 100).toFixed(0)}%
                  </span>
                </div>
                <Progress 
                  value={(unit.currentCharge / unit.capacity) * 100} 
                  className="h-2" 
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">{t('dashboard.status')}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {unit.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('dashboard.power')}</p>
                    <p className="text-sm text-muted-foreground">
                      {unit.currentCharge.toFixed(1)} kWh
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('dashboard.temperature')}</p>
                    <p className="text-sm text-muted-foreground">
                      {unit.temperature}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t('dashboard.health')}</p>
                    <p className="text-sm text-muted-foreground">{unit.health}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default BatteryStatus;