import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, ArrowLeft } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { NewComplianceRecord } from '@/components/compliance/NewComplianceRecord';
import { formatDate } from '@/lib/utils';
import type { Row } from '@tanstack/react-table';

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

export default function ComplianceRecordList() {
  const { id: communityId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showNewForm, setShowNewForm] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string>('');

  const { data: records = [], isLoading, refetch } = useQuery({
    queryKey: ['compliance-records', communityId],
    queryFn: async () => {
      const response = await api.get(`/api/cer/communities/${communityId}/compliance`);
      return response.data as ComplianceRecord[];
    },
  });

  const filteredRecords = React.useMemo(() => {
    if (!records) return [];
    if (!statusFilter) return records;
    return records.filter(record => record.status === statusFilter);
  }, [records, statusFilter]);

  const columns = [
    {
      id: 'submission_type',
      header: 'Type',
      accessorKey: 'submission_type',
      cell: ({ row }: { row: Row<ComplianceRecord> }) => (
        <Badge variant="outline" className="capitalize">
          {String(row.getValue('submission_type')).toLowerCase()}
        </Badge>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      cell: ({ row }: { row: Row<ComplianceRecord> }) => {
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
      cell: ({ row }: { row: Row<ComplianceRecord> }) => formatDate(String(row.getValue('submission_date'))),
    },
    {
      id: 'notes',
      header: 'Notes',
      accessorKey: 'notes',
      cell: ({ row }: { row: Row<ComplianceRecord> }) => String(row.getValue('notes')) || '-',
    },
    {
      id: 'created_at',
      header: 'Created',
      accessorKey: 'created_at',
      cell: ({ row }: { row: Row<ComplianceRecord> }) => formatDate(String(row.getValue('created_at'))),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/cer/communities/${communityId}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Button>
          <h1 className="text-2xl font-bold">Compliance Records</h1>
        </div>
        <Button onClick={() => setShowNewForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Record
        </Button>
      </div>

      {showNewForm && (
        <NewComplianceRecord
          communityId={Number(communityId)}
          onSuccess={() => {
            setShowNewForm(false);
            refetch();
          }}
        />
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {!filteredRecords.length ? (
            <Alert>
              <AlertDescription>No compliance records found</AlertDescription>
            </Alert>
          ) : (
            <DataTable
              columns={columns}
              data={filteredRecords}
              onRowClick={(record) => navigate(`/cer/communities/${communityId}/compliance/${record.id}`)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
} 