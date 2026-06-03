import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  label: string;
  value: string;
}

interface DropdownProps {
  options:         Option[];
  value:           string;
  onChange:        (value: string) => void;
  placeholder?:    string;
  className?:      string;
  variant?:        "default" | "pill";
  pillColorClass?: string;
}

export function Dropdown({
  options,
  value,
  onChange,
  placeholder = "Select",
  className = "",
  variant = "default",
  pillColorClass = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  const selected = options.find((o) => o.value === value);

  if (variant === "pill") {
    return (
      <div ref={ref} className="relative inline-block">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full
            transition-colors ${pillColorClass}`}
        >
          {selected?.label ?? value}
          <ChevronDown
            size={10}
            className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          />
        </button>
        {open && (
          <div className="absolute left-0 top-full mt-1 z-50 min-w-27.5
            bg-white dark:bg-[#171c27]
            border border-[#e2e8f0] dark:border-[#232a3a]
            rounded-lg shadow-lg py-1 overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors
                  ${opt.value === value
                    ? "text-gray-900 dark:text-white bg-gray-50 dark:bg-white/5"
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/4"
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between
          bg-[#f8fafc] dark:bg-[#0f1117]
          border rounded-lg px-3 py-2 text-sm outline-none transition-colors
          ${open
            ? "border-brand-500"
            : "border-[#e2e8f0] dark:border-[#232a3a] hover:border-[#cbd5e1] dark:hover:border-[#2e3749]"
          }
          ${!selected
            ? "text-gray-400 dark:text-slate-500"
            : "text-gray-900 dark:text-slate-200"
          }`}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          size={14}
          className={`text-gray-400 dark:text-slate-500 shrink-0 ml-2 transition-transform duration-150
            ${open ? "rotate-180 text-brand-500" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-full
          bg-white dark:bg-[#171c27]
          border border-[#e2e8f0] dark:border-[#232a3a]
          rounded-lg shadow-lg py-1 overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors
                ${opt.value === value
                  ? "text-gray-900 dark:text-white bg-brand-50 dark:bg-brand-500/15 font-medium"
                  : "text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/4"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}