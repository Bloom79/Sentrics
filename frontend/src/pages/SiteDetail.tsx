import React from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Factory, Users, Battery, Plug } from "lucide-react";
import SiteHeader from "@/components/SiteDetail/SiteHeader";
import { PlantsTab } from "@/components/SiteDetail/PlantsTab/PlantsTab";
import ConsumersList from "@/components/SiteDetail/ConsumersList";
import EnergyFlowVisualization from "@/components/SiteAnalysis/EnergyFlowVisualization";
import StorageTab from "@/components/SiteDetail/StorageTab";
import { InfoTab } from "@/components/SiteDetail/InfoTab";
import { GridTab } from "@/components/SiteDetail/GridTab";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Site } from "@/types/site";

const SiteDetail = () => {
  const { siteId } = useParams();

  const { data: site, isLoading } = useQuery({
    queryKey: ["site", siteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("id", siteId)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        throw new Error("Site not found");
      }

      // Transform the data to match our Site type
      const transformedSite: Site = {
        id: data.id,
        name: data.name,
        location: data.location || "",
        type: (data.type as "industrial" | "commercial" | "residential") || "industrial",
        status: (data.status as "active" | "inactive" | "maintenance") || "active",
        capacity: data.capacity || 0,
        currentOutput: 0,
        efficiency: data.efficiency || 0,
        plants: [],
        storage: [],
        energySources: [],
        gridConnection: {
          status: "connected",
          capacity: 1000,
          currentLoad: 800,
          frequency: 50,
          voltage: 230,
          congestion: 0.8
        },
        // Additional fields from database
        code: data.code,
        description: data.description,
        region: data.region,
        latitude: data.latitude,
        longitude: data.longitude,
        street_address: data.street_address,
        city: data.city,
        postal_code: data.postal_code,
        country: data.country,
        site_type: data.site_type,
        available_area: data.available_area,
        reserved_area: data.reserved_area,
        operational_status: data.operational_status,
        commissioning_date: data.commissioning_date,
        decommissioning_date: data.decommissioning_date,
        owner: data.owner,
        operator: data.operator,
        maintenance_provider: data.maintenance_provider,
        environmental_impact_rating: data.environmental_impact_rating,
        notes: data.notes,
        tags: data.tags || []
      };

      return transformedSite;
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <SiteHeader site={site} />
      
      <Tabs defaultValue="flow" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="flow">Energy Flow</TabsTrigger>
          <TabsTrigger value="info" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="plants" className="flex items-center gap-2">
            <Factory className="h-4 w-4" />
            Plants
          </TabsTrigger>
          <TabsTrigger value="consumers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Consumers
          </TabsTrigger>
          <TabsTrigger value="storage" className="flex items-center gap-2">
            <Battery className="h-4 w-4" />
            Storage
          </TabsTrigger>
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Plug className="h-4 w-4" />
            Grid
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flow">
          <EnergyFlowVisualization site={site} />
        </TabsContent>

        <TabsContent value="info">
          <InfoTab site={site} />
        </TabsContent>

        <TabsContent value="plants">
          <PlantsTab plants={site.plants} />
        </TabsContent>

        <TabsContent value="consumers">
          <ConsumersList consumers={[]} />
        </TabsContent>

        <TabsContent value="storage">
          <StorageTab site={site} />
        </TabsContent>

        <TabsContent value="grid">
          <GridTab site={site} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteDetail;