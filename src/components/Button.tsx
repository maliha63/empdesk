import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "danger";
  size?: "sm" | "md" | "lg";
}

export default function Button({ 
  children, 
  icon, 
  variant = "primary", 
  size = "md", 
  className = "", 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={`flex items-center gap-2 text-[13px] font-semibold rounded-xl transition-all duration-150
        ${variant === "primary" 
          ? "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-[0_2px_8px_rgb(59_130_246/0.35)] hover:shadow-[0_4px_12px_rgb(59_130_246/0.4)] hover:-translate-y-px" 
          : "bg-red-600 hover:bg-red-700 text-white"}
        ${size === "sm" ? "px-4 py-2 text-sm" : "px-5 py-2.5"}
        ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}