import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  className?: string;
}

export function Badge({ children, status, className = '' }: BadgeProps) {
  const statusClasses = {
    confirmed: 'bg-[#4CAF50] text-white',
    pending: 'bg-[#FF9800] text-white',
    cancelled: 'bg-gray-400 text-white',
    completed: 'bg-[#2196F3] text-white',
  };

  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]} ${className}`}
    >
      {children}
    </span>
  );
}
