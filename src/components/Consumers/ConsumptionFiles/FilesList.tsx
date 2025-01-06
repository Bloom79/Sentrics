import React from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ConsumptionFile, FILE_TYPES } from "@/types/consumption";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FilesListProps {
  files: ConsumptionFile[];
}

export const FilesList = ({ files }: FilesListProps) => {
  const { toast } = useToast();

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('consumption_files')
        .download(filePath);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download file. Please try again.",
      });
    }
  };

  if (files.length === 0) {
    return <p className="text-muted-foreground">No consumption files uploaded yet.</p>;
  }

  return (
    <div className="space-y-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="space-y-1">
            <p className="font-medium">{file.filename}</p>
            <p className="text-sm text-muted-foreground">
              {FILE_TYPES[file.file_type]} - Uploaded on {format(new Date(file.upload_date), 'PPp')}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => downloadFile(file.file_path, file.filename)}
          >
            Download
          </Button>
        </div>
      ))}
    </div>
  );
};