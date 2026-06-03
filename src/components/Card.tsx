import type { ReactNode } from "react";

interface CardProps {
  children:   ReactNode;
  className?: string;
  title?:     string;
  subtitle?:  string;
  action?:    ReactNode;
  noPadding?: boolean;
  /** Adds a subtle colored top border accent */
  accent?:    "blue" | "green" | "amber" | "purple" | "none";
  /** Disable hover shadow lift */
  flat?:      boolean;
}

const accentMap: Record<string, string> = {
  blue:   "border-t-2 border-t-blue-400",
  green:  "border-t-2 border-t-emerald-400",
  amber:  "border-t-2 border-t-amber-400",
  purple: "border-t-2 border-t-purple-400",
  none:   "",
};

export default function Card({
  children,
  className = "",
  title,
  subtitle,
  action,
  noPadding,
  accent = "none",
  flat = false,
}: CardProps) {
  return (
    <div
      className={`
        relative
        bg-white dark:bg-[#111827]
        border border-[#e2e8f0] dark:border-[#1f2a3d]
        rounded-2xl
        shadow-[0_1px_3px_0_rgb(0,0,0,0.06),0_1px_2px_-1px_rgb(0,0,0,0.04)]
        dark:shadow-[0_1px_3px_0_rgb(0,0,0,0.4)]
        ${!flat ? "transition-all duration-200 hover:shadow-[0_12px_32px_-4px_rgb(0,0,0,0.10),0_4px_12px_-4px_rgb(0,0,0,0.06)] dark:hover:shadow-[0_12px_32px_-4px_rgb(0,0,0,0.5)] hover:-translate-y-[1px]" : ""}
        ${accentMap[accent]}
        ${noPadding ? "" : "p-5"}
        ${className}
      `}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-gray-400 dark:text-[#4b5e7a] mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}