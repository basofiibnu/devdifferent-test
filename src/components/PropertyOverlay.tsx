import React from 'react';

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
    <div className="w-min bg-white dark:bg-black p-4 rounded shadow cursor-pointer transition-transform transform hover:scale-105">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        onClick={onClose}
      >
        ✕
      </button>
      <img
        src={property?.image_url ?? ''}
        alt="Preview"
        className="w-40 h-24 rounded mb-2"
      />
      <div className="text-sm text-gray-800 dark:text-gray-100 mb-2">
        <p className="font-bold">{`$${property?.price}`}</p>
        <p>{`Lat: ${property?.latitude}`}</p>
        <p>{`Lng: ${property?.longitude}`}</p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={onUpdate}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 dark:hover:bg-blue-500"
        >
          Update
        </button>
        <button
          onClick={onDelete}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 dark:hover:bg-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
