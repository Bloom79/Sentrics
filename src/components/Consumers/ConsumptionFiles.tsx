import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Upload } from "lucide-react";

interface ConsumptionFile {
  id: string;
  filename: string;
  upload_date: string;
  content_type: string;
  file_size: number;
  file_path: string;
}

const ConsumptionFiles = ({ consumerId }: { consumerId: string }) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const { data: files, refetch } = useQuery({
    queryKey: ['consumption-files', consumerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consumption_files')
        .select('*')
        .eq('consumer_id', consumerId)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      return data as ConsumptionFile[];
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      setUploading(true);

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${consumerId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('consumption_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create record in consumption_files table
      const { error: dbError } = await supabase
        .from('consumption_files')
        .insert({
          consumer_id: consumerId,
          filename: file.name,
          file_path: filePath,
          content_type: file.type,
          file_size: file.size
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('consumption_files')
        .download(filePath);

      if (error) throw error;

      // Create a download link
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Consumption Files</CardTitle>
        <div>
          <Button
            variant="outline"
            disabled={uploading}
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".csv,.xlsx,.xls"
          />
        </div>
      </CardHeader>
      <CardContent>
        {files?.length === 0 ? (
          <p className="text-muted-foreground">No consumption files uploaded yet.</p>
        ) : (
          <div className="space-y-4">
            {files?.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <p className="font-medium">{file.filename}</p>
                  <p className="text-sm text-muted-foreground">
                    Uploaded on {format(new Date(file.upload_date), 'PPp')}
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
        )}
      </CardContent>
    </Card>
  );
};

export default ConsumptionFiles;