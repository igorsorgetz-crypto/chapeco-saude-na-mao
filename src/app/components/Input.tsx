import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block mb-2 text-[#2C3E50]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full h-12 px-4 bg-white border rounded-lg transition-all duration-300 
            focus:outline-none focus:ring-2 focus:ring-[#0066CC] focus:border-transparent
            ${error ? 'border-[#E74C3C]' : 'border-gray-300'}
            ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[#E74C3C]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
