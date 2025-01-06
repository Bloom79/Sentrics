import React from "react";
import { Plant } from "@/types/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PerformanceProps {
  plant: Plant;
}

export function Performance({ plant }: PerformanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <p>Performance data will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
}