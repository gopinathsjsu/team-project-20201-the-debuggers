import React, { useState, useEffect } from 'react';

type ToastProps = {
  message: string;
  duration: number; // duration to show the toast in milliseconds
  onClose: () => void;
};

const Toast = ({ message, duration, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-lg">
      {message}
    </div>
  );
};

export default Toast;
