import React from 'react';

type CardProps = {
  title: string;
  description?: string;
  imageUrl?: string;
  children?: React.ReactNode;
  className?: string;
};

const Card: React.FC<CardProps> = ({ title, description, imageUrl, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl shadow-md overflow-hidden p-5 ${className}`}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover rounded-xl mb-4"
        />
      )}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && <p className="text-gray-600 mb-3">{description}</p>}
      {children}
    </div>
  );
};

export default Card;
