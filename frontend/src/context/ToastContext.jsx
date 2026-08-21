import React, { createContext, useContext, useState, useCallback } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    // Auto-dismiss after 3.5 seconds
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && (
        <div className="fixed bottom-5 right-5 z-55 flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300 no-print">
          <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
            toast.type === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-950/20' :
            toast.type === 'error' ? 'bg-red-50 text-red-500 dark:bg-red-950/20' :
            toast.type === 'warning' ? 'bg-amber-50 text-amber-500 dark:bg-amber-950/20' :
            'bg-blue-50 text-blue-600 dark:bg-blue-950/20'
          }`}>
            {toast.type === 'success' && <FiCheckCircle size={18} />}
            {toast.type === 'error' && <FiAlertCircle size={18} />}
            {toast.type === 'warning' && <FiAlertTriangle size={18} />}
            {toast.type === 'info' && <FiInfo size={18} />}
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{toast.message}</p>
          </div>
          <button 
            onClick={hideToast}
            className="text-slate-400 hover:text-slate-655 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <FiX size={15} />
          </button>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
