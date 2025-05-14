import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-red-600 text-white font-semibold py-3 rounded-xl
                  hover:bg-red-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
