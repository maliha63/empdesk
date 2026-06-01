import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "blue" | "green" | "amber" | "red" | "purple" | "slate";
}

const variants = {
  blue:   "bg-brand-500/10 text-brand-500 border-brand-500/20",
  green:  "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  amber:  "bg-amber-400/10 text-amber-400 border-amber-400/20",
  red:    "bg-red-400/10 text-red-400 border-red-400/20",
  purple: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  slate:  "bg-slate-400/10 text-slate-400 border-slate-400/20",
};

export function Badge({ children, variant = "slate" }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${variants[variant]}`}>
      {children}
    </span>
  );
}