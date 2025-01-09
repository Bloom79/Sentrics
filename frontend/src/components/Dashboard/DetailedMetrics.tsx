import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "./DetailedMetrics/LoadingState";
import { SitesList } from "./DetailedMetrics/SitesList";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const DetailedMetrics = () => {
  const [expandedSites, setExpandedSites] = React.useState<string[]>([]);

  const { data: sites = [], isLoading } = useQuery({
    queryKey: ['sites'],
    queryFn: async () => {
      const { data: sitesData, error: sitesError } = await supabase
        .from('sites')
        .select(`
          id,
          name,
          type,
          status,
          capacity,
          efficiency,
          operational_status,
          storage_units (
            id,
            capacity,
            charge_level,
            status,
            efficiency,
            current_charge,
            power_rating,
            temperature,
            health
          ),
          plants (
            id,
            name,
            type,
            capacity,
            current_output,
            efficiency,
            status,
            location
          )
        `);

      if (sitesError) {
        console.error('Error fetching sites:', sitesError);
        throw sitesError;
      }

      return sitesData || [];
    }
  });

  const toggleSite = (siteId: string) => {
    setExpandedSites(prev =>
      prev.includes(siteId)
        ? prev.filter(id => id !== siteId)
        : [...prev, siteId]
    );
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Energy Sources</TableHead>
                <TableHead>Plants</TableHead>
                <TableHead className="text-right">Storage</TableHead>
                <TableHead className="text-right">Grid Import</TableHead>
                <TableHead className="text-right">Efficiency</TableHead>
                <TableHead className="text-right">CO2 Saved</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SitesList
                sites={sites}
                expandedSites={expandedSites}
                onToggleSite={toggleSite}
              />
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedMetrics;