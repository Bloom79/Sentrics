import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileType } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const fileTypes = {
  inbound: [
    { value: "meter-data", label: "Metered Data" },
    { value: "schedule-confirmation", label: "Schedule Confirmation" },
    { value: "settlement", label: "Settlement Data" },
  ],
  outbound: [
    { value: "schedule", label: "Schedule Data" },
    { value: "production-report", label: "Production Report" },
    { value: "consumption-report", label: "Consumption Report" },
  ],
};

export const FileUpload = () => {
  const { toast } = useToast();
  const [direction, setDirection] = React.useState<"inbound" | "outbound">("inbound");
  const [fileType, setFileType] = React.useState("");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Here you would implement the actual file upload logic
      toast({
        title: "File Upload Started",
        description: `Uploading ${file.name}...`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "There was an error uploading your file.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Exchange</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={direction} onValueChange={(value: "inbound" | "outbound") => setDirection(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="inbound">Inbound (Terna → You)</SelectItem>
            <SelectItem value="outbound">Outbound (You → Terna)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={fileType} onValueChange={setFileType}>
          <SelectTrigger>
            <SelectValue placeholder="Select file type" />
          </SelectTrigger>
          <SelectContent>
            {fileTypes[direction].map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Input
            type="file"
            accept=".csv,.xml,.xls,.xlsx"
            onChange={handleFileUpload}
            className="cursor-pointer"
          />
        </div>

        <Button className="w-full">
          <Upload className="mr-2 h-4 w-4" />
          {direction === "inbound" ? "Upload File" : "Generate & Download"}
        </Button>
      </CardContent>
    </Card>
  );
};