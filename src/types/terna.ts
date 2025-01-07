export type FileType = 'schedule' | 'production' | 'settlement' | 'metering';
export type FileDirection = 'inbound' | 'outbound';
export type FileStatus = 'pending' | 'processed' | 'error' | 'success';

export interface TernaFile {
  id: string;
  type: FileType;
  direction: FileDirection;
  filename: string;
  uploadedAt: string;
  processedAt?: string;
  status: FileStatus;
  errorMessage?: string;
  metadata?: {
    timeRange?: {
      start: string;
      end: string;
    };
    siteId?: string;
    version?: string;
  };
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
}