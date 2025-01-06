import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Factory } from "lucide-react";

interface Consumer {
  id: string;
  name: string;
  consumption: number;
  type: string;
}

interface ConsumersListProps {
  consumers?: Consumer[];
}

const ConsumersList = ({ consumers }: ConsumersListProps) => {
  if (!consumers?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Local Consumers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {consumers.map((consumer) => (
            <div key={consumer.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Factory className="h-4 w-4 text-muted-foreground" />
                <span>{consumer.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {consumer.consumption} kW
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsumersList;