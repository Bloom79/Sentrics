import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function TransactionsPage() {
  // Fetch all transactions across communities
  const { data: transactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await api.get("/api/cer/transactions");
      return response.data;
    },
  });

  // Fetch sharing statistics
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["sharing-stats"],
    queryFn: async () => {
      const response = await api.get("/api/cer/sharing-stats");
      return response.data;
    },
  });

  if (loadingTransactions || loadingStats) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Energy Sharing Transactions</h1>
        <p className="text-muted-foreground">
          Monitor and manage energy sharing across all communities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Statistics Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Total Energy Shared</CardTitle>
            <CardDescription>
              Total amount of energy shared across all communities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.total_shared_energy.toFixed(2)} kWh
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Transactions</CardTitle>
            <CardDescription>
              Number of active sharing arrangements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.total_transactions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Transaction</CardTitle>
            <CardDescription>
              Average amount of energy per transaction
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats?.avg_transaction_amount.toFixed(2)} kWh
            </div>
          </CardContent>
        </Card>

        {/* Charts Row */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Top Energy Producers</CardTitle>
            <CardDescription>
              Producers sharing the most energy across all communities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.top_producers}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total_shared" fill="#3b82f6" name="Energy Shared (kWh)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Community Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Community Distribution</CardTitle>
            <CardDescription>
              Energy sharing distribution across communities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.community_distribution}
                    dataKey="total_energy"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {stats?.community_distribution.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              List of recent energy sharing transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Community</TableHead>
                  <TableHead>Producer</TableHead>
                  <TableHead>Consumer</TableHead>
                  <TableHead>Amount (kWh)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions?.map((transaction: any) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.timestamp), "PPp")}
                    </TableCell>
                    <TableCell>{transaction.community_name}</TableCell>
                    <TableCell>{transaction.producer_name}</TableCell>
                    <TableCell>{transaction.consumer_name}</TableCell>
                    <TableCell>{transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.status === "active"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 