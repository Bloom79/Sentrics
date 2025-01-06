import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Sun, Wind, Activity, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BatteryStatus from "./BatteryStatus";

type SiteStatus = {
  id: string;
  name: string;
  status: "operational" | "warning" | "critical";
  solarOutput: number;
  windOutput: number;
  storageLevel: number;
  efficiency: number;
};

const mockSites: SiteStatus[] = [
  {
    id: "1",
    name: "Milano Nord",
    status: "operational",
    solarOutput: 450,
    windOutput: 300,
    storageLevel: 85,
    efficiency: 94,
  },
  {
    id: "2",
    name: "Roma Est",
    status: "warning",
    solarOutput: 380,
    windOutput: 250,
    storageLevel: 65,
    efficiency: 88,
  },
  {
    id: "3",
    name: "Torino Sud",
    status: "operational",
    solarOutput: 420,
    windOutput: 280,
    storageLevel: 92,
    efficiency: 96,
  },
];

interface SiteMonitoringProps {
  onSiteSelect: (siteIds: string[] | null) => void;
}

const SiteMonitoring: React.FC<SiteMonitoringProps> = ({ onSiteSelect }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedSites, setSelectedSites] = useState<string[]>([]);

  const handleSiteClick = (siteId: string) => {
    const newSelectedSites = selectedSites.includes(siteId)
      ? selectedSites.filter(id => id !== siteId)
      : [...selectedSites, siteId];
    
    setSelectedSites(newSelectedSites);
    onSiteSelect(newSelectedSites.length > 0 ? newSelectedSites : null);
  };

  const handleSiteDoubleClick = (siteId: string) => {
    navigate(`/site/${siteId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-white dark:bg-gray-800">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Home className="h-5 w-5 text-accent" />
            {t('dashboard.siteMonitoring')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-6">
              {mockSites.map((site) => (
                <div
                  key={site.id}
                  className={`rounded-lg border p-4 space-y-4 cursor-pointer transition-colors ${
                    selectedSites.includes(site.id)
                      ? "border-primary bg-primary/5"
                      : "border-gray-100 dark:border-gray-700 hover:border-primary/50"
                  }`}
                  onClick={() => handleSiteClick(site.id)}
                  onDoubleClick={() => handleSiteDoubleClick(site.id)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-primary">{site.name}</h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          site.status === "operational"
                            ? "bg-emerald-500"
                            : site.status === "warning"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                      />
                      <span className="text-sm capitalize text-gray-600 dark:text-gray-300">
                        {site.status}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-amber-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {t('dashboard.solar')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {site.solarOutput} kW
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                          {t('dashboard.wind')}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {site.windOutput} kW
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/site/${site.id}`);
                    }}
                  >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      <BatteryStatus selectedSiteId={selectedSites} />
    </div>
  );
};

export default SiteMonitoring;