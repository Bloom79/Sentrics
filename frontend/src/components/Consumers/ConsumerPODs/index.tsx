import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Unlink } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AddPODDialog } from "./AddPODDialog";
import { EditPODDialog } from "./EditPODDialog";
import { useToast } from "@/components/ui/use-toast";
import { POD } from "@/types/pod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ConsumerPODs = () => {
  const { consumerId } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pods, isLoading } = useQuery({
    queryKey: ['pods', consumerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pods')
        .select('*')
        .eq('consumer_id', consumerId);
      
      if (error) throw error;
      return data as POD[];
    }
  });

  const handleUnlinkPOD = async (podId: string) => {
    try {
      const { error } = await supabase
        .from('pods')
        .delete()
        .eq('id', podId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "POD has been unlinked successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['pods', consumerId] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unlink POD",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading PODs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Points of Delivery (PODs)</h3>
        <AddPODDialog consumerId={consumerId!} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {pods?.map((pod) => (
          <Card key={pod.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {pod.name}
              </CardTitle>
              <div className="flex space-x-2">
                <EditPODDialog pod={pod} consumerId={consumerId!} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Unlink className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently unlink this POD.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleUnlinkPOD(pod.id)}>
                        Unlink POD
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">POD ID</dt>
                  <dd className="text-sm">{pod.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Connection Type</dt>
                  <dd className="text-sm capitalize">{pod.connection_type.replace('-', ' ')}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Status</dt>
                  <dd className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                    pod.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {pod.status}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Address</dt>
                  <dd className="text-sm">
                    {[pod.street_address, pod.city, pod.state, pod.postal_code, pod.country]
                      .filter(Boolean)
                      .join(', ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Installed Capacity</dt>
                  <dd className="text-sm">{pod.installed_capacity} kW</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Current Consumption</dt>
                  <dd className="text-sm">{pod.current_consumption} kW</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Peak Demand</dt>
                  <dd className="text-sm">{pod.peak_demand} kW</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Usage Statistics</dt>
                  <dd className="text-sm">
                    Daily: {pod.daily_usage} kWh<br />
                    Monthly: {pod.monthly_usage} kWh<br />
                    Annual: {pod.annual_usage} kWh
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Meter Information</dt>
                  <dd className="text-sm">
                    {pod.meter_id && `Meter ID: ${pod.meter_id}`}<br />
                    {pod.metering_type && `Type: ${pod.metering_type}`}<br />
                    {pod.last_meter_reading && `Last Reading: ${pod.last_meter_reading} kWh`}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Maintenance</dt>
                  <dd className="text-sm">
                    Status: {pod.maintenance_status}<br />
                    {pod.last_maintenance && `Last Date: ${new Date(pod.last_maintenance).toLocaleDateString()}`}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Billing</dt>
                  <dd className="text-sm">
                    Status: {pod.billing_status}<br />
                    Cycle: {pod.billing_cycle}<br />
                    {pod.outstanding_charges > 0 && `Outstanding: €${pod.outstanding_charges}`}
                  </dd>
                </div>
                {pod.tariff_plan && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Tariff Plan</dt>
                    <dd className="text-sm">{pod.tariff_plan}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConsumerPODs;