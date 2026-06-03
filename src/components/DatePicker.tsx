import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface DatePickerProps {
  value:        string;
  onChange:     (val: string) => void;
  placeholder?: string;
  className?:   string;
  hasError?:    boolean;
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function parseDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s + "T00:00:00");
  return isNaN(d.getTime()) ? null : d;
}

function formatDisplay(s: string) {
  const d = parseDate(s);
  if (!d) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  hasError = false,
}: DatePickerProps) {
  const today = new Date();
  const [open, setOpen]       = useState(false);
  const [viewYear, setYear]   = useState(today.getFullYear());
  const [viewMonth, setMonth] = useState(today.getMonth());
  const ref                   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      const d = parseDate(value);
      if (d) { setYear(d.getFullYear()); setMonth(d.getMonth()); }
    }
  }, [open]);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    function handle(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  function prevMonth() {
    if (viewMonth === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  function buildGrid() {
    const first  = new Date(viewYear, viewMonth, 1).getDay();
    const daysIn = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = Array(first).fill(null);
    for (let d = 1; d <= daysIn; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }

  function selectDay(day: number) {
    const mm = String(viewMonth + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    onChange(`${viewYear}-${mm}-${dd}`);
    setOpen(false);
  }

  function isSelected(day: number | null) {
    if (!day) return false;
    const d = parseDate(value);
    return !!d && d.getFullYear() === viewYear && d.getMonth() === viewMonth && d.getDate() === day;
  }

  function isToday(day: number | null) {
    if (!day) return false;
    return today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;
  }

  const grid = buildGrid();

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between
          bg-[#f8fafc] dark:bg-[#0f1117]
          border rounded-lg px-3 py-2 text-sm outline-none transition-colors
          ${open
            ? "border-brand-500"
            : hasError
              ? "border-red-400 dark:border-red-500"
              : "border-[#e2e8f0] dark:border-[#232a3a] hover:border-[#cbd5e1] dark:hover:border-[#2e3749]"
          }
          ${!value
            ? "text-gray-400 dark:text-slate-500"
            : "text-gray-900 dark:text-slate-200"
          }`}
      >
        <span>{value ? formatDisplay(value) : placeholder}</span>
        <CalendarDays
          size={14}
          className={`shrink-0 ml-2 transition-colors ${open ? "text-brand-500" : "text-gray-400 dark:text-slate-400"}`}
        />
      </button>

      {/* Calendar popover */}
      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-64
          bg-white dark:bg-[#171c27]
          border border-[#e2e8f0] dark:border-[#232a3a]
          rounded-xl shadow-xl p-3">

          {/* Month / year header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg
                text-gray-400 dark:text-slate-400
                hover:text-gray-700 dark:hover:text-white
                hover:bg-gray-100 dark:hover:bg-white/6
                transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-sm font-medium text-gray-900 dark:text-white select-none">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg
                text-gray-400 dark:text-slate-400
                hover:text-gray-700 dark:hover:text-white
                hover:bg-gray-100 dark:hover:bg-white/6
                transition-colors"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-gray-400 dark:text-slate-500 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {grid.map((day, i) => {
              const sel = isSelected(day);
              const tod = isToday(day);
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!day}
                  onClick={() => day && selectDay(day)}
                  className={`h-7 w-full flex items-center justify-center rounded-lg text-xs
                    transition-colors disabled:pointer-events-none
                    ${sel
                      ? "bg-brand-500 text-white font-semibold"
                      : tod
                        ? "text-brand-500 font-semibold ring-1 ring-brand-500/40"
                        : day
                          ? "text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/6 hover:text-gray-900 dark:hover:text-white"
                          : "text-transparent"
                    }`}
                >
                  {day ?? ""}
                </button>
              );
            })}
          </div>

          {/* Today link */}
          <div className="mt-2 pt-2 border-t border-[#e2e8f0] dark:border-[#232a3a] flex justify-end">
            <button
              type="button"
              onClick={() => {
                const y = today.getFullYear();
                const m = String(today.getMonth() + 1).padStart(2, "0");
                const d = String(today.getDate()).padStart(2, "0");
                onChange(`${y}-${m}-${d}`);
                setOpen(false);
              }}
              className="text-xs text-brand-500 hover:text-brand-600 transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}