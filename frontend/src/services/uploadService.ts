// Service pour la gestion des uploads de fichiers
import { apiService } from './api';

export interface UploadResponse {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

class UploadService {
  async uploadFile(file: File, type: 'document' | 'image' = 'document'): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const response = await apiService.post('/api/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response as UploadResponse;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Erreur lors de l\'upload du fichier');
    }
  }

  async uploadMultipleFiles(files: File[], type: 'document' | 'image' = 'document'): Promise<UploadResponse[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, type));
    return Promise.all(uploadPromises);
  }

  async deleteFile(fileId: string): Promise<void> {
    try {
      await apiService.delete(`/api/v1/upload/${fileId}`);
    } catch (error) {
      console.error('Delete file error:', error);
      throw new Error('Erreur lors de la suppression du fichier');
    }
  }

  // Validation des fichiers
  validateFile(file: File, type: 'document' | 'image' = 'document'): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    
    if (file.size > maxSize) {
      return { valid: false, error: 'Le fichier est trop volumineux (max 10MB)' };
    }

    if (type === 'document') {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Type de fichier non autorisé (PDF, DOC, DOCX, XLS, XLSX uniquement)' };
      }
    } else if (type === 'image') {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Type d\'image non autorisé (JPG, PNG, GIF, WEBP uniquement)' };
      }
    }

    return { valid: true };
  }

  // Formatage de la taille des fichiers
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Obtenir l'icône pour un type de fichier
  getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    return '📎';
  }
}

export const uploadService = new UploadService();
