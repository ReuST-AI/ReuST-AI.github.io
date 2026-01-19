import clsx from 'clsx';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  color?: 'primary' | 'white' | 'gray';
  text?: string;
  className?: string;
}

export function Loader({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  className,
}: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorClasses = {
    primary: 'border-accent-primary',
    white: 'border-white',
    gray: 'border-gray-400 dark:border-gray-600',
  };

  if (variant === 'spinner') {
    return (
      <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
        <div
          className={clsx(
            'animate-spin rounded-full border-4 border-t-transparent',
            sizeClasses[size],
            colorClasses[color]
          )}
          role="status"
          aria-label="Loading"
        />
        {text && (
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'dots') {
    const dotSize = {
      sm: 'w-1.5 h-1.5',
      md: 'w-2.5 h-2.5',
      lg: 'w-3.5 h-3.5',
      xl: 'w-4 h-4',
    };

    return (
      <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
        <div className="flex items-center gap-2" role="status" aria-label="Loading">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={clsx(
                'rounded-full animate-pulse',
                dotSize[size],
                color === 'primary' && 'bg-accent-primary',
                color === 'white' && 'bg-white',
                color === 'gray' && 'bg-gray-400 dark:bg-gray-600'
              )}
              style={{
                animationDelay: `${index * 150}ms`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
        {text && (
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {text}
          </p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
        <div
          className={clsx(
            'rounded-full animate-pulse',
            sizeClasses[size],
            color === 'primary' && 'bg-accent-primary',
            color === 'white' && 'bg-white',
            color === 'gray' && 'bg-gray-400 dark:bg-gray-600'
          )}
          role="status"
          aria-label="Loading"
        />
        {text && (
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
            {text}
          </p>
        )}
      </div>
    );
  }

  return null;
}

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({ variant = 'text', width, height, className }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={clsx('skeleton', variantClasses[variant], className)}
      style={style}
      role="status"
      aria-label="Loading content"
    />
  );
}
