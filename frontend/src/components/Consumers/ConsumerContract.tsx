import React from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Contract } from "@/types/contracts";
import { format } from "date-fns";
import { AddContractDialog } from "./AddContractDialog";

const ConsumerContract = () => {
  const { consumerId } = useParams();

  // Validate if consumerId is in UUID format
  const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(consumerId || '');

  const { data: contract, isLoading, error } = useQuery({
    queryKey: ['contract', consumerId],
    queryFn: async () => {
      if (!isValidUUID) {
        throw new Error('Invalid consumer ID format');
      }

      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('consumer_id', consumerId)
        .maybeSingle();

      if (error) throw error;
      return data as Contract | null;
    },
    enabled: isValidUUID, // Only run query if UUID is valid
  });

  if (!isValidUUID) {
    return <div>Invalid consumer ID format</div>;
  }

  if (isLoading) {
    return <div>Loading contract details...</div>;
  }

  if (error) {
    return <div>Error loading contract: {error.message}</div>;
  }

  const renderContractDetails = () => {
    if (!contract) return null;

    const rateDetails = () => {
      switch (contract.type) {
        case 'fixed_rate':
          return <dd className="text-sm">${contract.rate} per kWh</dd>;
        case 'peak_off_peak':
          return (
            <>
              <dd className="text-sm">Peak: ${contract.peak_rate} per kWh</dd>
              <dd className="text-sm">Off-Peak: ${contract.off_peak_rate} per kWh</dd>
            </>
          );
        case 'variable_rate':
          return (
            <>
              <dd className="text-sm">Base Rate: ${contract.variable_rate_base} per kWh</dd>
              <dd className="text-sm">Adjustment: {contract.variable_rate_adjustment_formula}</dd>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <dl className="space-y-4">
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Contract Type</dt>
          <dd className="text-sm capitalize">{contract.type.replace('_', ' ')}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Contract Period</dt>
          <dd className="text-sm">
            {format(new Date(contract.start_date), 'PP')} - {format(new Date(contract.end_date), 'PP')}
          </dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Rate</dt>
          {rateDetails()}
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Minimum Purchase</dt>
          <dd className="text-sm">{contract.minimum_purchase} kWh</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Billing Cycle</dt>
          <dd className="text-sm capitalize">{contract.billing_cycle}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-muted-foreground">Payment Terms</dt>
          <dd className="text-sm">{contract.payment_terms} days</dd>
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
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Contract Information</CardTitle>
        {!contract && <AddContractDialog />}
      </CardHeader>
      <CardContent>
        {contract ? (
          renderContractDetails()
        ) : (
          <p className="text-muted-foreground">No contract found for this consumer.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsumerContract;