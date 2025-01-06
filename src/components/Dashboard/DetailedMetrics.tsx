import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, ChevronDown, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { StatusIcon } from "./DetailedMetrics/StatusIcon";
import { EnergySourceInfo } from "./DetailedMetrics/EnergySourceInfo";
import { StorageInfo } from "./DetailedMetrics/StorageInfo";
import { GridConnectionInfo } from "./DetailedMetrics/GridConnectionInfo";

interface Plant {
  id: string;
  name: string;
  type: "solar" | "wind";
  capacity: number;
  currentOutput: number;
  efficiency: number;
  status: string;
}

interface Site {
  id: string;
  name: string;
  status: string;
  lastUpdate: string;
  dailyProduction: number;
  monthlyProduction: number;
  efficiency: number;
  co2Saved: number;
  plants: Plant[];
  energySources: {
    type: string;
    output: number;
    capacity: number;
  }[];
  storage: {
    capacity: number;
    currentCharge: number;
  };
  gridConnection: {
    status: string;
    frequency: number;
    voltage: number;
    congestion: string;
  };
}

interface DetailedMetricsProps {
  selectedSiteId: string | null;
  onSiteSelect?: (siteId: string) => void;
  searchTerm: string;
  selectedStatus: string;
  selectedTimeRange: string;
}

// Mock data with plants
const mockSiteData: Site[] = [
  {
    id: "1",
    name: "Milano Nord",
    status: "online",
    lastUpdate: "2024-02-20T11:30:00",
    dailyProduction: 2500,
    monthlyProduction: 75000,
    efficiency: 92,
    co2Saved: 45.2,
    plants: [
      {
        id: "p1",
        name: "Solar Farm Alpha",
        type: "solar",
        capacity: 2000,
        currentOutput: 1500,
        efficiency: 90,
        status: "online"
      },
      {
        id: "p2",
        name: "Wind Farm Beta",
        type: "wind",
        capacity: 1500,
        currentOutput: 1000,
        efficiency: 94,
        status: "online"
      }
    ],
    energySources: [
      { type: "solar", output: 1500, capacity: 2000 },
      { type: "wind", output: 1000, capacity: 1500 }
    ],
    storage: { capacity: 5000, currentCharge: 4200 },
    gridConnection: { status: "connected", frequency: 50.02, voltage: 230.5, congestion: "Low" }
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
    gridConnection: { status: "connected", frequency: 49.98, voltage: 229.8, congestion: "Medium" }
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
    gridConnection: { status: "connected", frequency: 50.00, voltage: 230.0, congestion: "Low" }
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
  const [expandedSites, setExpandedSites] = React.useState<string[]>([]);

  const toggleSiteExpansion = (siteId: string) => {
    setExpandedSites(prev => 
      prev.includes(siteId) 
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
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
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Sites & Plants Overview
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
                <TableHead className="w-8"></TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Site/Plant Name</TableHead>
                <TableHead>Energy Sources</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Grid Connection</TableHead>
                <TableHead className="text-right">Daily Production (kWh)</TableHead>
                <TableHead className="text-right">Monthly Production (kWh)</TableHead>
                <TableHead className="text-right">Efficiency (%)</TableHead>
                <TableHead className="text-right">CO2 Saved (tons)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSites.map((site) => (
                <React.Fragment key={site.id}>
                  <TableRow
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleSiteExpansion(site.id)}
                  >
                    <TableCell>
                      {expandedSites.includes(site.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={site.status} />
                        <span className="text-sm font-medium">
                          {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{site.name}</TableCell>
                    <TableCell>
                      <EnergySourceInfo sources={site.energySources} />
                    </TableCell>
                    <TableCell>
                      <StorageInfo storage={site.storage} />
                    </TableCell>
                    <TableCell>
                      <GridConnectionInfo connection={site.gridConnection} />
                    </TableCell>
                    <TableCell className="text-right">{site.dailyProduction.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{site.monthlyProduction.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{site.efficiency}%</TableCell>
                    <TableCell className="text-right">{site.co2Saved.toFixed(1)}</TableCell>
                  </TableRow>
                  {expandedSites.includes(site.id) && site.plants.map(plant => (
                    <TableRow key={plant.id} className="bg-muted/30">
                      <TableCell></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon status={plant.status} />
                          <span className="text-sm font-medium">
                            {plant.status.charAt(0).toUpperCase() + plant.status.slice(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="pl-8 font-medium text-sm text-muted-foreground">
                        {plant.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{plant.type}</Badge>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell className="text-right">{plant.currentOutput.toLocaleString()}</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">{plant.efficiency}%</TableCell>
                      <TableCell className="text-right">-</TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
              <TableRow className="font-semibold bg-muted/50">
                <TableCell colSpan={6}>Total / Average</TableCell>
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