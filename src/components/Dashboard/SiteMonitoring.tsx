import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Sun, Wind, Battery, Activity } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";

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

const SiteMonitoring = () => {
  const { t } = useLanguage();
  const [selectedSites, setSelectedSites] = useState<string[]>([]);

  const handleSiteToggle = (siteId: string) => {
    setSelectedSites(prev =>
      prev.includes(siteId)
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };

  const displayedSites = selectedSites.length > 0
    ? mockSites.filter(site => selectedSites.includes(site.id))
    : mockSites;

  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardHeader className="border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Home className="h-5 w-5 text-accent" />
            {t('dashboard.siteMonitoring')}
          </CardTitle>
          <div className="flex gap-2">
            {mockSites.map(site => (
              <div key={site.id} className="flex items-center gap-2">
                <Checkbox
                  id={`site-${site.id}`}
                  checked={selectedSites.includes(site.id)}
                  onCheckedChange={() => handleSiteToggle(site.id)}
                />
                <label htmlFor={`site-${site.id}`} className="text-sm text-gray-600 dark:text-gray-300">
                  {site.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {displayedSites.map((site) => (
              <div
                key={site.id}
                className="rounded-lg border border-gray-100 dark:border-gray-700 p-4 space-y-4 bg-white dark:bg-gray-800 shadow-sm"
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-amber-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('dashboard.solar')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {site.solarOutput} kW
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wind className="h-4 w-4 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('dashboard.wind')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {site.windOutput} kW
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Battery className="h-4 w-4 text-emerald-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('dashboard.storage')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {site.storageLevel}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-violet-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('dashboard.efficiency')}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {site.efficiency}%
                      </p>
                    </div>
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

export default SiteMonitoring;