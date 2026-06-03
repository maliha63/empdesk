import type { ReactNode } from "react";

interface BadgeProps {
  children:   ReactNode;
  variant?:   "blue" | "green" | "amber" | "red" | "purple" | "slate" | "indigo" | "teal";
  dot?:       boolean;
  size?:      "sm" | "md";
}

const variants: Record<string, string> = {
  blue:   "bg-blue-50   text-blue-600   border-blue-100/80   dark:bg-blue-500/10  dark:text-blue-400   dark:border-blue-500/20",
  green:  "bg-emerald-50  text-emerald-600  border-emerald-100/80  dark:bg-emerald-500/10 dark:text-emerald-400  dark:border-emerald-500/20",
  amber:  "bg-amber-50  text-amber-600  border-amber-100/80  dark:bg-amber-500/10  dark:text-amber-400  dark:border-amber-500/20",
  red:    "bg-red-50    text-red-600    border-red-100/80    dark:bg-red-500/10   dark:text-red-400    dark:border-red-500/20",
  purple: "bg-purple-50 text-purple-600 border-purple-100/80 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20",
  slate:  "bg-slate-50  text-slate-500  border-slate-200/80  dark:bg-slate-800/40 dark:text-slate-400  dark:border-slate-700/50",
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100/80 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
  teal:   "bg-teal-50   text-teal-600   border-teal-100/80   dark:bg-teal-500/10  dark:text-teal-400   dark:border-teal-500/20",
};

const dotColors: Record<string, string> = {
  blue:   "bg-blue-500",
  green:  "bg-emerald-500",
  amber:  "bg-amber-500",
  red:    "bg-red-500",
  purple: "bg-purple-500",
  slate:  "bg-slate-400",
  indigo: "bg-indigo-500",
  teal:   "bg-teal-500",
};

export function Badge({ children, variant = "slate", dot = false, size = "sm" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium border
        ${size === "sm" ? "px-2 py-0.5 text-[11px] rounded-full" : "px-2.5 py-1 text-xs rounded-lg"}
        ${variants[variant]}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}