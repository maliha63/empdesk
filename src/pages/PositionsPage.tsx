import { useMemo, useState } from "react";
import { useEmployees } from "../hooks/useEmployees";
import { PageHeader } from "../components/PageHeader";
import { usePagination } from "../hooks/usePagination";
import { Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface Position {
  id: string;
  department: string;
  title: string;
  count: number;
}

export default function PositionsPage() {
  const { employees } = useEmployees();
  const [searchTerm, setSearchTerm] = useState("");

  const positionData = useMemo(() => {
    const map = new Map<string, Position>();
    let id = 0;

    employees.forEach(emp => {
      const dept = emp.company?.department || "Other";
      const title = emp.company?.title || "Staff";
      const key = `${dept}-${title}`;

      if (!map.has(key)) {
        map.set(key, { id: String(id++), department: dept, title, count: 0 });
      }
      map.get(key)!.count++;
    });

    let positions = Array.from(map.values());
    
    if (searchTerm.trim()) {
      positions = positions.filter(pos =>
        pos.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pos.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return positions;
  }, [employees, searchTerm]);

  const { currentPage, totalPages, getCurrentItems, goToPage } = usePagination(positionData, 10);
  const currentPositions = getCurrentItems();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Positions"
        description="Job roles and department distribution"
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Employee" },
          { label: "Position" },
        ]}
      />

      <div className="bg-white dark:bg-[#111827] border border-[var(--border)] rounded-xl">
        <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search positions..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                goToPage(1);
              }}
              className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[#f8fafc] dark:bg-[#0b0f1a] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-[var(--text-muted)]">
            {positionData.length} positions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f8fafc] dark:bg-[#0f172a] border-b border-[var(--border)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-primary)]">Department</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-primary)]">Position Title</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-primary)]">Employee Count</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--text-primary)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPositions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <p className="text-[var(--text-muted)]">No positions found</p>
                  </td>
                </tr>
              ) : (
                currentPositions.map((pos) => (
                  <tr key={pos.id} className="border-b border-[var(--border)] hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] transition-colors">
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded-full">
                        {pos.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{pos.title}</td>
                    <td className="px-6 py-4 text-sm text-[var(--text-primary)]">
                      <span className="font-semibold">{pos.count}</span>
                      <span className="text-[var(--text-muted)] ml-1">employees</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-[var(--text-muted)] hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button className="p-2 text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between">
            <div className="text-sm text-[var(--text-muted)]">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
