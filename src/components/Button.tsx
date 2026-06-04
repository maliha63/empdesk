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
          ? "bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 active:bg-gray-950 dark:bg-white dark:text-gray-900 dark:border-white dark:hover:bg-gray-100 dark:active:bg-gray-200" 
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