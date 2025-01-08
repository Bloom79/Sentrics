import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data - replace with actual data from your backend
const fileHistory = [
  {
    id: "1",
    filename: "schedule_2024_03_15.csv",
    type: "schedule",
    direction: "outbound",
    status: "success",
    timestamp: "2024-03-15T10:00:00",
    user: "John Doe",
  },
  {
    id: "2",
    filename: "meter_data_2024_03_14.xml",
    type: "meter-data",
    direction: "inbound",
    status: "error",
    timestamp: "2024-03-14T15:30:00",
    user: "Jane Smith",
  },
];

export const FileHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>File Exchange History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Filename</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Direction</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fileHistory.map((file) => (
              <TableRow key={file.id}>
                <TableCell>{file.filename}</TableCell>
                <TableCell className="capitalize">{file.type}</TableCell>
                <TableCell>
                  <Badge variant={file.direction === "inbound" ? "secondary" : "outline"}>
                    {file.direction}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={file.status === "success" ? "success" : "destructive"}>
                    {file.status}
                  </Badge>
                </TableCell>
                <TableCell>{file.user}</TableCell>
                <TableCell>{new Date(file.timestamp).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};