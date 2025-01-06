import React from "react";
import { Filter, LayoutDashboard, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLanguage } from "@/contexts/LanguageContext";

interface DashboardHeaderProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedTimeRange: string;
  setSelectedTimeRange: (value: string) => void;
  language: string;
  setLanguage: (value: 'en' | 'it') => void;
}

const DashboardHeader = ({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedTimeRange,
  setSelectedTimeRange,
  language,
  setLanguage,
}: DashboardHeaderProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-primary">SentricS Dashboard</h1>
        <p className="text-muted-foreground mt-2">{t('dashboard.subtitle')}</p>
      </div>
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
        <div className="relative">
          <Input
            placeholder="Search sites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10"
          />
          <LayoutDashboard className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Clock className="mr-2 h-4 w-4" />
              {selectedTimeRange}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="space-y-1">
              <Button
                variant={selectedTimeRange === "24h" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedTimeRange("24h")}
              >
                Last 24 Hours
              </Button>
              <Button
                variant={selectedTimeRange === "7d" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedTimeRange("7d")}
              >
                Last 7 Days
              </Button>
              <Button
                variant={selectedTimeRange === "30d" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedTimeRange("30d")}
              >
                Last 30 Days
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full md:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {selectedStatus !== "all" && (
                <Badge variant="secondary" className="ml-2">1</Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-background">
            <DropdownMenuLabel>Site Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem 
                onClick={() => setSelectedStatus("all")}
                className={selectedStatus === "all" ? "bg-accent" : ""}
              >
                All Status
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedStatus("online")}
                className={selectedStatus === "online" ? "bg-accent" : ""}
              >
                Online Only
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedStatus("maintenance")}
                className={selectedStatus === "maintenance" ? "bg-accent" : ""}
              >
                Maintenance
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSelectedStatus("offline")}
                className={selectedStatus === "offline" ? "bg-accent" : ""}
              >
                Offline
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Select value={language} onValueChange={(value: 'en' | 'it') => setLanguage(value)}>
          <SelectTrigger className="w-full md:w-[120px]">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="it">Italiano</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DashboardHeader;