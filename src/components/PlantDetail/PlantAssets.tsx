import React from "react";
import { Plant, AssetType } from "@/types/site";
import { AssetList } from "./Assets/AssetList";

interface PlantAssetsProps {
  plant: Plant;
}

const PlantAssets: React.FC<PlantAssetsProps> = ({ plant }) => {
  // Mock data - in a real app, this would come from the API
  const mockAssets: AssetType[] = [
    {
      id: "1",
      type: "panel",
      serialNumber: "SP001",
      model: "SunPower X22-360",
      manufacturer: "SunPower",
      installationDate: "2023-01-15",
      status: "operational",
      lastOutput: 350,
      efficiency: 95,
      location: "Array A1",
      ratedPower: 360
    },
    {
      id: "2",
      type: "inverter",
      serialNumber: "INV001",
      model: "SolarEdge SE10000H",
      manufacturer: "SolarEdge",
      installationDate: "2023-01-15",
      status: "operational",
      lastOutput: 9800,
      efficiency: 98,
      location: "Array A1",
      ratedPower: 10000
    },
    {
      id: "3",
      type: "turbine",
      serialNumber: "WT001",
      model: "Vestas V150",
      manufacturer: "Vestas",
      installationDate: "2023-01-15",
      status: "operational",
      location: "Tower 1",
      ratedCapacity: 4000,
      rotorDiameter: 150,
      hubHeight: 105,
      cutInSpeed: 3,
      cutOutSpeed: 25
    },
    {
      id: "4",
      type: "transformer",
      serialNumber: "TR001",
      model: "ABB PowerTrans",
      manufacturer: "ABB",
      installationDate: "2023-01-15",
      status: "operational",
      location: "Substation A",
      capacity: 2000,
      voltageIn: 400,
      voltageOut: 33000,
      efficiency: 98
    },
    {
      id: "5",
      type: "battery",
      serialNumber: "BAT001",
      model: "Tesla Megapack",
      manufacturer: "Tesla",
      installationDate: "2023-01-15",
      status: "operational",
      location: "Storage Area 1",
      technology: "lithium-ion",
      ratedPower: 1000,
      energyCapacity: 4000,
      stateOfCharge: 85,
      roundTripEfficiency: 92
    }
  ];

  // Filter assets based on plant type
  const filteredAssets = mockAssets.filter(asset => {
    if (plant.type === "solar") {
      return ["panel", "inverter", "transformer", "battery"].includes(asset.type);
    } else if (plant.type === "wind") {
      return ["turbine", "transformer", "battery"].includes(asset.type);
    }
    // For hybrid plants, show all assets
    return true;
  });

  return (
    <div className="space-y-6">
      <AssetList plant={plant} assets={filteredAssets} />
    </div>
  );
};

export default PlantAssets;