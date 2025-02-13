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
      // First fetch the site data
      const { data: siteData, error: siteError } = await supabase
        .from("sites")
        .select("*")
        .eq("id", siteId)
        .maybeSingle();

      if (siteError) throw siteError;
      if (!siteData) throw new Error("Site not found");

      // Then fetch the plants data
      const { data: plantsData, error: plantsError } = await supabase
        .from("plants")
        .select("*")
        .eq("site_id", siteId);

      if (plantsError) throw plantsError;

      // Transform the data to match our Site type
      const transformedSite: Site = {
        id: siteData.id,
        name: siteData.name,
        location: siteData.location || "",
        type: (siteData.type as "industrial" | "commercial" | "residential") || "industrial",
        status: (siteData.status as "active" | "inactive" | "maintenance") || "active",
        capacity: siteData.capacity || 0,
        currentOutput: 0,
        efficiency: siteData.efficiency || 0,
        plants: plantsData || [],
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
        code: siteData.code,
        description: siteData.description,
        region: siteData.region,
        latitude: siteData.latitude,
        longitude: siteData.longitude,
        street_address: siteData.street_address,
        city: siteData.city,
        postal_code: siteData.postal_code,
        country: siteData.country,
        site_type: siteData.site_type,
        available_area: siteData.available_area,
        reserved_area: siteData.reserved_area,
        operational_status: siteData.operational_status,
        commissioning_date: siteData.commissioning_date,
        decommissioning_date: siteData.decommissioning_date,
        owner: siteData.owner,
        operator: siteData.operator,
        maintenance_provider: siteData.maintenance_provider,
        environmental_impact_rating: siteData.environmental_impact_rating,
        notes: siteData.notes,
        tags: siteData.tags || []
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
          <PlantsTab site={site} />
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