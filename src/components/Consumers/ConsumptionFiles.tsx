import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileUploader } from "./ConsumptionFiles/FileUploader";
import { FilesList } from "./ConsumptionFiles/FilesList";
import type { ConsumptionFile } from "@/types/consumption";

interface ConsumptionFilesProps {
  consumerId: string;
}

const ConsumptionFiles = ({ consumerId }: ConsumptionFilesProps) => {
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Consumption Files</CardTitle>
        <FileUploader consumerId={consumerId} onSuccess={() => refetch()} />
      </CardHeader>
      <CardContent>
        <FilesList files={files || []} />
      </CardContent>
    </Card>
  );
};

export default ConsumptionFiles;