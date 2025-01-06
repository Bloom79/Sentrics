import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, CheckCircle, AlertCircle, XCircle, Battery, Wind, Sun } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface DetailedMetricsProps {
  selectedSiteId: string | null;
  onSiteSelect?: (siteId: string) => void;
  searchTerm: string;
  selectedStatus: string;
  selectedTimeRange: string;
}

// Mock data - replace with actual data later
const mockSiteData = [
  {
    id: "1",
    name: "Milano Nord",
    status: "online",
    lastUpdate: "2024-02-20T11:30:00",
    dailyProduction: 2500,
    monthlyProduction: 75000,
    efficiency: 92,
    co2Saved: 45.2,
    energySources: [
      { type: "solar", output: 1500, capacity: 2000 },
      { type: "wind", output: 1000, capacity: 1500 }
    ],
    storage: { capacity: 5000, currentCharge: 4200 },
    gridConnection: { status: "connected", frequency: 50.02, congestion: "Low" }
  },
  {
    id: "2",
    name: "Roma Est",
    status: "maintenance",
    lastUpdate: "2024-02-20T10:15:00",
    dailyProduction: 2100,
    monthlyProduction: 63000,
    efficiency: 88,
    co2Saved: 38.5,
    energySources: [
      { type: "solar", output: 1200, capacity: 1800 },
      { type: "wind", output: 900, capacity: 1200 }
    ],
    storage: { capacity: 4000, currentCharge: 2800 },
    gridConnection: { status: "connected", frequency: 49.98, congestion: "Medium" }
  },
  {
    id: "3",
    name: "Torino Sud",
    status: "online",
    lastUpdate: "2024-02-20T11:25:00",
    dailyProduction: 1800,
    monthlyProduction: 54000,
    efficiency: 90,
    co2Saved: 32.8,
    energySources: [
      { type: "solar", output: 1000, capacity: 1500 },
      { type: "wind", output: 800, capacity: 1000 }
    ],
    storage: { capacity: 3000, currentCharge: 2700 },
    gridConnection: { status: "connected", frequency: 50.00, congestion: "Low" }
  },
];

const DetailedMetrics: React.FC<DetailedMetricsProps> = ({ 
  selectedSiteId, 
  onSiteSelect, 
  searchTerm, 
  selectedStatus, 
  selectedTimeRange 
}) => {
  const { t } = useLanguage();
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "maintenance":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const filteredSites = mockSiteData.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || site.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const calculateTotals = (sites: typeof mockSiteData) => ({
    dailyProduction: sites.reduce((sum, site) => sum + site.dailyProduction, 0),
    monthlyProduction: sites.reduce((sum, site) => sum + site.monthlyProduction, 0),
    efficiency: sites.reduce((sum, site) => sum + site.efficiency, 0) / sites.length,
    co2Saved: sites.reduce((sum, site) => sum + site.co2Saved, 0),
  });

  const totals = calculateTotals(filteredSites);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Sites Overview
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{selectedTimeRange}</Badge>
            <Badge variant="outline">{`${filteredSites.length} sites`}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Site Name</TableHead>
                <TableHead>Energy Sources</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead className="text-right">Daily Production (kWh)</TableHead>
                <TableHead className="text-right">Monthly Production (kWh)</TableHead>
                <TableHead className="text-right">Efficiency (%)</TableHead>
                <TableHead className="text-right">CO2 Saved (tons)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSites.map((site) => (
                <TableRow
                  key={site.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onSiteSelect?.(site.id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(site.status)}
                      <span className="text-sm font-medium">
                        {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{`${site.energySources[0].output}/${site.energySources[0].capacity} kW`}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Wind className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">{`${site.energySources[1].output}/${site.energySources[1].capacity} kW`}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Battery className="h-4 w-4 text-green-500" />
                      <span className="text-sm">
                        {`${Math.round((site.storage.currentCharge / site.storage.capacity) * 100)}% (${site.storage.currentCharge} kWh)`}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{site.dailyProduction.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{site.monthlyProduction.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{site.efficiency}%</TableCell>
                  <TableCell className="text-right">{site.co2Saved.toFixed(1)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold bg-muted/50">
                <TableCell colSpan={4}>Total / Average</TableCell>
                <TableCell className="text-right">{totals.dailyProduction.toLocaleString()}</TableCell>
                <TableCell className="text-right">{totals.monthlyProduction.toLocaleString()}</TableCell>
                <TableCell className="text-right">{totals.efficiency.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{totals.co2Saved.toFixed(1)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedMetrics;