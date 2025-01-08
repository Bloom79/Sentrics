import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

const ContractsAgreements = () => {
  // Mock data - in a real app, this would come from an API
  const contracts = [
    {
      id: "1",
      type: "Feed-in Tariff",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      capacity: 500,
      status: "active",
    },
    {
      id: "2",
      type: "Grid Connection",
      startDate: "2024-01-01",
      endDate: "2025-12-31",
      capacity: 1000,
      status: "active",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">Contracts & Agreements</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Contract
        </Button>
      </div>

      <div className="grid gap-4">
        {contracts.map((contract) => (
          <Card key={contract.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                {contract.type}
              </CardTitle>
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-2 sm:grid-cols-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Start Date</dt>
                  <dd className="text-sm font-medium">{contract.startDate}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">End Date</dt>
                  <dd className="text-sm font-medium">{contract.endDate}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Capacity</dt>
                  <dd className="text-sm font-medium">{contract.capacity} kW</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContractsAgreements;