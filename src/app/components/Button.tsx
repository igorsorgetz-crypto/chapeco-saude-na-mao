import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'motion/react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
  size?: 'default' | 'small';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', className = '', disabled, children, ...props }, ref) => {
    const baseClasses = 'rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variantClasses = {
      primary: 'bg-[#1B7C3E] text-white hover:bg-[#156630] focus:ring-[#1B7C3E] disabled:bg-gray-300',
      secondary: 'bg-gray-200 text-[#2C3E50] hover:bg-gray-300 focus:ring-gray-400 disabled:bg-gray-100',
      tertiary: 'bg-transparent text-[#1B7C3E] hover:bg-gray-100 focus:ring-[#1B7C3E] disabled:text-gray-400',
      destructive: 'bg-[#E74C3C] text-white hover:bg-[#c0392b] focus:ring-[#E74C3C] disabled:bg-gray-300',
    };
    
    const sizeClasses = {
      default: 'h-12 px-6',
      small: 'h-8 px-4 text-sm',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} disabled:cursor-not-allowed`}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
