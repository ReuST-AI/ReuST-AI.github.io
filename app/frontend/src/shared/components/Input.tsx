import { type InputHTMLAttributes, forwardRef, type ReactNode } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  success?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, icon, iconPosition = 'left', success, className, required, ...props }, ref) => {
    const hasError = !!error;
    const hasSuccess = success && !hasError;

    return (
      <div className="w-full">
        {label && (
          <label
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-200"
            htmlFor={props.id}
          >
            {label}
            {required && <span className="ml-1 text-error">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={clsx(
              'input',
              'w-full',
              icon && iconPosition === 'left' && 'pl-10',
              icon && iconPosition === 'right' && 'pr-10',
              hasError && 'input-error',
              hasSuccess && 'border-success focus:ring-success focus:border-success',
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              error ? `${props.id}-error` : helpText ? `${props.id}-help` : undefined
            }
            required={required}
            {...props}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          {hasSuccess && !icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
          {hasError && !icon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-error">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1.5 text-sm text-error animate-slide-in-top" id={`${props.id}-error`}>
            {error}
          </p>
        )}
        {helpText && !error && (
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400" id={`${props.id}-help`}>
            {helpText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
