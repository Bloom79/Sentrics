import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import BatteryStatus from "./BatteryStatus";

const mockSites = [
  { id: "1", name: "Site A", status: "online", currentOutput: "200 kW", efficiency: "95%", dailyProduction: "1,500 kWh", uptime: "99%" },
  { id: "2", name: "Site B", status: "offline", currentOutput: "0 kW", efficiency: "0%", dailyProduction: "0 kWh", uptime: "0%" },
  { id: "3", name: "Site C", status: "online", currentOutput: "150 kW", efficiency: "90%", dailyProduction: "1,200 kWh", uptime: "98%" },
  { id: "4", name: "Site D", status: "online", currentOutput: "300 kW", efficiency: "97%", dailyProduction: "2,000 kWh", uptime: "99%" },
];

interface SiteMonitoringProps {
  onSiteSelect: (siteId: string | null) => void;
}

const SiteMonitoring: React.FC<SiteMonitoringProps> = ({ onSiteSelect }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

  const handleSiteClick = (siteId: string) => {
    const newSelectedSiteId = selectedSiteId === siteId ? null : siteId;
    setSelectedSiteId(newSelectedSiteId);
    onSiteSelect(newSelectedSiteId);
  };

  const handleSiteDoubleClick = (siteId: string) => {
    navigate(`/site/${siteId}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 text-primary">
            <MapPin className="w-5 h-5" />
            {t('dashboard.siteMonitoring')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {mockSites.map((site) => (
              <div
                key={site.id}
                className={`rounded-lg border p-4 space-y-4 cursor-pointer transition-colors ${
                  selectedSiteId === site.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-100 dark:border-gray-700 hover:border-primary/50"
                }`}
                onClick={() => handleSiteClick(site.id)}
                onDoubleClick={() => handleSiteDoubleClick(site.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-primary">{site.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    site.status === 'online' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {site.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('dashboard.currentOutput')}</p>
                    <p className="font-medium">{site.currentOutput}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('dashboard.efficiency')}</p>
                    <p className="font-medium">{site.efficiency}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('dashboard.dailyProduction')}</p>
                    <p className="font-medium">{site.dailyProduction}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('dashboard.uptime')}</p>
                    <p className="font-medium">{site.uptime}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <BatteryStatus selectedSiteId={selectedSiteId ? [selectedSiteId] : null} />
    </div>
  );
};

export default SiteMonitoring;