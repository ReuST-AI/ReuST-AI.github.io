import { useState, type ReactNode } from 'react';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

interface AccordionProps {
  title: string;
  description?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function Accordion({ title, description, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div
      className={clsx(
        'rounded-lg transition-all duration-300',
        isOpen
          ? 'bg-primary-600 dark:bg-primary-700'
          : 'bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-800'
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-4 text-left"
        title={description}
      >
        <h2 className="text-xl font-semibold">{title}</h2>
        <ChevronRightIcon
          className={clsx(
            'h-5 w-5 transition-transform duration-300',
            isOpen && 'rotate-90 transform'
          )}
        />
      </button>

      <div
        className={clsx(
          'overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}
