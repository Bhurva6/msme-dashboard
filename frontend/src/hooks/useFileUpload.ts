import { useState, useCallback } from 'react';

interface UseFileUploadOptions {
  maxSize?: number; // in MB
  allowedTypes?: string[];
  onSuccess?: (file: File) => void;
  onError?: (error: string) => void;
}

interface UseFileUploadReturn {
  file: File | null;
  preview: string | null;
  uploading: boolean;
  error: string | null;
  progress: number;
  selectFile: (file: File) => void;
  clearFile: () => void;
  validateAndSetFile: (file: File) => boolean;
}

export const useFileUpload = (options: UseFileUploadOptions = {}): UseFileUploadReturn => {
  const {
    maxSize = 10, // 10MB default
    allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    onSuccess,
    onError,
  } = options;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const validateFile = useCallback(
    (file: File): { valid: boolean; error?: string } => {
      // Check file size
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSize) {
        return {
          valid: false,
          error: `File size must be less than ${maxSize}MB. Current size: ${fileSizeMB.toFixed(2)}MB`,
        };
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        const allowedExtensions = allowedTypes
          .map((type) => {
            if (type === 'application/pdf') return 'PDF';
            if (type.startsWith('image/')) return type.split('/')[1].toUpperCase();
            return type;
          })
          .join(', ');
        return {
          valid: false,
          error: `Invalid file type. Allowed types: ${allowedExtensions}`,
        };
      }

      return { valid: true };
    },
    [maxSize, allowedTypes]
  );

  const generatePreview = useCallback((file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      setPreview('pdf'); // Use a PDF icon/placeholder
    } else {
      setPreview(null);
    }
  }, []);

  const validateAndSetFile = useCallback(
    (selectedFile: File): boolean => {
      setError(null);
      setProgress(0);

      const validation = validateFile(selectedFile);

      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        onError?.(validation.error || 'Invalid file');
        return false;
      }

      setFile(selectedFile);
      generatePreview(selectedFile);
      onSuccess?.(selectedFile);
      return true;
    },
    [validateFile, generatePreview, onSuccess, onError]
  );

  const selectFile = useCallback(
    (selectedFile: File) => {
      validateAndSetFile(selectedFile);
    },
    [validateAndSetFile]
  );

  const clearFile = useCallback(() => {
    setFile(null);
    setPreview(null);
    setError(null);
    setProgress(0);
    setUploading(false);
  }, []);

  return {
    file,
    preview,
    uploading,
    error,
    progress,
    selectFile,
    clearFile,
    validateAndSetFile,
  };
};
