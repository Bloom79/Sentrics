import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, Factory, Power, TrendingUp, AlertTriangle } from "lucide-react";

const ConsumerOverview = () => {
  const consumerStats = [
    {
      title: "Total Consumers",
      value: "234",
      icon: Users,
      change: "+12%",
      description: "Active energy consumers",
    },
    {
      title: "Industrial",
      value: "45",
      icon: Factory,
      change: "+4%",
      description: "Industrial consumers",
    },
    {
      title: "Commercial",
      value: "189",
      icon: Building2,
      change: "+8%",
      description: "Commercial consumers",
    },
    {
      title: "Current Demand",
      value: "1.2 GW",
      icon: Power,
      change: "+15%",
      description: "Total power demand",
    },
    {
      title: "Monthly Usage",
      value: "28.5 GWh",
      icon: TrendingUp,
      change: "+6%",
      description: "Total energy consumption",
    },
    {
      title: "Alerts",
      value: "3",
      icon: AlertTriangle,
      change: "-2",
      description: "Active consumer alerts",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {consumerStats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
            <div className={`text-sm ${
              stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.change} from last month
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConsumerOverview;