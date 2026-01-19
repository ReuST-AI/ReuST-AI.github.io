import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block pt-2.5 text-sm font-medium" htmlFor={props.id}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={clsx(
            'w-full rounded-md border px-3 py-2.5 transition-colors',
            'focus:outline-none focus:ring-2',
            'bg-gray-100 dark:bg-gray-700',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-accent-light dark:border-gray-600 dark:focus:ring-accent-dark',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
