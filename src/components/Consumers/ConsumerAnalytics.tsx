import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ConsumerAnalytics = () => {
  const [date, setDate] = React.useState<{ from: Date; to: Date }>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const [granularity, setGranularity] = React.useState("daily");

  // Mock data for the chart - in a real app, this would come from the API
  const data = [
    { name: 'Mon', industrial: 4000, commercial: 2400, residential: 1000 },
    { name: 'Tue', industrial: 3000, commercial: 1398, residential: 900 },
    { name: 'Wed', industrial: 2000, commercial: 9800, residential: 1100 },
    { name: 'Thu', industrial: 2780, commercial: 3908, residential: 1200 },
    { name: 'Fri', industrial: 1890, commercial: 4800, residential: 1100 },
    { name: 'Sat', industrial: 2390, commercial: 3800, residential: 800 },
    { name: 'Sun', industrial: 3490, commercial: 4300, residential: 900 },
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

      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption by Consumer Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="industrial" stroke="#ff7c43" name="Industrial" />
                <Line type="monotone" dataKey="commercial" stroke="#00b4d8" name="Commercial" />
                <Line type="monotone" dataKey="residential" stroke="#2b9348" name="Residential" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumerAnalytics;