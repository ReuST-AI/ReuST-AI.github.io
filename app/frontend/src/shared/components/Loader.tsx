import clsx from 'clsx';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Loader({ size = 'md', className }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-4',
    lg: 'h-8 w-8 border-4',
  };

  return (
    <div
      className={clsx(
        'animate-spin rounded-full border-gray-300 border-t-white dark:border-gray-600 dark:border-t-white',
        sizeClasses[size],
        className
      )}
    />
  );
}
