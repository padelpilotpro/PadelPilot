import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Toast } from '../types';

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export const ToastComponent = ({ toast, onDismiss }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />
  };

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg ${bgColors[toast.type]} animate-slide-in`}>
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <span className="text-sm font-medium text-gray-800">{toast.message}</span>
        <button
          onClick={() => onDismiss(toast.id)}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};