import React from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface File {
  id: string;
  filename: string;
  file_path: string;
  upload_date: string;
}

interface FilesListProps {
  files: File[];
  onDownload: (filePath: string, filename: string) => Promise<void>;
  onDelete: (id: string, filePath: string) => Promise<void>;
}

export const FilesList = ({ files, onDownload, onDelete }: FilesListProps) => {
  return (
    <div className="space-y-4">
      {files?.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex-1">
            <h4 className="font-medium">{file.filename}</h4>
            <p className="text-sm text-muted-foreground">
              Uploaded on {format(new Date(file.upload_date || ''), 'PPP')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownload(file.file_path, file.filename)}
            >
              Download
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(file.id, file.file_path)}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};