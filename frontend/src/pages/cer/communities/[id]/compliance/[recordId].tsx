import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Upload } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { DocumentManager } from '@/components/compliance/DocumentManager';

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

export default function ComplianceRecordView() {
  const { id: communityId, recordId } = useParams<{ id: string; recordId: string }>();
  const navigate = useNavigate();

  const { data: record, isLoading } = useQuery({
    queryKey: ['compliance-record', recordId],
    queryFn: async () => {
      const response = await api.get(`/api/cer/communities/${communityId}/compliance/${recordId}`);
      return response.data as ComplianceRecord;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!record) {
    return (
      <Alert>
        <AlertDescription>Compliance record not found</AlertDescription>
      </Alert>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate(`/cer/communities/${communityId}/compliance`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Records
          </Button>
          <h1 className="text-2xl font-bold">Compliance Record Details</h1>
        </div>
        {record.status === 'DRAFT' && (
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Submit to GSE
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Record Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm font-medium text-muted-foreground">Type</div>
              <Badge variant="outline" className="mt-1 capitalize">
                {record.submission_type.toLowerCase()}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Status</div>
              <Badge variant={getStatusVariant(record.status)} className="mt-1 capitalize">
                {record.status.toLowerCase()}
              </Badge>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Submission Date</div>
              <div className="mt-1">{formatDate(record.submission_date)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Notes</div>
              <div className="mt-1">{record.notes || '-'}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Created</div>
              <div className="mt-1">{formatDate(record.created_at)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground">Last Updated</div>
              <div className="mt-1">{formatDate(record.updated_at)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Required Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <DocumentManager
              communityId={Number(communityId)}
              recordId={Number(recordId)}
              submissionType={record.submission_type}
              readOnly={record.status !== 'DRAFT'}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 