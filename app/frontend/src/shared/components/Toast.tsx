import { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface ToastProps {
  id?: string;
  type?: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Toast({
  type = 'info',
  title,
  message,
  duration = 5000,
  onClose,
  action,
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const icons = {
    success: CheckCircleIcon,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon,
    info: InformationCircleIcon,
  };

  const Icon = icons[type];

  const typeClasses = {
    success: 'bg-success-bg dark:bg-success-dark-bg border-success text-success-dark dark:text-success-light',
    warning: 'bg-warning-bg dark:bg-warning-dark-bg border-warning text-warning-dark dark:text-warning-light',
    error: 'bg-error-bg dark:bg-error-dark-bg border-error text-error-dark dark:text-error-light',
    info: 'bg-info-bg dark:bg-info-dark-bg border-info text-info-dark dark:text-info-light',
  };

  const iconColorClasses = {
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-error',
    info: 'text-info',
  };

  return (
    <div
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg',
        'transition-all duration-300 ease-out',
        typeClasses[type],
        isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0 animate-slide-in-right'
      )}
      role="alert"
    >
      <Icon className={clsx('h-6 w-6 flex-shrink-0', iconColorClasses[type])} />

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold mb-1">{title}</h4>
        {message && <p className="text-sm opacity-90">{message}</p>}

        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline"
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Close notification"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<ToastProps & { id: string }>;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export function ToastContainer({ toasts, position = 'top-right' }: ToastContainerProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <div
      className={clsx(
        'fixed z-tooltip flex flex-col gap-3 w-full max-w-sm pointer-events-none',
        positionClasses[position]
      )}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
}
