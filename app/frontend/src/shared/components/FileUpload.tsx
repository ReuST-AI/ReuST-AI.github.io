import { useRef, useState, type DragEvent } from 'react';
import { CloudArrowUpIcon, PhotoIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
  maxSize?: number;
  description?: string;
}

export const FileUpload = ({
  onFilesSelected,
  accept = 'image/*',
  multiple = true,
  disabled = false,
  className,
  maxSize,
  description,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;

    if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
      setIsDragging(false);
    }
  };

  const validateFiles = (files: File[]): File[] => {
    setError(null);
    const validFiles: File[] = [];

    for (const file of files) {
      if (accept === 'image/*' && !file.type.startsWith('image/')) {
        setError('Please upload only image files');
        continue;
      }

      if (maxSize && file.size > maxSize) {
        setError(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    const validFiles = validateFiles(files);

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = validateFiles(files);

      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="File upload area"
        className={clsx(
          'relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center',
          'rounded-xl border-2 border-dashed p-8',
          'transition-all duration-300 ease-out',
          'group',
          {
            'border-accent-primary bg-accent-primary/10 dark:bg-accent-primary/20 scale-[1.02]':
              isDragging && !disabled,
            'border-gray-300 hover:border-accent-primary/50 hover:bg-gray-50 dark:border-brand-steel-600 dark:hover:border-accent-primary/50 dark:hover:bg-brand-steel-800/50':
              !isDragging && !disabled,
            'cursor-not-allowed opacity-50': disabled,
          },
          className
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          disabled={disabled}
          className="hidden"
          aria-hidden="true"
        />

        <div className={clsx(
          'mb-4 transition-transform duration-300',
          isDragging && 'scale-110',
          !disabled && !isDragging && 'group-hover:scale-110'
        )}>
          {isDragging ? (
            <CloudArrowUpIcon className="h-16 w-16 text-accent-primary" />
          ) : (
            <PhotoIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
          )}
        </div>

        <div className="text-center">
          <p className="text-base font-medium text-gray-700 dark:text-gray-200">
            {isDragging ? (
              <span className="text-accent-primary">Drop your files here</span>
            ) : (
              <>
                <span className="text-accent-primary hover:underline">Click to upload</span>
                {' or drag and drop'}
              </>
            )}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {description || 'PNG, JPG, JPEG'}
            {maxSize && ` (Max ${(maxSize / 1024 / 1024).toFixed(0)}MB)`}
            {multiple && ' - Multiple files supported'}
          </p>
        </div>

        {!disabled && (
          <div className={clsx(
            'absolute inset-0 rounded-xl',
            'ring-2 ring-accent-primary/0 group-hover:ring-accent-primary/20',
            'transition-all duration-300'
          )} />
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-error animate-slide-in-top flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};
