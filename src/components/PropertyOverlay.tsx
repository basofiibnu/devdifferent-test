import React from 'react';
import Button from './global/Button';

interface PropertyOverlayProps {
  property: any;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

export default function PropertyOverlay({
  property,
  onClose,
  onUpdate,
  onDelete,
}: PropertyOverlayProps) {
  return (
    <div className="relative w-64 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105">
      {/* Close Button */}
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
        onClick={onClose}
        aria-label="Close"
      >
        ✕
      </button>

      <img
        src={property?.image_url ?? 'https://via.placeholder.com/150'}
        alt="Property Preview"
        className="w-full h-32 object-cover rounded-lg mb-4"
      />

      <div className="text-sm text-gray-800 dark:text-gray-100 space-y-1">
        <p className="font-bold text-lg">{`$${property?.price}`}</p>
        <p className="text-gray-600 dark:text-gray-400">{`Latitude: ${property?.latitude}`}</p>
        <p className="text-gray-600 dark:text-gray-400">{`Longitude: ${property?.longitude}`}</p>
      </div>

      <div className="flex justify-between mt-4">
        <Button
          onClick={onUpdate}
          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition"
        >
          Update
        </Button>
        <Button
          onClick={onDelete}
          className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition ml-2"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
