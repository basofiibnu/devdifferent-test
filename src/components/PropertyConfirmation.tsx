import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  disableActions?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  disableActions = false,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <p className="text-gray-800 dark:text-gray-100 mb-4">
          {message}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            disabled={disableActions}
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={disableActions}
            onClick={onConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 dark:hover:bg-red-500 disabled:opacity-50"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
