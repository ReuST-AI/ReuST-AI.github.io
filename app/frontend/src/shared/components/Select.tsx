import { type SelectHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder = 'Please select', error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block pt-2.5 text-sm font-medium" htmlFor={props.id}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={clsx(
            'w-full rounded-md border px-3 py-2.5 font-sans transition-colors',
            'focus:outline-none focus:ring-2',
            'bg-gray-100 dark:bg-gray-700',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 hover:border-white focus:ring-accent-light dark:border-gray-600 dark:hover:border-white dark:focus:ring-accent-dark',
            className
          )}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
