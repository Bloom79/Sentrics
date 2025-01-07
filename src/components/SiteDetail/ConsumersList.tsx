import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory, Users, Building2, Power, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Consumer } from "@/types/site";

interface ConsumersListProps {
  consumers?: Consumer[];
}

const ConsumersList = ({ consumers }: ConsumersListProps) => {
  const navigate = useNavigate();
  
  if (!consumers?.length) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case "residential":
        return <Users className="h-5 w-5 text-blue-500" />;
      case "industrial":
        return <Factory className="h-5 w-5 text-orange-500" />;
      case "commercial":
        return <Building2 className="h-5 w-5 text-green-500" />;
      default:
        return <Factory className="h-5 w-5 text-gray-500" />;
    }
  };

  const handleConsumerClick = (consumerId: string) => {
    navigate(`/consumers/${consumerId}`);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {consumers.map((consumer) => (
        <Card 
          key={consumer.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleConsumerClick(consumer.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getIcon(consumer.type)}
                <CardTitle className="text-lg">{consumer.name}</CardTitle>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Current Consumption</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">{consumer.consumption} kW</span>
                  {consumer.consumption > 500 && (
                    <Power className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
              </div>
              
              {consumer.specs && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Peak Demand</span>
                    <span>{consumer.specs.peakDemand} kW</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Daily Usage</span>
                    <span>{consumer.specs.dailyUsage} kWh</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Power Factor</span>
                    <span>{consumer.specs.powerFactor}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Connection</span>
                    <span className="capitalize">{consumer.specs.connectionType || "N/A"}</span>
                  </div>
                </>
              )}
              
              <div className="flex items-center justify-between text-sm pt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  consumer.status === "active" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-gray-100 text-gray-700"
                }`}>
                  {consumer.status.toUpperCase()}
                </span>
                <span className="capitalize text-muted-foreground">{consumer.type}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConsumersList;