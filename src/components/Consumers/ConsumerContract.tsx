import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Contract } from "@/types/contracts";
import { format } from "date-fns";

const ConsumerContract = () => {
  const { consumerId } = useParams();

  const { data: contract, isLoading } = useQuery({
    queryKey: ['contract', consumerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('consumer_id', consumerId)
        .maybeSingle();

      if (error) throw error;
      return data as Contract | null;
    },
  });

  if (isLoading) {
    return <div>Loading contract details...</div>;
  }

  if (!contract) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Contract Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No contract found for this consumer.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-4">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Contract Period</dt>
            <dd className="text-sm">
              {format(new Date(contract.start_date), 'PP')} - {format(new Date(contract.end_date), 'PP')}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Rate</dt>
            <dd className="text-sm">${contract.rate} per kWh</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Minimum Purchase</dt>
            <dd className="text-sm">{contract.minimum_purchase} kWh</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
            <dd className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
              contract.status === 'active' 
                ? 'bg-green-100 text-green-800'
                : contract.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {contract.status}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

export default ConsumerContract;