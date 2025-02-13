import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

type NewComplianceRecordProps = {
  communityId: number;
  onSuccess?: () => void;
};

type ComplianceRecordCreate = {
  submission_type: string;
  notes: string;
};

export function NewComplianceRecord({ communityId, onSuccess }: NewComplianceRecordProps) {
  const [submissionType, setSubmissionType] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const { toast } = useToast();

  const { mutate: createRecord, isPending } = useMutation<
    any,
    Error,
    ComplianceRecordCreate,
    unknown
  >({
    mutationFn: async (data) => {
      const response = await api.post(`/api/cer/communities/${communityId}/compliance`, data);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Compliance record created successfully',
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create compliance record',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionType) {
      toast({
        title: 'Error',
        description: 'Please select a submission type',
        variant: 'destructive',
      });
      return;
    }
    createRecord({ submission_type: submissionType, notes });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Compliance Record</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Submission Type</label>
            <Select
              value={submissionType}
              onValueChange={setSubmissionType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select submission type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REGISTRATION">Registration</SelectItem>
                <SelectItem value="MONTHLY_REPORT">Monthly Report</SelectItem>
                <SelectItem value="ANNUAL_REPORT">Annual Report</SelectItem>
                <SelectItem value="TECHNICAL_UPDATE">Technical Update</SelectItem>
                <SelectItem value="MEMBER_UPDATE">Member Update</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any relevant notes..."
              rows={4}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Record'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 