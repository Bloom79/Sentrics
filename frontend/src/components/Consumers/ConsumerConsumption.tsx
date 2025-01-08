import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { FileUploadSection } from "./ConsumerConsumption/FileUploadSection";
import { FilesList } from "./ConsumerConsumption/FilesList";
import { ConsumptionGraph } from "./ConsumerConsumption/ConsumptionGraph";

const ConsumerConsumption = () => {
  const { consumerId } = useParams();
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: files, refetch: refetchFiles } = useQuery({
    queryKey: ['consumption-files', consumerId],
    queryFn: async () => {
      if (!consumerId) throw new Error('No consumer ID provided');
      
      const { data, error } = await supabase
        .from('consumption_files')
        .select('*')
        .eq('consumer_id', consumerId)
        .order('upload_date', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !consumerId) return;

    try {
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
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });

      refetchFiles();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload file. Please try again.",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (filePath: string, filename: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('consumption_files')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to download file. Please try again.",
      });
    }
  };

  const handleDelete = async (id: string, filePath: string) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('consumption_files')
        .remove([filePath]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('consumption_files')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      refetchFiles();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Consumption Files</CardTitle>
          <FileUploadSection
            consumerId={consumerId || ''}
            fileInputRef={fileInputRef}
            onFileUpload={handleFileUpload}
            refetchFiles={refetchFiles}
          />
        </CardHeader>
        <CardContent>
          {files?.length === 0 ? (
            <p className="text-center text-muted-foreground">No files uploaded yet</p>
          ) : (
            <FilesList
              files={files}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {consumerId && <ConsumptionGraph consumerId={consumerId} />}
    </div>
  );
};

export default ConsumerConsumption;