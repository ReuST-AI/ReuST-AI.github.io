import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'rounded-md px-6 py-2.5 font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        {
          'bg-accent-light text-white hover:bg-red-600 focus:ring-accent-light dark:bg-accent-dark dark:hover:bg-red-500':
            variant === 'primary' && !disabled,
          'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600':
            variant === 'secondary' && !disabled,
          'cursor-not-allowed border-2 border-red-200 bg-gray-100 text-red-200 dark:border-red-900 dark:bg-gray-800 dark:text-red-900':
            disabled,
          'w-full': fullWidth,
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
