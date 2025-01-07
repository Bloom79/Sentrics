import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GridCongestionMap from "@/components/GridAnalysis/GridCongestionMap";
import GridMetrics from "@/components/GridAnalysis/GridMetrics";
import CongestionTrends from "@/components/GridAnalysis/CongestionTrends";

const GridAnalysis = () => {
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Grid Analysis</h1>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GridMetrics />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Grid Congestion Map</CardTitle>
            </CardHeader>
            <CardContent>
              <GridCongestionMap />
            </CardContent>
          </Card>

          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Congestion Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <CongestionTrends />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GridAnalysis;