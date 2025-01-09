import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LoadingState = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div>Loading...</div>
      </CardContent>
    </Card>
  );
};