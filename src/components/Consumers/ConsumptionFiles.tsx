import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Upload, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ConsumptionFile {
  id: string;
  filename: string;
  upload_date: string;
  content_type: string;
  file_size: number;
  file_path: string;
  file_type: string;
}

const FILE_TYPES = {
  contract: "Contract Consumption",
  actual: "Actual Consumption",
  forecast: "Consumption Forecast",
  other: "Other"
};

const ConsumptionFiles = ({ consumerId }: { consumerId: string }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<string>("actual");
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

      const fileExt = file.name.split('.').pop();
      const filePath = `${consumerId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('consumption_files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('consumption_files')
        .insert({
          consumer_id: consumerId,
          filename: file.name,
          file_path: filePath,
          content_type: file.type,
          file_size: file.size,
          file_type: selectedFileType
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

  const downloadTemplate = () => {
    const templateContent = "Date,Hour,Consumption (kWh)\n2024-01-01,0,100\n2024-01-01,1,95";
    const blob = new Blob([templateContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'consumption_template.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Consumption Files</CardTitle>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={downloadTemplate}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
          <div className="flex items-center gap-2">
            <Select value={selectedFileType} onValueChange={setSelectedFileType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select file type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FILE_TYPES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                    {FILE_TYPES[file.file_type as keyof typeof FILE_TYPES]} - Uploaded on {format(new Date(file.upload_date), 'PPp')}
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