import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, BarChart2, Tool, Calendar } from "lucide-react";

const serviceLinks = [
  {
    icon: Calendar,
    title: "Scheduling",
    description: "Manage maintenance and optimization schedules",
  },
  {
    icon: BarChart2,
    title: "Analytics",
    description: "View detailed performance analytics",
  },
  {
    icon: Tool,
    title: "Diagnostics",
    description: "Run system diagnostics and tests",
  },
  {
    icon: Settings,
    title: "Integration Settings",
    description: "Configure third-party integrations",
  },
];

const SiteServiceLinks = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceLinks.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.title}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
              >
                <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">{service.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SiteServiceLinks;