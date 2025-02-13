import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MemberCard } from "@/components/members/member-card";
import { WaitingListCard } from "@/components/members/waiting-list-card";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface Member {
  id: number;
  name: string;
  type: 'consumer' | 'producer' | 'prosumer';
  user_type: 'real' | 'simulated';
  status: 'active' | 'inactive' | 'pending';
  pod_id: string;
  smart_meter_id?: string;
  address?: string;
  activation_date?: string;
  contracted_power?: number;
  energy_produced?: number;
  energy_consumed?: number;
  energy_shared?: number;
}

export default function MembersPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("members");

  const { data: membersData, isLoading: isLoadingMembers } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const response = await api.get("/api/v1/members");
      return response.data;
    },
  });

  const { data: waitingListData, isLoading: isLoadingWaitingList } = useQuery({
    queryKey: ["waiting-list"],
    queryFn: async () => {
      const response = await api.get("/api/v1/participation-requests/pending");
      return response.data;
    },
  });

  const members = membersData?.items || [];
  const waitingList = waitingListData?.items || [];

  const filteredMembers = members.filter((member: Member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.pod_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.smart_meter_id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === "all" || member.type?.toLowerCase() === typeFilter.toLowerCase();
    const matchesUser = userFilter === "all" || member.user_type?.toLowerCase() === userFilter.toLowerCase();
    const matchesStatus = statusFilter === "all" || member.status?.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesType && matchesUser && matchesStatus;
  });

  if (isLoadingMembers || isLoadingWaitingList) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Members</h1>
          <p className="text-muted-foreground">Manage members of energy configurations</p>
        </div>
        <Button onClick={() => navigate("/cer/members/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="members">Members List</TabsTrigger>
          <TabsTrigger value="waiting">Waiting List</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card className="p-6">
            <div className="flex gap-4 mb-6">
              <Input
                placeholder="Search members by name, POD-ID, or smart meter ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="producer">Producer</SelectItem>
                  <SelectItem value="prosumer">Prosumer</SelectItem>
                </SelectContent>
              </Select>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="real">Real</SelectItem>
                  <SelectItem value="simulated">Simulated</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredMembers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No members found
                </div>
              ) : (
                filteredMembers.map((member: Member) => (
                  <MemberCard key={member.id} member={member} />
                ))
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="waiting">
          <Card className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {waitingList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending participation requests
                </div>
              ) : (
                waitingList.map((request: any) => (
                  <WaitingListCard key={request.id} request={request} />
                ))
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 