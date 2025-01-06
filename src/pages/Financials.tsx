import React from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FinancialMetrics from "@/components/Financials/FinancialMetrics";
import RevenueBreakdown from "@/components/Financials/RevenueBreakdown";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const Financials = () => {
  const { plantId, siteId, consumerId } = useParams();
  const [date, setDate] = React.useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const handleExport = () => {
    // Implement export functionality
    console.log("Exporting financial data...");
  };

  const getEntityTitle = () => {
    if (plantId) return "Plant Financial Overview";
    if (siteId) return "Site Financial Overview";
    if (consumerId) return "Consumer Financial Overview";
    return "Financial Overview";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{getEntityTitle()}</h2>
        <div className="flex items-center gap-4">
          <DatePickerWithRange 
            date={{ from: date.from, to: date.to }} 
            setDate={(newDate) => {
              if (newDate?.from) {
                setDate({ 
                  from: newDate.from, 
                  to: newDate.to || addDays(newDate.from, 7) 
                });
              }
            }} 
          />
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <FinancialMetrics 
        plantId={plantId} 
        siteId={siteId} 
        consumerId={consumerId} 
        dateRange={date} 
      />

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="profit">Profit & Loss</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="space-y-4">
          <RevenueBreakdown 
            plantId={plantId}
            siteId={siteId}
            consumerId={consumerId}
            dateRange={date} 
          />
        </TabsContent>
        <TabsContent value="expenses" className="space-y-4">
          <h3 className="text-lg font-medium">Expenses Content</h3>
          {/* Expenses breakdown will be implemented in the next phase */}
        </TabsContent>
        <TabsContent value="profit" className="space-y-4">
          <h3 className="text-lg font-medium">Profit & Loss Content</h3>
          {/* Profit & Loss chart will be implemented in the next phase */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Financials;