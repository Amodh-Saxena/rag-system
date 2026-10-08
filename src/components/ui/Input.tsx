import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label className="text-xs font-code text-muted-color tracking-widest uppercase">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full border border-border-color bg-bg-color px-3 py-1 text-sm text-text-color font-code shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-color focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2D6A73] disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-[10px] font-code text-[#A84A32]">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
