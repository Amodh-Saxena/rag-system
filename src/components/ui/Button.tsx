import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-xs font-code tracking-widest uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#2D6A73] disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2";
    
    const variants = {
      primary: "bg-[#17202A] text-[#F4F1E8] hover:bg-[#17202A]/90 dark:bg-[#E8E4D8] dark:text-[#121719] dark:hover:bg-[#E8E4D8]/90",
      secondary: "bg-surface-color text-text-color hover:bg-surface-color/80",
      outline: "border border-border-color bg-transparent hover:bg-surface-color text-text-color"
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
