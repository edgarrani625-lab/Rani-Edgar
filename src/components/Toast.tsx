import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-20 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none no-print">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-center justify-between gap-3 rounded-lg border p-3.5 shadow-lg text-xs transition-all ${
        toast.type === 'success'
          ? 'border-emerald-200 bg-white text-emerald-950 dark:border-emerald-900/60 dark:bg-slate-900 dark:text-emerald-200'
          : toast.type === 'error'
          ? 'border-rose-200 bg-white text-rose-950 dark:border-rose-900/60 dark:bg-slate-900 dark:text-rose-200'
          : 'border-blue-200 bg-white text-blue-950 dark:border-blue-900/60 dark:bg-slate-900 dark:text-blue-200'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {toast.type === 'success' && (
          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
        )}
        {toast.type === 'error' && (
          <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" aria-hidden="true" />
        )}
        {toast.type === 'info' && (
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" aria-hidden="true" />
        )}
        <span className="font-medium">{toast.message}</span>
      </div>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss toast"
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
};
