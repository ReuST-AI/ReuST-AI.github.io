import { useState, type ReactNode } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface AccordionProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  badge?: string;
  variant?: 'default' | 'highlighted';
}

export function Accordion({
  title,
  description,
  children,
  defaultOpen = false,
  badge,
  variant = 'default',
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const variantClasses = {
    default: clsx(
      'card',
      isOpen && 'ring-2 ring-accent-primary/20'
    ),
    highlighted: clsx(
      'card',
      isOpen
        ? 'bg-accent-primary/5 dark:bg-accent-primary/10 ring-2 ring-accent-primary/30'
        : 'hover:bg-gray-50 dark:hover:bg-brand-steel-800/70'
    ),
  };

  return (
    <div className={clsx('transition-all duration-300', variantClasses[variant])}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'flex w-full items-center justify-between px-6 py-4 text-left',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-inset rounded-xl',
          'transition-all duration-200'
        )}
        aria-expanded={isOpen}
        title={description}
      >
        <div className="flex items-center gap-3 flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {badge && (
            <span className="badge badge-info">
              {badge}
            </span>
          )}
        </div>
        <ChevronDownIcon
          className={clsx(
            'h-5 w-5 text-gray-500 dark:text-gray-400',
            'transition-transform duration-300 ease-out',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <div
        className={clsx(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-6 pb-6 pt-2">
          {description && !isOpen && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {description}
            </p>
          )}
          <div className={clsx(isOpen && 'animate-fade-in')}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
