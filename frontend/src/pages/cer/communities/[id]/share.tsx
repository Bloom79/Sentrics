import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
} from "recharts";

// Form schema for energy sharing
const shareFormSchema = z.object({
  producer_id: z.number(),
  asset_id: z.number(),
  amount: z.number().positive(),
  start_time: z.string(),
  end_time: z.string(),
  sharing_type: z.enum(["direct", "community"]),
});

type ShareFormValues = z.infer<typeof shareFormSchema>;

export default function EnergySharing() {
  const { id: communityId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available producers
  const { data: producers, isLoading: loadingProducers } = useQuery({
    queryKey: ["available-producers", communityId],
    queryFn: async () => {
      const response = await api.get(
        `/api/cer/communities/${communityId}/available-producers`
      );
      return response.data;
    },
  });

  // Fetch sharing statistics
  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ["sharing-stats", communityId],
    queryFn: async () => {
      const response = await api.get(
        `/api/cer/communities/${communityId}/sharing-stats`
      );
      return response.data;
    },
  });

  const form = useForm<ShareFormValues>({
    resolver: zodResolver(shareFormSchema),
    defaultValues: {
      sharing_type: "direct",
    },
  });

  const createShare = useMutation({
    mutationFn: async (data: ShareFormValues) => {
      const response = await api.post(
        `/api/cer/communities/${communityId}/share`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Energy sharing request created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["sharing-stats", communityId] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create share request",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ShareFormValues) => {
    createShare.mutate(data);
  };

  if (loadingProducers || loadingStats) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Statistics Cards */}
        <Card>
          <CardHeader>
            <CardTitle>Total Energy Shared</CardTitle>
            <CardDescription>
              Total amount of energy shared in the community
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

        {/* Top Producers Chart */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Top Energy Producers</CardTitle>
            <CardDescription>
              Producers sharing the most energy in the community
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

        {/* Energy Sharing Form */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Create Energy Share</CardTitle>
            <CardDescription>
              Set up a new energy sharing arrangement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="producer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Producer</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a producer" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {producers?.map((producer: any) => (
                            <SelectItem
                              key={producer.producer_id}
                              value={producer.producer_id.toString()}
                            >
                              {producer.producer_name} ({producer.available_capacity.toFixed(2)} kWh available)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="asset_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Asset</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an asset" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {producers
                            ?.filter(
                              (p: any) =>
                                p.producer_id === form.getValues("producer_id")
                            )
                            .map((producer: any) => (
                              <SelectItem
                                key={producer.asset_id}
                                value={producer.asset_id.toString()}
                              >
                                {producer.asset_type} - {producer.capacity.toFixed(2)} kW
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (kWh)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sharing_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sharing Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sharing type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="direct">Direct Sharing</SelectItem>
                          <SelectItem value="community">Community Sharing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Direct sharing is between specific members, while community sharing
                        distributes energy to the entire community.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={createShare.isPending}
                >
                  {createShare.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Share...
                    </>
                  ) : (
                    "Create Share"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 