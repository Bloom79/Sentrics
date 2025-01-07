import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileType } from "@/types/terna";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const FileUploader = () => {
  const { toast } = useToast();
  const [fileType, setFileType] = React.useState<FileType>("metering");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", fileType);

      // TODO: Implement file upload logic
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded and is being processed.`,
      });
    } catch (error) {
      toast({
        title: "Error uploading file",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>File Type</Label>
          <Select value={fileType} onValueChange={(value) => setFileType(value as FileType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select file type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metering">Metering Data</SelectItem>
              <SelectItem value="settlement">Settlement Data</SelectItem>
              <SelectItem value="schedule">Schedule Confirmation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="border-dashed cursor-pointer hover:border-primary/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}>
        <div className="p-8 flex flex-col items-center justify-center text-center space-y-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-muted-foreground">
            Supported formats: CSV, XML, XLS
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".csv,.xml,.xls,.xlsx"
          onChange={handleFileChange}
        />
      </Card>
    </div>
  );
};