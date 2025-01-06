import React from "react";
import { Plant, SolarAsset, WindAsset } from "@/types/site";
import { AssetList } from "./Assets/AssetList";

interface PlantAssetsProps {
  plant: Plant;
}

const PlantAssets: React.FC<PlantAssetsProps> = ({ plant }) => {
  // Mock data - in a real app, this would come from the API
  const mockSolarAssets: SolarAsset[] = [
    {
      id: "1",
      type: "panel",
      serialNumber: "SP001",
      model: "SunPower X22-360",
      installationDate: "2023-01-15",
      status: "operational",
      lastOutput: 350,
      efficiency: 95,
      location: "Array A1"
    },
    {
      id: "2",
      type: "inverter",
      serialNumber: "INV001",
      model: "SolarEdge SE10000H",
      installationDate: "2023-01-15",
      status: "operational",
      lastOutput: 9800,
      efficiency: 98,
      location: "Array A1"
    }
  ];

  const mockWindAssets: WindAsset[] = [
    {
      id: "1",
      type: "turbine",
      serialNumber: "WT001",
      model: "Vestas V150",
      manufacturer: "Vestas",
      ratedCapacity: 4000,
      status: "operational",
      currentOutput: 3200,
      windSpeed: 12.5,
      nacelleDirection: 245,
      ratedWindSpeed: 12,
      cutInSpeed: 3,
      cutOutSpeed: 25,
      lastMaintenanceDate: "2024-01-01",
      pitchControl: "Active",
      location: "Tower 1"
    }
  ];

  const assets = plant.type === "solar" ? mockSolarAssets : mockWindAssets;

  return (
    <div className="space-y-6">
      <AssetList plant={plant} assets={assets} />
    </div>
  );
};

export default PlantAssets;