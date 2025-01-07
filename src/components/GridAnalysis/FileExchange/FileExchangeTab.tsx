import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "./FileUploader";
import { FilesList } from "./FilesList";
import { FileGenerator } from "./FileGenerator";
import { FileDown, FileUp } from "lucide-react";

export const FileExchangeTab = () => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="inbound" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inbound">
            <FileDown className="h-4 w-4 mr-2" />
            Inbound Files
          </TabsTrigger>
          <TabsTrigger value="outbound">
            <FileUp className="h-4 w-4 mr-2" />
            Outbound Files
          </TabsTrigger>
        </TabsList>

        <TabsContent value="inbound" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Terna Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploader />
              <FilesList direction="inbound" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outbound" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Generate & Export Files</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileGenerator />
              <FilesList direction="outbound" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};