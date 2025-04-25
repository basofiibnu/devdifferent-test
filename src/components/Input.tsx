import React from 'react';

interface InputProps {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

export default function Input({
  type,
  value,
  onChange,
  placeholder,
}: InputProps) {
  return (
    <input
      className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}
