import React, { useState } from "react";
import { Activity, Battery, Zap, Sun, Wind, Filter } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import EnergyFlow from "@/components/Dashboard/EnergyFlow";
import MetricsCard from "@/components/Dashboard/MetricsCard";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const sites = [
  {
    id: "1",
    name: "Milano Nord",
    status: "online",
    lastUpdate: "2024-02-20T10:30:00Z",
    dailyProduction: 2500,
    monthlyProduction: 75000,
    efficiency: 92,
    co2Saved: 45.2,
  },
  {
    id: "2",
    name: "Roma Est",
    status: "maintenance",
    lastUpdate: "2024-02-20T09:15:00Z",
    dailyProduction: 2100,
    monthlyProduction: 63000,
    efficiency: 88,
    co2Saved: 38.5,
  },
  {
    id: "3",
    name: "Torino Sud",
    status: "online",
    lastUpdate: "2024-02-20T10:25:00Z",
    dailyProduction: 1800,
    monthlyProduction: 54000,
    efficiency: 90,
    co2Saved: 32.8,
  },
];

const Index = () => {
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("24h");

  const handleSiteClick = (siteId: string) => {
    navigate(`/site/${siteId}`);
  };

  const filteredSites = sites.filter((site) => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || site.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="container py-8">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">SentricS Dashboard</h1>
            <p className="text-muted-foreground mt-2">{t('dashboard.subtitle')}</p>
          </div>
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <Input
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSelectedStatus("all")}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("online")}>
                    Online Only
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedStatus("maintenance")}>
                    Maintenance
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Time Range</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSelectedTimeRange("24h")}>
                    Last 24 Hours
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTimeRange("7d")}>
                    Last 7 Days
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTimeRange("30d")}>
                    Last 30 Days
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <Select value={language} onValueChange={(value: 'en' | 'it') => setLanguage(value)}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <MetricsCard
              title={t('dashboard.totalProduction')}
              value="1,030 kW"
              description={t('dashboard.productionChange')}
              icon={<Zap className="w-4 h-4 text-accent" />}
            />
            <MetricsCard
              title={t('dashboard.solarProduction')}
              value="630 kW"
              description={t('dashboard.solarArrays')}
              icon={<Sun className="w-4 h-4 text-yellow-500" />}
            />
            <MetricsCard
              title={t('dashboard.windProduction')}
              value="400 kW"
              description={t('dashboard.windTurbines')}
              icon={<Wind className="w-4 h-4 text-blue-500" />}
            />
            <MetricsCard
              title={t('dashboard.storageEfficiency')}
              value="92%"
              description={t('dashboard.optimalPerformance')}
              icon={<Battery className="w-4 h-4 text-secondary" />}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <EnergyFlow />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="bg-card rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Sites Overview</h2>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{selectedTimeRange}</Badge>
                    <Badge variant="outline">{`${filteredSites.length} sites`}</Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  {filteredSites.map((site) => (
                    <div
                      key={site.id}
                      className="bg-background rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleSiteClick(site.id)}
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                        <div className="lg:col-span-2">
                          <div className="flex items-center gap-4">
                            <div
                              className={`h-3 w-3 rounded-full ${
                                site.status === "online"
                                  ? "bg-green-500"
                                  : site.status === "maintenance"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <div>
                              <p className="font-medium hover:underline">{site.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Last update: {new Date(site.lastUpdate).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Daily Production</p>
                            <p className="font-medium">{site.dailyProduction.toLocaleString()} kWh</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Monthly Production</p>
                            <p className="font-medium">{site.monthlyProduction.toLocaleString()} kWh</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Efficiency</p>
                            <p className="font-medium">{site.efficiency}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">CO2 Saved</p>
                            <p className="font-medium">{site.co2Saved.toFixed(1)} tons</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
