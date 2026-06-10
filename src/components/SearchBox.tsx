import { Search, X } from "lucide-react";

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

export default function SearchBox({
  value,
  onChange,
  placeholder = "Search...",
  onClear,
}: SearchBoxProps) {
  return (
    <div className="relative flex-1 max-w-sm">
      <Search
        size={16}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--text-muted)"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-8 py-2 text-sm border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary) placeholder-[--text-muted] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-[#1f2a3d] rounded transition-colors"
        >
          <X size={14} className="text-(--text-muted)" />
        </button>
      )}
    </div>
  );
}
