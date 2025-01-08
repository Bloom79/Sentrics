import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowUpDown, CheckCircle, AlertCircle, XCircle, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Site {
  id: string;
  name: string;
  status: string;
  lastUpdate: string;
  dailyProduction: number;
  monthlyProduction: number;
  efficiency: number;
  co2Saved: number;
}

interface SitesListProps {
  sites: Site[];
  selectedTimeRange: string;
}

const SitesList = ({ sites, selectedTimeRange }: SitesListProps) => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<{ key: keyof Site; direction: 'asc' | 'desc' } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSort = (key: keyof Site) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

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

  const filteredAndSortedSites = useMemo(() => {
    let filtered = [...sites];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(site => site.status === statusFilter);
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(site =>
        site.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [sites, sortConfig, statusFilter, searchTerm]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sites Overview</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{selectedTimeRange}</Badge>
            <Badge variant="outline">{`${filteredAndSortedSites.length} sites`}</Badge>
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
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('name')} className="flex items-center gap-1">
                    Site Name
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('dailyProduction')} className="flex items-center gap-1">
                    Daily Production
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('monthlyProduction')} className="flex items-center gap-1">
                    Monthly Production
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('efficiency')} className="flex items-center gap-1">
                    Efficiency
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" onClick={() => handleSort('co2Saved')} className="flex items-center gap-1">
                    CO2 Saved
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedSites.map((site) => (
                <TableRow
                  key={site.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/site/${site.id}`)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(site.status)}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{site.name}</TableCell>
                  <TableCell>{new Date(site.lastUpdate).toLocaleString()}</TableCell>
                  <TableCell>{site.dailyProduction.toLocaleString()} kWh</TableCell>
                  <TableCell>{site.monthlyProduction.toLocaleString()} kWh</TableCell>
                  <TableCell>{site.efficiency}%</TableCell>
                  <TableCell>{site.co2Saved.toFixed(1)} tons</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default SitesList;