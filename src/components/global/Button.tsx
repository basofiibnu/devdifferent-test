import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  onClick,
  children,
  className,
  type = 'button',
}: ButtonProps) {
  return (
    <button onClick={onClick} className={className} type={type}>
      {children}
    </button>
  );
}
