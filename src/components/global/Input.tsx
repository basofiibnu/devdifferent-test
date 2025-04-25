import React, { forwardRef } from 'react';

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

// Use `forwardRef` to pass the `ref` from react-hook-form
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type, placeholder, name, className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={
          className ||
          'border border-gray-300 dark:border-gray-700 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
        }
        type={type}
        placeholder={placeholder}
        name={name}
        {...rest}
      />
    );
  }
);

Input.displayName = 'Input';

export default Input;
