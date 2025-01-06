import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Contract } from "@/types/contracts";
import { format } from "date-fns";

export const ConsumerContractsList = () => {
  const { data: contracts, isLoading } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contracts')
        .select('*, profiles:consumer_id(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (Contract & { profiles: { name: string } })[];
    },
  });

  if (isLoading) {
    return <div>Loading contracts...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Consumer Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contracts?.map((contract) => (
              <Card key={contract.id} className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Consumer</p>
                      <p className="text-sm font-medium">{contract.profiles.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contract Period</p>
                      <p className="text-sm font-medium">
                        {format(new Date(contract.start_date), 'PP')} - {format(new Date(contract.end_date), 'PP')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Rate</p>
                      <p className="text-sm font-medium">${contract.rate} per kWh</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        contract.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : contract.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {contract.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};