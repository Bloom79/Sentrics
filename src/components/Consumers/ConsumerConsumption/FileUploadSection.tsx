import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileDown } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadSectionProps {
  consumerId: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  refetchFiles: () => void;
}

export const FileUploadSection = ({ consumerId, fileInputRef, onFileUpload, refetchFiles }: FileUploadSectionProps) => {
  const { toast } = useToast();

  const handleTemplateDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('consumption_files')
        .download('templates/consumption_template.xlsx');

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'consumption_template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Template download error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download template. Please try again.",
      });
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onFileUpload}
        className="hidden"
        accept=".csv,.xlsx,.xls"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center space-x-2"
      >
        <Upload className="h-4 w-4" />
        <span>Upload File</span>
      </Button>
      <Button
        variant="outline"
        onClick={handleTemplateDownload}
        className="flex items-center space-x-2"
      >
        <FileDown className="h-4 w-4" />
        <span>Download Template</span>
      </Button>
    </div>
  );
};