import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export enum SubmissionType {
  INITIAL = 'INITIAL',
  ANNUAL = 'ANNUAL',
  UPDATE = 'UPDATE',
  SPECIAL = 'SPECIAL'
}

export enum ComplianceStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface ComplianceRecord {
  id: number;
  community_id: number;
  submission_type: SubmissionType;
  status: ComplianceStatus;
  submission_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useComplianceRecord = (communityId: number, recordId: number) => {
  return useQuery({
    queryKey: ['compliance', communityId, recordId],
    queryFn: async () => {
      const { data } = await api.get<ComplianceRecord>(
        `/communities/${communityId}/compliance/${recordId}`
      );
      return data;
    },
  });
};

export const useComplianceRecords = (communityId: number) => {
  return useQuery({
    queryKey: ['compliance', communityId],
    queryFn: async () => {
      const { data } = await api.get<ComplianceRecord[]>(
        `/communities/${communityId}/compliance`
      );
      return data;
    },
  });
}; 