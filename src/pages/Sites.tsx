import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Factory, Power, Battery, Users } from "lucide-react";

const Sites = () => {
  const navigate = useNavigate();

  const sites = [
    {
      id: "1",
      name: "Milano Nord",
      status: "online",
      plants: 2,
      consumers: 2,
      totalCapacity: 150,
      storageUnits: 1,
      efficiency: 92,
    },
    {
      id: "2",
      name: "Roma Sud",
      status: "online",
      plants: 2,
      consumers: 2,
      totalCapacity: 200,
      storageUnits: 2,
      efficiency: 88,
    },
    {
      id: "3",
      name: "Torino Est",
      status: "maintenance",
      plants: 2,
      consumers: 2,
      totalCapacity: 175,
      storageUnits: 1,
      efficiency: 85,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500/10 text-green-500";
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-500";
      default:
        return "bg-red-500/10 text-red-500";
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sites Overview</h1>
        <p className="text-muted-foreground">Manage and monitor all your energy sites</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sites.map((site) => (
          <Card 
            key={site.id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/site/${site.id}`)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{site.name}</CardTitle>
                <Badge className={getStatusColor(site.status)}>
                  {site.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Factory className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{site.plants} Plants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{site.consumers} Consumers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Power className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{site.totalCapacity} MW</span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{site.storageUnits} Storage</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Efficiency</span>
                  <span className="font-medium">{site.efficiency}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Sites;