import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plant, SolarAsset, WindAsset } from "@/types/site";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SolarPanel, Wind, AlertCircle, Server, Gauge } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-500";
      case "faulty":
        return "bg-red-500";
      case "maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderSolarAssets = (assets: SolarAsset[]) => {
    const panels = assets.filter(a => a.type === "panel");
    const inverters = assets.filter(a => a.type === "inverter");

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SolarPanel className="h-5 w-5" />
              Solar Panels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {panels.map((panel) => (
                <Collapsible key={panel.id}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(panel.status)}`} />
                      <span>{panel.serialNumber}</span>
                    </div>
                    <Badge>{panel.status}</Badge>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 py-2">
                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>Model: {panel.model}</div>
                        <div>Installation: {new Date(panel.installationDate).toLocaleDateString()}</div>
                        <div>Efficiency: {panel.efficiency}%</div>
                        <div>Last Output: {panel.lastOutput}W</div>
                        <div>Location: {panel.location}</div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Inverters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inverters.map((inverter) => (
                <Collapsible key={inverter.id}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(inverter.status)}`} />
                      <span>{inverter.serialNumber}</span>
                    </div>
                    <Badge>{inverter.status}</Badge>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 py-2">
                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 gap-4">
                        <div>Model: {inverter.model}</div>
                        <div>Installation: {new Date(inverter.installationDate).toLocaleDateString()}</div>
                        <div>Efficiency: {inverter.efficiency}%</div>
                        <div>Last Output: {inverter.lastOutput}W</div>
                        <div>Location: {inverter.location}</div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderWindAssets = (assets: WindAsset[]) => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wind className="h-5 w-5" />
              Wind Turbines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assets.map((turbine) => (
                <Collapsible key={turbine.id}>
                  <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border p-4 hover:bg-muted">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(turbine.status)}`} />
                      <span>{turbine.serialNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      <span>{turbine.currentOutput}kW</span>
                      <Badge>{turbine.status}</Badge>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="px-4 py-2">
                    <div className="grid gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>Model: {turbine.model}</div>
                        <div>Manufacturer: {turbine.manufacturer}</div>
                        <div>Rated Capacity: {turbine.ratedCapacity}kW</div>
                        <div>Current Output: {turbine.currentOutput}kW</div>
                        <div>Wind Speed: {turbine.windSpeed} m/s</div>
                        <div>Nacelle Direction: {turbine.nacelleDirection}°</div>
                        <div>Rated Wind Speed: {turbine.ratedWindSpeed} m/s</div>
                        <div>Cut-in Speed: {turbine.cutInSpeed} m/s</div>
                        <div>Cut-out Speed: {turbine.cutOutSpeed} m/s</div>
                        <div>Last Maintenance: {turbine.lastMaintenanceDate}</div>
                        <div>Pitch Control: {turbine.pitchControl}</div>
                        <div>Location: {turbine.location}</div>
                      </div>
                      {turbine.status === "faulty" && (
                        <div className="flex items-center gap-2 rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-200">
                          <AlertCircle className="h-5 w-5" />
                          <span>Maintenance required - Check turbine status</span>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {plant.type === "solar" ? renderSolarAssets(assets as SolarAsset[]) : renderWindAssets(assets as WindAsset[])}
    </div>
  );
};

export default PlantAssets;