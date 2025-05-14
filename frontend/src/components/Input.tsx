import React from 'react';

type InputProps = {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
};

const Input: React.FC<InputProps> = ({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  required = false,
}) => {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="block font-medium mb-1">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-400 ${className}`}
      />
    </div>
  );
};

export default Input;
