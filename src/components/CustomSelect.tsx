import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface CustomSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: Array<{ value: string | number; label: string }>;
  className?: string;
  label?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  className = "",
  label,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 px-4 py-2.5 w-full border border-(--border) 
                   rounded-xl bg-white dark:bg-[#111827] text-(--text-primary) 
                   hover:bg-(--bg-card2) transition-all text-sm font-medium"
      >
        <span className="truncate">
          {selectedOption?.label || label || "Select option"}
        </span>
        <ChevronDown
          size={16}
          className={`text-(--text-secondary) transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-[#111827] border border-(--border) 
                        rounded-xl shadow-xl z-50 max-h-65 overflow-auto py-1"
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-(--bg-card2)
                ${
                  value === option.value
                    ? "bg-blue-600 text-white font-medium"
                    : "text-(--text-primary)"
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
