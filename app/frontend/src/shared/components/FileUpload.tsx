import { useRef, useState, type DragEvent } from 'react';
import clsx from 'clsx';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  className?: string;
}

export const FileUpload = ({
  onFilesSelected,
  accept = 'image/*',
  multiple = true,
  disabled = false,
  className,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={clsx(
        'flex min-h-[200px] cursor-pointer flex-col items-center justify-center',
        'rounded-lg border-2 border-dashed p-8 transition-all',
        {
          'border-accent-light bg-accent-light/10 dark:border-accent-dark dark:bg-accent-dark/10':
            isDragging && !disabled,
          'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500':
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
      />

      <svg
        className="mb-4 h-16 w-16 text-gray-400 dark:text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {isDragging ? (
          <span className="font-semibold">Drop images here</span>
        ) : (
          <>
            <span className="font-semibold">Click to upload</span> or drag and drop
          </>
        )}
      </p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
        PNG, JPG, JPEG (Multiple files supported)
      </p>
    </div>
  );
};
