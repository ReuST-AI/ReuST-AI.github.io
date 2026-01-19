import { type ReactNode, type HTMLAttributes } from 'react';
import clsx from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  icon?: ReactNode;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  icon,
  className,
  ...props
}: BadgeProps) {
  const variantClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    error: 'badge-error',
    info: 'badge-info',
    default: 'bg-gray-100 dark:bg-brand-steel-700 text-gray-700 dark:text-gray-300',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };

  return (
    <span
      className={clsx(
        'badge',
        variantClasses[variant],
        sizeClasses[size],
        'inline-flex items-center gap-1',
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={clsx(
            'inline-block w-1.5 h-1.5 rounded-full',
            variant === 'success' && 'bg-success',
            variant === 'warning' && 'bg-warning',
            variant === 'error' && 'bg-error',
            variant === 'info' && 'bg-info',
            variant === 'default' && 'bg-gray-500 dark:bg-gray-400'
          )}
        />
      )}
      {icon && <span className="inline-flex items-center">{icon}</span>}
      {children}
    </span>
  );
}
