import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { DetailedMetrics } from "@/components/Dashboard/DetailedMetrics";
import SiteMonitoring from "@/components/Dashboard/SiteMonitoring";
import { ProductionOverview } from "@/components/Dashboard/Overview/ProductionOverview";
import { ForecastOverview } from "@/components/Dashboard/Overview/ForecastOverview";
import { SolarProduction, WindProduction } from "@/components/Dashboard/Overview/SourceProduction";
import StorageStatus from "@/components/Dashboard/Overview/StorageStatus";
import GridStatus from "@/components/Dashboard/GridStatus";
import EnergyFlow from "@/components/Dashboard/EnergyFlow";

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your energy production and consumption
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link to="/plants">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plants</CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Active production plants
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/consumers">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Consumers</CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">284</div>
              <p className="text-xs text-muted-foreground">
                Active consumers
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/grid-analysis">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Energy Grid</CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">98.2%</div>
              <p className="text-xs text-muted-foreground">
                Grid stability
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/storage">
          <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage</CardTitle>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">76%</div>
              <p className="text-xs text-muted-foreground">
                Storage capacity
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <ProductionOverview />
        <ForecastOverview />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SolarProduction />
        <WindProduction />
        <StorageStatus />
        <GridStatus />
      </div>

      <EnergyFlow />
      <DetailedMetrics />
      <SiteMonitoring onSiteSelect={() => {}} />
    </div>
  );
};

export default Index;