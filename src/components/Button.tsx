import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function Button({
  onClick,
  children,
  className,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-lg transition ${className}`}
    >
      {children}
    </button>
  );
}
