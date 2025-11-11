import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className = '', children, ...props }: SelectProps) {
  const selectElement = (
    <select
      className={`w-auto px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    >
      {children}
    </select>
  );

  if (label) {
    return (
      <label className="block">
        <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </span>
        {selectElement}
      </label>
    );
  }

  return selectElement;
}

