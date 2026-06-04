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
        bg-(--bg-card) 
        border border-(--border)
        rounded-2xl
        shadow-(--shadow-card)
        ${!flat ? "transition-all duration-200 hover:shadow-(--shadow-hover) hover:-translate-y-px" : ""}
        ${accentMap[accent]}
        ${noPadding ? "" : "p-5"}
        ${className}
      `}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-(--text-primary)">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-(--text-muted) mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}