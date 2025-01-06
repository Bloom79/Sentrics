import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download } from "lucide-react";
import { FILE_TYPES } from "@/types/consumption";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileUploaderProps {
  consumerId: string;
  onSuccess: () => void;
}

export const FileUploader = ({ consumerId, onSuccess }: FileUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFileType, setSelectedFileType] = useState<string>("actual");
  const { toast } = useToast();

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

      onSuccess();
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
  );
};