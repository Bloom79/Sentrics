import React from "react";
import { Plant } from "@/types/site";
import PlantOverview from "./PlantOverview";

interface OverviewProps {
  plant: Plant;
}

export function Overview({ plant }: OverviewProps) {
  return <PlantOverview plant={plant} />;
}