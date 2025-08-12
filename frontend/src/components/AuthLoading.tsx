import React from 'react';

interface AuthLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AuthLoading: React.FC<AuthLoadingProps> = ({ 
  message = 'Authenticating...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center space-x-3">
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-primary-600 ${sizeClasses[size]}`}></div>
      <span className="text-sm text-gray-600">{message}</span>
    </div>
  );
};

export default AuthLoading;
