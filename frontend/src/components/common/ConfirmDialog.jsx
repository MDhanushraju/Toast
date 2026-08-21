import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmLabel = "Proceed",
  cancelLabel = "Cancel",
  variant = "primary" // primary, danger
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-sm" showClose={false}>
      <div className="space-y-5">
        <p className="text-xs text-slate-600 dark:text-slate-405 leading-relaxed">{message}</p>
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button variant={variant} size="sm" onClick={() => {
            onConfirm();
            onClose();
          }}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
