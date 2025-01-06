import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Tool } from "lucide-react";

interface MaintenanceScheduleProps {
  siteId: string;
}

// Mock data - replace with actual API call
const mockSchedule = [
  {
    id: "1",
    type: "Routine Inspection",
    date: "2024-03-01T10:00:00Z",
    status: "scheduled",
    technician: "John Smith",
  },
  {
    id: "2",
    type: "Battery Maintenance",
    date: "2024-03-15T14:30:00Z",
    status: "scheduled",
    technician: "Sarah Johnson",
  },
  {
    id: "3",
    type: "Solar Panel Cleaning",
    date: "2024-03-20T09:00:00Z",
    status: "scheduled",
    technician: "Mike Brown",
  },
];

const MaintenanceSchedule = ({ siteId }: MaintenanceScheduleProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Maintenance Schedule
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockSchedule.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
            >
              <Tool className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="font-medium">{task.type}</p>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {task.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(task.date).toLocaleDateString()} at{" "}
                  {new Date(task.date).toLocaleTimeString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Technician: {task.technician}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceSchedule;