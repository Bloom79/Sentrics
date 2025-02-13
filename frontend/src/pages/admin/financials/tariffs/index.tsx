import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";

export default function TariffManagementPage() {
  const { data: tariffs, isLoading } = useQuery({
    queryKey: ["tariffs"],
    queryFn: async () => {
      const response = await fetch("/api/billing/tariffs");
      if (!response.ok) throw new Error("Failed to fetch tariffs");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tariff Management</h1>
          <p className="text-muted-foreground">
            Manage regional tariffs and incentive rates
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Tariff
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Regional Tariffs</CardTitle>
          <CardDescription>
            View and manage tariff rates for different regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={tariffs || []} />
        </CardContent>
      </Card>
    </div>
  );
} 