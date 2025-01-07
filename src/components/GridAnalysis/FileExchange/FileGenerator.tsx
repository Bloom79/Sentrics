import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileType } from "@/types/terna";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export const FileGenerator = () => {
  const { toast } = useToast();
  const [fileType, setFileType] = React.useState<FileType>("schedule");
  const [date, setDate] = React.useState<Date>();

  const handleGenerate = () => {
    if (!date) {
      toast({
        title: "Please select a date",
        variant: "destructive",
      });
      return;
    }

    // TODO: Implement file generation logic
    toast({
      title: "File generated successfully",
      description: "Your file is ready to download.",
    });
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
              <SelectItem value="schedule">Day-Ahead Schedule</SelectItem>
              <SelectItem value="production">Production Report</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Button onClick={handleGenerate} className="w-full sm:w-auto">
        <Download className="mr-2 h-4 w-4" />
        Generate File
      </Button>
    </div>
  );
};