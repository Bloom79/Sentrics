import React from 'react';
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Users, FileText, Activity, Settings, ClipboardCheck, Plus } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DataTable, Column } from "@/components/ui/data-table";
import { BoundaryInfo } from "@/components/cer/BoundaryInfo";
import { MemberStats } from "@/components/cer/MemberStats";
import { AddMemberDialog } from "@/components/cer/members/AddMemberDialog";
import { DocumentManager } from '../../../../components/compliance/DocumentManager';
import type { Row, ColumnDef } from '@tanstack/react-table';

type Member = {
  id: number;
  community_id: number;
  name: string;
  member_type: string;  // PRODUCER, CONSUMER, PROSUMER
  user_type: string;  // RESIDENTIAL, COMMERCIAL, INDUSTRIAL
  consumption_class: string;  // CLASS_1 through CLASS_5
  status: string;
  created_at: string;
  updated_at: string;
};

type Community = {
  id: number;
  name: string;
  legal_type: 'cooperative' | 'association';
  status: 'draft' | 'pending_gse' | 'active' | 'archived';
  primary_substation_id: string;
  boundary: GeoJSON.Polygon;
  total_capacity: number;
  gse_compliance: {
    submitted: number;
    approved: number;
  };
  created_at: string;
  updated_at: string;
  region: string;
  description: string;
  member_count: {
    producers: number;
    consumers: number;
    prosumers: number;
  };
};

type ComplianceRecord = {
  id: number;
  community_id: number;
  submission_type: string;
  status: string;
  submission_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

const memberColumns: Column<Member>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
  },
  {
    id: 'member_type',
    header: 'Type',
    accessorKey: 'member_type',
    cell: ({ row }: { row: { original: Member } }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.member_type.toLowerCase()}
      </Badge>
    ),
  },
  {
    id: 'user_type',
    header: 'User Type',
    accessorKey: 'user_type',
    cell: ({ row }: { row: { original: Member } }) => (
      <Badge variant="outline" className="capitalize">
        {row.original.user_type.toLowerCase()}
      </Badge>
    ),
  },
  {
    id: 'consumption_class',
    header: 'Consumption Class',
    accessorKey: 'consumption_class',
    cell: ({ row }: { row: { original: Member } }) => (
      <Badge variant="outline">
        {row.original.consumption_class}
      </Badge>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }: { row: { original: Member } }) => (
      <Badge
        variant={
          row.original.status === 'active'
            ? 'success'
            : row.original.status === 'pending'
            ? 'warning'
            : 'destructive'
        }
        className="capitalize"
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: 'created_at',
    header: 'Created',
    accessorKey: 'created_at',
    cell: ({ row }: { row: { original: Member } }) => formatDate(row.original.created_at),
  },
];

const complianceColumns: ColumnDef<ComplianceRecord>[] = [
  {
    id: 'submission_type',
    header: 'Type',
    accessorKey: 'submission_type',
    cell: ({ row }) => (
      <Badge variant="outline" className="capitalize">
        {String(row.getValue('submission_type')).toLowerCase()}
      </Badge>
    ),
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = String(row.getValue('status'));
      const variant = 
        status === 'APPROVED' ? 'success' :
        status === 'PENDING' ? 'warning' :
        status === 'REJECTED' ? 'destructive' : 
        'default';
      
      return (
        <Badge variant={variant} className="capitalize">
          {status.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    id: 'submission_date',
    header: 'Submission Date',
    accessorKey: 'submission_date',
    cell: ({ row }) => formatDate(String(row.getValue('submission_date'))),
  },
  {
    id: 'notes',
    header: 'Notes',
    accessorKey: 'notes',
    cell: ({ row }) => String(row.getValue('notes')) || '-',
  },
];

export default function CommunityDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: community, isLoading: loadingCommunity, error: communityError } = useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      const response = await api.get(`/api/cer/communities/${id}`);
      // Normalize the data to ensure all fields exist
      const normalizedData = {
        ...response.data,
        description: response.data.description || '',
        gse_compliance: response.data.gse_compliance || { submitted: 0, approved: 0 },
        member_count: response.data.member_count || { producers: 0, consumers: 0, prosumers: 0 },
        total_capacity: response.data.total_capacity || 0,
      };
      return normalizedData as Community;
    },
  });

  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ['community-members', id],
    queryFn: async () => {
      const response = await api.get(`/api/cer/communities/${id}/members`);
      return response.data.data;
    },
  });

  const { data: complianceRecords = [], isLoading: isLoadingCompliance } = useQuery({
    queryKey: ['community-compliance-records', id],
    queryFn: async () => {
      const response = await api.get(`/api/cer/communities/${id}/compliance`);
      return response.data as ComplianceRecord[];
    },
  });

  if (loadingCommunity) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (communityError || !community) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load community details. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{community.name}</h1>
          <p className="text-muted-foreground">{community.description}</p>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline" className="capitalize">
              {community.legal_type}
            </Badge>
            <Badge
              variant={
                community.status === 'active'
                  ? 'success'
                  : community.status === 'pending_gse'
                  ? 'warning'
                  : community.status === 'draft'
                  ? 'default'
                  : 'destructive'
              }
            >
              {community.status.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/cer/communities/${id}/edit`)}>
            <Settings className="w-4 h-4 mr-2" />
            Edit Community
          </Button>
          <Button variant="outline" onClick={() => navigate(`/cer/communities/${id}/compliance`)}>
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Compliance Records
          </Button>
          <Button asChild>
            <Link to={`/cer/communities/${id}/share`}>
              <Share2 className="w-4 h-4 mr-2" />
              Energy Sharing
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={community.total_capacity > 200 ? 'text-red-600' : ''}>
                {community.total_capacity}/200 kW
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>GSE Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {community.gse_compliance?.approved || 0}/{community.gse_compliance?.submitted || 0} of 20
            </div>
          </CardContent>
        </Card>
        <MemberStats memberCount={community.member_count || { producers: 0, consumers: 0, prosumers: 0 }} />
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">
            <Users className="w-4 h-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="boundary">
            <FileText className="w-4 h-4 mr-2" />
            Boundary
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="w-4 h-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <ClipboardCheck className="w-4 h-4 mr-2" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="w-4 h-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Community Members</h2>
            <AddMemberDialog communityId={id!}>
              <Button>
                <Users className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </AddMemberDialog>
          </div>
          
          <DataTable
            columns={memberColumns}
            data={members || []}
            isLoading={loadingMembers}
          />
        </TabsContent>

        <TabsContent value="boundary">
          <BoundaryInfo boundary={community.boundary} maxRadius={1000} />
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>GSE Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              Document management interface will be implemented here
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>GSE Compliance Records</CardTitle>
                <Button onClick={() => navigate(`/cer/communities/${id}/compliance`)}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Record
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingCompliance ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : !complianceRecords?.length ? (
                <Alert>
                  <AlertDescription>No compliance records found</AlertDescription>
                </Alert>
              ) : (
                <DataTable
                  columns={complianceColumns}
                  data={complianceRecords}
                  onRowClick={(record) => navigate(`/cer/communities/${id}/compliance/${record.id}`)}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              Activity log will be implemented here
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 