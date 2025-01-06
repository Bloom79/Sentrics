import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ConsumerContract {
  id: string;
  consumerName: string;
  startDate: string;
  endDate: string;
  rate: number;
  minimumPurchase: number;
  status: "active" | "pending" | "expired";
}

// Mock data - in a real app, this would come from an API
const mockContracts: ConsumerContract[] = [
  {
    id: "1",
    consumerName: "Industrial Corp A",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    rate: 0.15,
    minimumPurchase: 5000,
    status: "active"
  },
  {
    id: "2",
    consumerName: "Commercial Entity B",
    startDate: "2024-02-01",
    endDate: "2025-01-31",
    rate: 0.12,
    minimumPurchase: 3000,
    status: "active"
  }
];

export const ConsumerContractsList = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Consumer Contracts</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Contract
        </Button>
      </div>

      <div className="grid gap-4">
        {mockContracts.map((contract) => (
          <Card key={contract.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{contract.consumerName}</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Contract #{contract.id}
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Period</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Rate</div>
                  <div className="text-sm text-muted-foreground">
                    ${contract.rate.toFixed(2)}/kWh
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Minimum Purchase</div>
                  <div className="text-sm text-muted-foreground">
                    {contract.minimumPurchase.toLocaleString()} kWh
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Status</div>
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    contract.status === 'active' 
                      ? 'bg-green-100 text-green-800'
                      : contract.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {contract.status.toUpperCase()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};