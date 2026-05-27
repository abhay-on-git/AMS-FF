import React, { useState, useRef, useCallback } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../ui/sheet';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  CloudUpload as UploadCloud,
  InsertDriveFile as FileIcon,
  PictureAsPdf as FilePdf,
  Image as FileImage,
  Description as FileText,
  Close as X,
  CheckCircle,
  Warning as AlertCircle,
  Delete as Trash2,
} from '@mui/icons-material';
import { toast } from 'sonner';

interface UploadFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  errorMessage?: string;
}

interface FileUploadDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  /** Maximum file size in MB */
  maxFileSize?: number;
  /** Accepted file types (MIME patterns) */
  acceptedTypes?: string[];
  /** Maximum number of files */
  maxFiles?: number;
  /** Reference ID for the parent entity (survey/disposal/inspection) */
  referenceId?: string;
  onUploadComplete?: (files: { name: string; size: number; type: string }[]) => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getFileIcon = (type: string) => {
  if (type.includes('pdf')) return <FilePdf className="w-5 h-5 text-red-500" />;
  if (type.startsWith('image/')) return <FileImage className="w-5 h-5 text-blue-500" />;
  if (type.includes('text') || type.includes('csv')) return <FileText className="w-5 h-5 text-green-500" />;
  return <FileIcon className="w-5 h-5 text-gray-500" />;
};

export function FileUploadDrawer({
  open,
  onOpenChange,
  title = 'Upload Documents',
  description = 'Drag and drop files or browse to upload supporting documents.',
  maxFileSize = 25,
  acceptedTypes = ['application/pdf', 'image/*', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
  maxFiles = 10,
  referenceId,
  onUploadComplete,
}: FileUploadDrawerProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File exceeds ${maxFileSize}MB limit`;
    }
    // Basic type check (allow wildcards like image/*)
    const isAccepted = acceptedTypes.some(pattern => {
      if (pattern.endsWith('/*')) {
        return file.type.startsWith(pattern.replace('/*', '/'));
      }
      return file.type === pattern;
    });
    if (!isAccepted) {
      return 'File type not supported';
    }
    return null;
  };

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const remaining = maxFiles - files.length;
    if (remaining <= 0) {
      toast.warning(`Maximum ${maxFiles} files allowed`);
      return;
    }
    const toAdd = fileArray.slice(0, remaining);
    if (fileArray.length > remaining) {
      toast.warning(`Only ${remaining} more file(s) can be added`);
    }

    const uploadFiles: UploadFile[] = toAdd.map(file => {
      const error = validateFile(file);
      return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        progress: error ? 0 : 0,
        status: error ? 'error' : 'pending',
        errorMessage: error || undefined,
      };
    });

    setFiles(prev => [...prev, ...uploadFiles]);
  }, [files.length, maxFiles, maxFileSize, acceptedTypes]);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const simulateUpload = useCallback(() => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
      toast.warning('No files to upload');
      return;
    }

    // Set all pending to uploading
    setFiles(prev => prev.map(f => f.status === 'pending' ? { ...f, status: 'uploading' as const } : f));

    // Simulate progress for each file
    pendingFiles.forEach(pf => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map(f =>
            f.id === pf.id ? { ...f, progress: 100, status: 'complete' as const } : f
          ));
        } else {
          setFiles(prev => prev.map(f =>
            f.id === pf.id ? { ...f, progress: Math.min(progress, 99) } : f
          ));
        }
      }, 400 + Math.random() * 300);
    });
  }, [files]);

  const handleDone = () => {
    const completed = files.filter(f => f.status === 'complete');
    if (onUploadComplete) {
      onUploadComplete(completed.map(f => ({ name: f.name, size: f.size, type: f.type })));
    }
    toast.success(`${completed.length} file(s) uploaded successfully`);
    setFiles([]);
    onOpenChange(false);
  };

  // Drag handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const completedCount = files.filter(f => f.status === 'complete').length;
  const hasErrors = files.some(f => f.status === 'error');
  const allDone = files.length > 0 && files.every(f => f.status === 'complete' || f.status === 'error');
  const isUploading = files.some(f => f.status === 'uploading');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="!w-full sm:!max-w-lg flex flex-col">
        <SheetHeader className="pr-8">
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription className="text-[15px]">
            Upload a CSV or Excel file containing asset data.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowse}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? 'border-[#EF652B] bg-[#EF652B]/5'
                : 'border-muted-foreground/25/40/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={acceptedTypes.join(',')}
              onChange={handleFileInputChange}
            />
            <UploadCloud className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-[#EF652B]' : 'text-muted-foreground/50'}`} />
            <p className="text-[15px] mb-1">
              {isDragging ? (
                <span className="text-[#EF652B]">Drop file here</span>
              ) : (
                <>
                  <span className="text-[#EF652B] underline">Browse file</span> or drag and drop
                </>
              )}
            </p>
            <p className="text-[14px] text-muted-foreground">
              CSV, Excel up to {maxFileSize}MB
            </p>
          </div>

          {/* File Summary */}
          {files.length > 0 && (
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>1 file selected</span>
              <span>
                {completedCount > 0 && (
                  <Badge className="bg-green-500/10 text-green-700 dark:text-green-300 text-[10px]">
                    Uploaded
                  </Badge>
                )}
              </span>
            </div>
          )}

          {/* File List */}
          <div className="space-y-2">
            {files.map(file => (
              <div
                key={file.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  file.status === 'error'
                    ? 'border-red-200 bg-red-50/50 dark:border-red-800/30 dark:bg-red-900/10'
                    : file.status === 'complete'
                    ? 'border-green-200 bg-green-50/50 dark:border-green-800/30 dark:bg-green-900/10'
                    : 'border-border'
                }`}
              >
                <div className="mt-0.5">{getFileIcon(file.type)}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] truncate">{file.name}</p>
                  <p className="text-[14px] text-muted-foreground">{formatFileSize(file.size)}</p>
                  {file.status === 'uploading' && (
                    <div className="mt-1.5">
                      <Progress value={file.progress} className="h-1.5" />
                      <p className="text-xs text-muted-foreground mt-0.5">{Math.round(file.progress)}%</p>
                    </div>
                  )}
                  {file.status === 'error' && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle className="w-3 h-3 text-red-500" />
                      <p className="text-xs text-red-600 dark:text-red-400">{file.errorMessage}</p>
                    </div>
                  )}
                  {file.status === 'complete' && (
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <p className="text-xs text-green-600 dark:text-green-400">Upload complete</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  disabled={file.status === 'uploading'}
                  className="p-1 rounded disabled:opacity-30 transition-colors"
                >
                  {file.status === 'complete' ? (
                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="border-t bg-background p-4 flex justify-between gap-2">
          <Button
            variant="outline"
            className="ml-auto text-[15px]"
            onClick={() => {
              setFiles([]);
              onOpenChange(false);
            }}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <div className="flex gap-2">
            {!allDone && (
              <Button
                onClick={simulateUpload}
                disabled={isUploading || files.filter(f => f.status === 'pending').length === 0}
                className="text-[15px]"
              >
                <UploadCloud className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Upload File'}
              </Button>
            )}
            {allDone && completedCount > 0 && (
              <Button onClick={handleDone} className="text-[15px]">
                <CheckCircle className="w-4 h-4 mr-2" />
                Done
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

