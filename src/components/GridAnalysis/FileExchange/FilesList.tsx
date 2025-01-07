import React from "react";
import { FileDirection, TernaFile } from "@/types/terna";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilesListProps {
  direction: FileDirection;
}

// Mock data - replace with actual data from your backend
const mockFiles: TernaFile[] = [
  {
    id: "1",
    type: "metering",
    direction: "inbound",
    filename: "metering_data_2024_02.csv",
    uploadedAt: "2024-02-20T10:30:00",
    processedAt: "2024-02-20T10:31:00",
    status: "success",
    metadata: {
      timeRange: {
        start: "2024-02-01",
        end: "2024-02-20",
      },
    },
  },
  {
    id: "2",
    type: "settlement",
    direction: "inbound",
    filename: "settlement_jan_2024.xml",
    uploadedAt: "2024-02-15T14:20:00",
    processedAt: "2024-02-15T14:21:00",
    status: "error",
    errorMessage: "Invalid data format in row 15",
  },
];

export const FilesList = ({ direction }: FilesListProps) => {
  const files = mockFiles.filter((file) => file.direction === direction);

  const getStatusBadge = (status: TernaFile["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500">Success</Badge>;
      case "error":
        return <Badge variant="destructive">Error</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "processed":
        return <Badge variant="secondary">Processed</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Recent Files</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Filename</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell>{file.filename}</TableCell>
              <TableCell className="capitalize">{file.type}</TableCell>
              <TableCell>{new Date(file.uploadedAt).toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(file.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};