import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaymentDialog } from "@/components/billing/PaymentDialog";
import { Loader2 } from "lucide-react";
import { BillingStatement, MemberBalance, statementColumns, memberBalanceColumns } from "./columns";

export default function CommunityBillingPage() {
  // Fetch billing statements
  const { data: statements, isLoading: statementsLoading } = useQuery<BillingStatement[]>({
    queryKey: ["billing-statements"],
    queryFn: async () => {
      const response = await fetch(`/api/billing/statements`);
      if (!response.ok) throw new Error("Failed to fetch statements");
      return response.json();
    },
  });

  // Fetch global billing stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["billing-stats"],
    queryFn: async () => {
      const response = await fetch(`/api/cer/sharing-stats`);
      if (!response.ok) throw new Error("Failed to fetch billing stats");
      return response.json();
    },
  });

  // Fetch member balances
  const { data: memberBalances, isLoading: balancesLoading } = useQuery<MemberBalance[]>({
    queryKey: ["member-balances"],
    queryFn: async () => {
      const response = await fetch(`/api/billing/member-balances`);
      if (!response.ok) throw new Error("Failed to fetch member balances");
      return response.json();
    },
  });

  if (statementsLoading || statsLoading || balancesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community Billing</h1>
        <p className="text-muted-foreground">
          Manage billing statements and payments for energy communities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Energy Shared</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_shared_energy?.toFixed(2) || 0} kWh</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incentives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{(stats?.total_incentives || 0).toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Community Fund</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{(stats?.community_fund || 0).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="statements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="statements">Billing Statements</TabsTrigger>
          <TabsTrigger value="members">Member Balances</TabsTrigger>
        </TabsList>
        <TabsContent value="statements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Statements</CardTitle>
              <CardDescription>
                View and manage billing statements for all community members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={statementColumns} data={statements || []} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Member Balances</CardTitle>
              <CardDescription>
                Current balance and payment status for each member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={memberBalanceColumns} data={memberBalances || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 