import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown, Euro } from "lucide-react";

const FinancialSettlement = () => {
  // Mock data - in a real app, this would come from an API
  const settlements = [
    {
      id: "1",
      period: "March 2024",
      importCost: 1200,
      exportRevenue: 800,
      netBalance: -400,
      status: "pending",
    },
    {
      id: "2",
      period: "February 2024",
      importCost: 1100,
      exportRevenue: 900,
      netBalance: -200,
      status: "settled",
    },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Current Period Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Import Cost</p>
              <p className="text-2xl font-bold">€1,200</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Export Revenue</p>
              <p className="text-2xl font-bold">€800</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Net Balance</p>
              <p className="text-2xl font-bold text-red-500">-€400</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Settlement History</h3>
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>

        {settlements.map((settlement) => (
          <Card key={settlement.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">
                {settlement.period}
              </CardTitle>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                settlement.status === "settled" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {settlement.status}
              </span>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-2 sm:grid-cols-3">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Import Cost</dt>
                  <dd className="text-sm font-medium">€{settlement.importCost}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Export Revenue</dt>
                  <dd className="text-sm font-medium">€{settlement.exportRevenue}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Net Balance</dt>
                  <dd className={`text-sm font-medium ${settlement.netBalance < 0 ? "text-red-500" : "text-green-500"}`}>
                    €{settlement.netBalance}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancialSettlement;