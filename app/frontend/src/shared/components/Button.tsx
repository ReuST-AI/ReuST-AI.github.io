import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  const variantClasses = {
    primary: clsx(
      'bg-accent-primary text-white',
      'hover:bg-accent-primary-hover hover:shadow-lg hover:-translate-y-0.5',
      'focus:ring-accent-primary',
      'active:translate-y-0'
    ),
    secondary: clsx(
      'bg-white dark:bg-brand-steel-800',
      'border-2 border-gray-300 dark:border-brand-steel-600',
      'text-gray-700 dark:text-gray-200',
      'hover:bg-gray-50 dark:hover:bg-brand-steel-700 hover:shadow-md hover:-translate-y-0.5',
      'focus:ring-gray-400',
      'active:translate-y-0'
    ),
    ghost: clsx(
      'bg-transparent',
      'text-gray-700 dark:text-gray-200',
      'hover:bg-gray-100 dark:hover:bg-brand-steel-800',
      'focus:ring-gray-400'
    ),
    danger: clsx(
      'bg-error text-white',
      'hover:bg-error-dark hover:shadow-lg hover:-translate-y-0.5',
      'focus:ring-error',
      'active:translate-y-0'
    ),
    success: clsx(
      'bg-success text-white',
      'hover:bg-success-dark hover:shadow-lg hover:-translate-y-0.5',
      'focus:ring-success',
      'active:translate-y-0'
    ),
  };

  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2',
        'rounded-lg font-medium',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-brand-steel-900',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        sizeClasses[size],
        !isDisabled && variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!loading && icon && iconPosition === 'left' && <span>{icon}</span>}
      {children}
      {!loading && icon && iconPosition === 'right' && <span>{icon}</span>}
    </button>
  );
}
