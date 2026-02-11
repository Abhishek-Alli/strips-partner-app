/**
 * Upload Service
 *
 * Handles file uploads to the backend/Supabase storage
 */

import { apiClient } from './apiClient';
import { logger } from '../core/logger';

export interface UploadedFile {
  id: string;
  filename: string;
  original_filename: string;
  file_path: string;
  file_url: string;
  mime_type: string;
  file_size: number;
  entity_type?: string;
  entity_id?: string;
  created_at: string;
}

export interface UploadResponse {
  file: UploadedFile;
  url: string;
}

export interface MultipleUploadResponse {
  files: UploadedFile[];
  count: number;
}

export interface UploadOptions {
  entityType?: string;
  entityId?: string;
  onProgress?: (progress: number) => void;
}

export interface AdminUploadOptions extends UploadOptions {
  bucket?: 'admin-uploads' | 'tenders' | 'dealer-uploads' | 'partner-uploads' | 'user-uploads';
  folder?: string;
}

class UploadService {
  /**
   * Upload a single file
   */
  async uploadFile(file: File, options: UploadOptions = {}): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (options.entityType) {
        formData.append('entityType', options.entityType);
      }
      if (options.entityId) {
        formData.append('entityId', options.entityId);
      }

      const response = await apiClient.postFormData<UploadResponse>('/upload', formData, {
        onUploadProgress: options.onProgress
          ? (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              options.onProgress!(progress);
            }
          : undefined,
      });

      return response;
    } catch (error) {
      logger.error('Failed to upload file', error as Error);
      throw error;
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: File[],
    options: UploadOptions = {}
  ): Promise<MultipleUploadResponse> {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append('files', file);
      });

      if (options.entityType) {
        formData.append('entityType', options.entityType);
      }
      if (options.entityId) {
        formData.append('entityId', options.entityId);
      }

      const response = await apiClient.postFormData<MultipleUploadResponse>(
        '/upload/multiple',
        formData,
        {
          onUploadProgress: options.onProgress
            ? (progressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / (progressEvent.total || 1)
                );
                options.onProgress!(progress);
              }
            : undefined,
        }
      );

      return response;
    } catch (error) {
      logger.error('Failed to upload multiple files', error as Error);
      throw error;
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(fileId: string): Promise<void> {
    try {
      await apiClient.delete(`/upload/${fileId}`);
    } catch (error) {
      logger.error('Failed to delete file', error as Error);
      throw error;
    }
  }

  /**
   * Get user's files
   */
  async getUserFiles(entityType?: string): Promise<UploadedFile[]> {
    try {
      const params = entityType ? `?entityType=${entityType}` : '';
      return apiClient.get<UploadedFile[]>(`/upload/my-files${params}`);
    } catch (error) {
      logger.error('Failed to get user files', error as Error);
      throw error;
    }
  }

  /**
   * Get files by entity
   */
  async getFilesByEntity(entityType: string, entityId: string): Promise<UploadedFile[]> {
    try {
      return apiClient.get<UploadedFile[]>(`/upload/entity/${entityType}/${entityId}`);
    } catch (error) {
      logger.error('Failed to get files by entity', error as Error);
      throw error;
    }
  }

  /**
   * Get signed URL for private files
   */
  async getSignedUrl(fileId: string): Promise<{ url: string; expiresIn: number | null }> {
    try {
      return apiClient.get<{ url: string; expiresIn: number | null }>(
        `/upload/${fileId}/signed-url`
      );
    } catch (error) {
      logger.error('Failed to get signed URL', error as Error);
      throw error;
    }
  }

  /**
   * Admin: Upload file to specific bucket
   */
  async adminUpload(file: File, options: AdminUploadOptions = {}): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      if (options.bucket) {
        formData.append('bucket', options.bucket);
      }
      if (options.folder) {
        formData.append('folder', options.folder);
      }
      if (options.entityType) {
        formData.append('entityType', options.entityType);
      }
      if (options.entityId) {
        formData.append('entityId', options.entityId);
      }

      const response = await apiClient.postFormData<UploadResponse>('/upload/admin', formData, {
        onUploadProgress: options.onProgress
          ? (progressEvent) => {
              const progress = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
              );
              options.onProgress!(progress);
            }
          : undefined,
      });

      return response;
    } catch (error) {
      logger.error('Failed to admin upload file', error as Error);
      throw error;
    }
  }

  /**
   * Helper: Validate file before upload
   */
  validateFile(
    file: File,
    options: {
      maxSize?: number;
      allowedTypes?: string[];
    } = {}
  ): { valid: boolean; error?: string } {
    const { maxSize = 50 * 1024 * 1024, allowedTypes } = options;

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`,
      };
    }

    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`,
      };
    }

    return { valid: true };
  }

  /**
   * Helper: Get allowed MIME types for images
   */
  get imageTypes(): string[] {
    return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  }

  /**
   * Helper: Get allowed MIME types for videos
   */
  get videoTypes(): string[] {
    return ['video/mp4', 'video/webm'];
  }

  /**
   * Helper: Get allowed MIME types for documents
   */
  get documentTypes(): string[] {
    return [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
  }
}

export const uploadService = new UploadService();
