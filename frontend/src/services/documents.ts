import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/axios';

export enum DocumentType {
  REGISTRATION = 'REGISTRATION',
  TECHNICAL = 'TECHNICAL',
  LEGAL = 'LEGAL',
  FINANCIAL = 'FINANCIAL',
  OTHER = 'OTHER'
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Document {
  id: number;
  record_id: number;
  document_type: DocumentType;
  status: DocumentStatus;
  file_name: string;
  file_type: string;
  file_size: number;
  version: number;
  document_metadata?: Record<string, any>;
  submitted_at?: string;
  validated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ValidationResult {
  is_valid: boolean;
  checks: Array<{
    name: string;
    passed: boolean;
    message: string;
  }>;
}

export const useUploadDocument = () => {
  return useMutation({
    mutationFn: async ({
      communityId,
      recordId,
      file,
      documentType,
      document_metadata
    }: {
      communityId: number;
      recordId: number;
      file: File;
      documentType: DocumentType;
      document_metadata?: Record<string, any>;
    }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);
      if (document_metadata) {
        formData.append('document_metadata', JSON.stringify(document_metadata));
      }

      const { data } = await api.post<Document>(
        `/communities/${communityId}/compliance/${recordId}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return data;
    },
  });
};

export const useListDocuments = (
  communityId: number,
  recordId: number,
  documentType?: DocumentType,
  status?: DocumentStatus
) => {
  return useQuery({
    queryKey: ['documents', communityId, recordId, documentType, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (documentType) params.append('document_type', documentType);
      if (status) params.append('status', status);

      const { data } = await api.get<Document[]>(
        `/communities/${communityId}/compliance/${recordId}/documents?${params.toString()}`
      );
      return data;
    },
  });
};

export const useSubmitDocument = () => {
  return useMutation({
    mutationFn: async ({
      communityId,
      recordId,
      documentId,
    }: {
      communityId: number;
      recordId: number;
      documentId: number;
    }) => {
      const { data } = await api.post<{
        message: string;
        validation_results: ValidationResult;
      }>(
        `/communities/${communityId}/compliance/${recordId}/documents/${documentId}/submit`
      );
      return data;
    },
  });
}; 