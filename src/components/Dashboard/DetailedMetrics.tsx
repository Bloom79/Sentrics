import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DetailedMetricsProps {
  selectedSiteId: string | null;
}

// Mock data - replace with actual data later
const mockSiteData = [
  {
    id: "1",
    name: "Milano Nord",
    dailyProduction: 2500,
    monthlyProduction: 75000,
    efficiency: 92,
    co2Saved: 45.2,
  },
  {
    id: "2",
    name: "Roma Est",
    dailyProduction: 2100,
    monthlyProduction: 63000,
    efficiency: 88,
    co2Saved: 38.5,
  },
  {
    id: "3",
    name: "Torino Sud",
    dailyProduction: 1800,
    monthlyProduction: 54000,
    efficiency: 90,
    co2Saved: 32.8,
  },
];

const DetailedMetrics: React.FC<DetailedMetricsProps> = ({ selectedSiteId }) => {
  const { t } = useLanguage();
  
  const filteredSites = selectedSiteId 
    ? mockSiteData.filter(site => site.id === selectedSiteId)
    : mockSiteData;

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
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-accent" />
          {selectedSiteId ? "Site Metrics" : "All Sites Metrics"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Site</TableHead>
              <TableHead className="text-right">Daily Production (kWh)</TableHead>
              <TableHead className="text-right">Monthly Production (kWh)</TableHead>
              <TableHead className="text-right">Efficiency (%)</TableHead>
              <TableHead className="text-right">CO2 Saved (tons)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSites.map((site) => (
              <TableRow key={site.id}>
                <TableCell className="font-medium">{site.name}</TableCell>
                <TableCell className="text-right">{site.dailyProduction.toLocaleString()}</TableCell>
                <TableCell className="text-right">{site.monthlyProduction.toLocaleString()}</TableCell>
                <TableCell className="text-right">{site.efficiency}%</TableCell>
                <TableCell className="text-right">{site.co2Saved.toFixed(1)}</TableCell>
              </TableRow>
            ))}
            {filteredSites.length > 1 && (
              <TableRow className="font-semibold">
                <TableCell>Total / Average</TableCell>
                <TableCell className="text-right">{totals.dailyProduction.toLocaleString()}</TableCell>
                <TableCell className="text-right">{totals.monthlyProduction.toLocaleString()}</TableCell>
                <TableCell className="text-right">{totals.efficiency.toFixed(1)}%</TableCell>
                <TableCell className="text-right">{totals.co2Saved.toFixed(1)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DetailedMetrics;