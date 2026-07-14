import React, { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-md',
  showClose = true
}) {
  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 no-print">
      <div 
        className="fixed inset-0 bg-transparent" 
        onClick={onClose}
      />
      <div className={`
        relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 w-full ${maxWidth} z-10
        animate-in fade-in zoom-in-95 duration-200
      `}>
        {/* Modal Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            {title ? (
              <h3 className="font-outfit font-extrabold text-slate-850 dark:text-slate-100 text-base">
                {title}
              </h3>
            ) : <div />}
            {showClose && (
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-slate-655 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close modal"
              >
                <FiX size={16} />
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="text-xs text-slate-600 dark:text-slate-400">
          {children}
        </div>
      </div>
    </div>
  );
}
