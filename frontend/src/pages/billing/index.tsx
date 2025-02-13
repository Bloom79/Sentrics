import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PaymentDialog } from "@/components/billing/PaymentDialog";

export default function BillingPage() {
  // Fetch billing statements
  const { data: statements, isLoading: loadingStatements } = useQuery({
    queryKey: ["billing-statements"],
    queryFn: async () => {
      const response = await api.get("/api/billing/statements");
      return response.data;
    },
  });

  // Fetch payments
  const { data: payments, isLoading: loadingPayments } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const response = await api.get("/api/billing/payments");
      return response.data;
    },
  });

  // Fetch tariffs
  const { data: tariffs, isLoading: loadingTariffs } = useQuery({
    queryKey: ["tariffs"],
    queryFn: async () => {
      const response = await api.get("/api/billing/tariffs");
      return response.data;
    },
  });

  if (loadingStatements || loadingPayments || loadingTariffs) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Billing & Payments</h1>
        <p className="text-muted-foreground">
          Manage billing statements, payments, and view tariff rates
        </p>
      </div>

      <Tabs defaultValue="statements">
        <TabsList>
          <TabsTrigger value="statements">Statements</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="tariffs">Tariffs</TabsTrigger>
        </TabsList>

        {/* Statements Tab */}
        <TabsContent value="statements">
          <Card>
            <CardHeader>
              <CardTitle>Billing Statements</CardTitle>
              <CardDescription>
                View and manage your monthly billing statements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Energy Shared</TableHead>
                    <TableHead>Total Incentive</TableHead>
                    <TableHead>Net Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statements?.map((statement: any) => (
                    <TableRow key={statement.id}>
                      <TableCell>{statement.period}</TableCell>
                      <TableCell>{statement.energy_shared.toFixed(2)} kWh</TableCell>
                      <TableCell>€{statement.total_incentive.toFixed(2)}</TableCell>
                      <TableCell>€{statement.net_payment.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            statement.status === "paid"
                              ? "success"
                              : statement.status === "pending"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {statement.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {statement.status === "pending" && (
                          <PaymentDialog statement={statement} />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View your payment history and transaction details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments?.map((payment: any) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {format(new Date(payment.created_at), "PPp")}
                      </TableCell>
                      <TableCell>€{payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.payment_method}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "success"
                              : payment.status === "pending"
                              ? "warning"
                              : "destructive"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.transaction_id}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tariffs Tab */}
        <TabsContent value="tariffs">
          <Card>
            <CardHeader>
              <CardTitle>Current Tariff Rates</CardTitle>
              <CardDescription>
                View current tariff rates and incentives for your region
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Region</TableHead>
                    <TableHead>Base Rate</TableHead>
                    <TableHead>Regional Bonus</TableHead>
                    <TableHead>Capacity Bonus</TableHead>
                    <TableHead>Social Bonus</TableHead>
                    <TableHead>Valid From</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tariffs?.map((tariff: any) => (
                    <TableRow key={tariff.id}>
                      <TableCell>{tariff.region}</TableCell>
                      <TableCell>€{tariff.base_rate.toFixed(2)}/kWh</TableCell>
                      <TableCell>{(tariff.regional_bonus * 100).toFixed(0)}%</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div>{"<10kW: " + (tariff.capacity_bonus_small * 100).toFixed(0)}%</div>
                          <div>{"10-50kW: " + (tariff.capacity_bonus_medium * 100).toFixed(0)}%</div>
                          <div>{">50kW: " + (tariff.capacity_bonus_large * 100).toFixed(0)}%</div>
                        </div>
                      </TableCell>
                      <TableCell>{(tariff.social_bonus * 100).toFixed(0)}%</TableCell>
                      <TableCell>
                        {format(new Date(tariff.valid_from), "PP")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 