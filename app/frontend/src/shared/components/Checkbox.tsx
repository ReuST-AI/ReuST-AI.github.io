import { type InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => {
    return (
      <label className="flex cursor-pointer items-center space-x-2">
        <input
          ref={ref}
          type="checkbox"
          className={clsx(
            'h-5 w-5 cursor-pointer rounded border-gray-300 text-accent-light',
            'focus:ring-2 focus:ring-accent-light focus:ring-offset-2',
            'dark:border-gray-600 dark:bg-gray-700 dark:text-accent-dark dark:focus:ring-accent-dark',
            className
          )}
          {...props}
        />
        <span className="text-sm">{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
