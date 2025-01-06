import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface DetailedMetricsProps {
  selectedSiteId: string | null;
  onSiteSelect?: (siteId: string) => void;
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
  },
];

const DetailedMetrics: React.FC<DetailedMetricsProps> = ({ selectedSiteId, onSiteSelect }) => {
  const { t } = useLanguage();
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  
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
    const matchesStatus = statusFilter === "all" || site.status === statusFilter;
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
            Sites Overview & Metrics
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{`${filteredSites.length} sites`}</Badge>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1">
            <Input
              placeholder="Search sites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Site Name</TableHead>
                <TableHead>Last Update</TableHead>
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
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{new Date(site.lastUpdate).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{site.dailyProduction.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{site.monthlyProduction.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{site.efficiency}%</TableCell>
                  <TableCell className="text-right">{site.co2Saved.toFixed(1)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="font-semibold">
                <TableCell>Total / Average</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
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