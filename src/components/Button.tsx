import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  icon?: ReactNode;
  variant?: "primary" | "danger" | "secondary";
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
      className={`flex items-center justify-center gap-2 text-[13px] font-semibold rounded-xl transition-all duration-150
        ${
          variant === "primary"
            ? "bg-gray-900 text-white border border-gray-900 hover:bg-gray-800 active:bg-gray-950 dark:bg-white dark:text-gray-900 dark:border-white dark:hover:bg-gray-100 dark:active:bg-gray-200"
            : variant === "danger"
              ? "bg-red-600 hover:bg-red-700 text-white border border-red-600 active:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600"
              : "bg-gray-100 text-gray-900 border border-gray-300 hover:bg-gray-200 active:bg-gray-300 dark:bg-[#1f2a3d] dark:text-white dark:border-[#374152] dark:hover:bg-[#2d3a52] dark:active:bg-[#3d4a62]"
        }
        ${size === "sm" ? "px-3 py-1.5 text-xs" : size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm"}
        ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
