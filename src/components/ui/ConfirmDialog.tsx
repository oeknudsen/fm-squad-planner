import { X, AlertTriangle } from 'lucide-react';
import { Card } from './Card';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantColors = {
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    info: 'bg-blue-600 hover:bg-blue-700',
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <Card
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 p-2 rounded-full ${
            variant === 'danger' 
              ? 'bg-red-100 dark:bg-red-900/30' 
              : variant === 'warning'
              ? 'bg-amber-100 dark:bg-amber-900/30'
              : 'bg-blue-100 dark:bg-blue-900/30'
          }`}>
            <AlertTriangle
              size={24}
              className={
                variant === 'danger'
                  ? 'text-red-600 dark:text-red-400'
                  : variant === 'warning'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-blue-600 dark:text-blue-400'
              }
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {message}
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors"
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${variantColors[variant]}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

