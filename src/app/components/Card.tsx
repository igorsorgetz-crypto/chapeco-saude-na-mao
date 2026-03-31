import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'highlight' | 'elevated';
  className?: string;
  onClick?: () => void;
}

export function Card({ children, variant = 'default', className = '', onClick }: CardProps) {
  const baseClasses = 'bg-white rounded-lg p-4 transition-all duration-300';
  
  const variantClasses = {
    default: 'shadow-sm hover:shadow-md',
    highlight: 'shadow-sm hover:shadow-md border-l-4 border-[#1B7C3E]',
    elevated: 'shadow-md hover:shadow-lg',
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
