import type { ReactNode } from "react";
import TableHeader, { type Column } from "./TableHeader";

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (key: string) => void;
  emptyMessage?: string;
  className?: string;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  sortBy,
  sortOrder,
  onSort,
  emptyMessage = "No data available",
  className = "",
}: DataTableProps<T>) {
  return (
    <div
      className={`overflow-x-auto border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl ${className}`}
    >
      <table className="w-full">
        <TableHeader
          columns={columns}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={onSort}
        />
        <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-(--text-muted)"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 dark:hover:bg-[#1f2a3d]/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className="px-6 py-4 text-sm text-(--text-primary)"
                    style={{ width: col.width }}
                  >
                    {col.render
                      ? col.render(row[col.key as keyof T], row, rowIndex)
                      : (row[col.key as keyof T] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
