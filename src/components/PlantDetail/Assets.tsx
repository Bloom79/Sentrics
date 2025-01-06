import React from "react";
import { Plant } from "@/types/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AssetsProps {
  plant: Plant;
}

export function Assets({ plant }: AssetsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plant Assets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <p>Asset list will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
}