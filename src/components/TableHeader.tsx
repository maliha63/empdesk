import { ChevronUp, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: T, index?: number) => ReactNode;
}

interface TableHeaderProps<T> {
  columns: Column<T>[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
}

export default function TableHeader<T>({
  columns,
  sortBy,
  sortOrder,
  onSort,
}: TableHeaderProps<T>) {
  const handleSort = (key: string, sortable?: boolean) => {
    if (sortable && onSort) {
      onSort(key);
    }
  };

  return (
    <thead className="bg-gray-50 dark:bg-[#0f172a] border-b border-[#e2e8f0] dark:border-[#1f2a3d]">
      <tr>
        {columns.map((col) => (
          <th
            key={String(col.key)}
            className={`px-6 py-3 text-left text-xs font-semibold text-(--text-primary) ${
              col.sortable && onSort ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-[#1f2a3d]" : ""
            }`}
            onClick={() => handleSort(String(col.key), col.sortable)}
            style={{ width: col.width }}
          >
            <div className="flex items-center gap-2">
              {col.label}
              {col.sortable && sortBy === String(col.key) && (
                <span>
                  {sortOrder === "asc" ? (
                    <ChevronUp size={14} className="text-gray-400" />
                  ) : (
                    <ChevronDown size={14} className="text-gray-400" />
                  )}
                </span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}
