import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface File {
  id: string;
  name: string;
  timestamp: string;
  status: "success" | "error";
}

const files: File[] = [
  {
    id: "1",
    name: "File Exchange 1",
    timestamp: "2024-01-01 10:00",
    status: "success",
  },
  {
    id: "2",
    name: "File Exchange 2",
    timestamp: "2024-01-02 11:00",
    status: "error",
  },
  {
    id: "3",
    name: "File Exchange 3",
    timestamp: "2024-01-03 12:00",
    status: "success",
  },
];

const FileHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>File Exchange History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">{file.timestamp}</p>
              </div>
              <Badge variant={file.status === "success" ? "default" : "destructive"}>
                {file.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileHistory;
