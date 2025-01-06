import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ConsumerAnalytics = () => {
  const [date, setDate] = React.useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const [granularity, setGranularity] = React.useState("daily");

  // Mock data for the charts - in a real app, this would come from the API
  const consumptionData = [
    { name: 'Mon', peak: 4000, offPeak: 2400, total: 6400 },
    { name: 'Tue', peak: 3000, offPeak: 1398, total: 4398 },
    { name: 'Wed', peak: 2000, offPeak: 9800, total: 11800 },
    { name: 'Thu', peak: 2780, offPeak: 3908, total: 6688 },
    { name: 'Fri', peak: 1890, offPeak: 4800, total: 6690 },
    { name: 'Sat', peak: 2390, offPeak: 3800, total: 6190 },
    { name: 'Sun', peak: 3490, offPeak: 4300, total: 7790 },
  ];

  const peakHoursData = [
    { hour: '00:00', usage: 1200 },
    { hour: '03:00', usage: 900 },
    { hour: '06:00', usage: 2500 },
    { hour: '09:00', usage: 3800 },
    { hour: '12:00', usage: 4200 },
    { hour: '15:00', usage: 3900 },
    { hour: '18:00', usage: 4500 },
    { hour: '21:00', usage: 2800 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          Consumption Analytics
        </h2>
        <div className="flex items-center gap-4">
          <Select value={granularity} onValueChange={setGranularity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select granularity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hourly">Hourly</SelectItem>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          <DatePickerWithRange 
            date={date} 
            setDate={(newDate) => {
              if (newDate?.from) {
                setDate({ 
                  from: newDate.from, 
                  to: newDate.to || addDays(newDate.from, 7) 
                });
              }
            }} 
          />
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="peak-analysis">Peak Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Historical Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Consumption</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">49,856 kWh</div>
                <p className="text-xs text-muted-foreground">+12.3% from last period</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Demand</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,500 kW</div>
                <p className="text-xs text-muted-foreground">Highest this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Load Factor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78%</div>
                <p className="text-xs text-muted-foreground">Good efficiency</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Consumption Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consumptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="peak" stroke="#ff7c43" name="Peak Hours" />
                    <Line type="monotone" dataKey="offPeak" stroke="#00b4d8" name="Off-Peak Hours" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="peak-analysis">
          <Card>
            <CardHeader>
              <CardTitle>24-Hour Usage Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={peakHoursData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="usage" fill="#ff7c43" name="Usage (kW)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Year-over-Year Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={consumptionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="total" stroke="#2b9348" name="Current Period" />
                    <Line type="monotone" dataKey="total" stroke="#666" name="Previous Period" strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsumerAnalytics;