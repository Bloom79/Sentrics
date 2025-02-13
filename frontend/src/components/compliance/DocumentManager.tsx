import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

export type DocumentManagerProps = {
  communityId: number;
  recordId: number;
  submissionType: string;
  readOnly?: boolean;
};

type Document = {
  id: number;
  record_id: number;
  document_type: string;
  status: string;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
};

const REQUIRED_DOCUMENTS: Record<string, string[]> = {
  'REGISTRATION': ['REGISTRATION_FORM', 'TECHNICAL_SPECS', 'MEMBER_LIST'],
  'MONTHLY_REPORT': ['ENERGY_DATA', 'MEMBER_ACTIVITY'],
  'ANNUAL_REPORT': ['FINANCIAL_REPORT', 'COMPLIANCE_REPORT', 'MEMBER_SUMMARY'],
  'TECHNICAL_UPDATE': ['TECHNICAL_SPECS', 'IMPACT_ANALYSIS'],
  'MEMBER_UPDATE': ['MEMBER_LIST', 'MEMBER_AGREEMENTS']
};

export function DocumentManager({ communityId, recordId, submissionType, readOnly = false }: DocumentManagerProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = React.useState<string>('');

  const { data: documents, isLoading, refetch } = useQuery({
    queryKey: ['compliance-documents', recordId],
    queryFn: async () => {
      const response = await api.get(`/api/cer/communities/${communityId}/compliance/${recordId}/documents`);
      return response.data as Document[];
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post(
        `/api/cer/communities/${communityId}/compliance/${recordId}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    },
    onSuccess: () => {
      refetch();
      setSelectedType('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: number) => {
      await api.delete(`/api/cer/communities/${communityId}/compliance/${recordId}/documents/${documentId}`);
    },
    onSuccess: () => {
      refetch();
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedType) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('document_type', selectedType);

    uploadMutation.mutate(formData);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const requiredTypes = REQUIRED_DOCUMENTS[submissionType] || [];
  const uploadedTypes = documents?.map(d => d.document_type) || [];
  const remainingTypes = requiredTypes.filter(type => !uploadedTypes.includes(type));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {!readOnly && remainingTypes.length > 0 && (
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Document Type</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Select document type...</option>
              {remainingTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
          <Button
            variant="outline"
            disabled={!selectedType}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.xls,.xlsx"
          />
        </div>
      )}

      {documents?.length === 0 ? (
        <Alert>
          <AlertDescription>No documents uploaded yet</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-2">
          {documents?.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">{doc.file_name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatBytes(doc.file_size)} • {doc.file_type.toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="capitalize">
                  {doc.document_type.toLowerCase().replace(/_/g, ' ')}
                </Badge>
                {!readOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(doc.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {requiredTypes.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Required Documents</h3>
          <div className="space-y-1">
            {requiredTypes.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Badge variant={uploadedTypes.includes(type) ? 'success' : 'outline'}>
                  {type.replace(/_/g, ' ')}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 