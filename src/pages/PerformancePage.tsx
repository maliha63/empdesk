import { useMemo, useState } from "react";
import { useEmployees } from "../hooks/useEmployees";
import { getMockPerformance } from "../utils/mockData";
import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/Badge";
import SearchBox from "../components/SearchBox";
import { useTableState } from "../hooks/useTableState";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function PerformancePage() {
  const { employees } = useEmployees();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);

  const performanceData = useMemo(() => {
    return employees.map((emp) => {
      const perf = getMockPerformance(emp.id);
      const avgScore = Math.round(
        perf.reduce((sum, p) => sum + p.score, 0) / perf.length
      );
      return {
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        image: emp.image,
        department: emp.company?.department || "N/A",
        avgScore,
        performance: perf,
      };
    });
  }, [employees]);

  const tableState = useTableState(performanceData, rowsPerPage, ["firstName", "lastName", "department"]);

  useMemo(() => {
    if (tableState.paginatedData.length > 0) {
      if (!selectedEmployeeId || !tableState.paginatedData.find(e => e.id === selectedEmployeeId)) {
        setSelectedEmployeeId(tableState.paginatedData[0].id);
      }
    }
  }, [tableState.paginatedData, selectedEmployeeId]);

  const chartData = useMemo(() => {
    return performanceData.map(emp => ({
      ...emp,
      isSelected: emp.id === selectedEmployeeId
    }));
  }, [performanceData, selectedEmployeeId]);

  const computedTotalPages = Math.ceil(tableState.filteredData.length / rowsPerPage);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Performance"
        description="Employee performance overview and monthly scores"
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Employee" },
          { label: "Performance" },
        ]}
      />

      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          Performance Overview {selectedEmployeeId && `- ${performanceData.find(e => e.id === selectedEmployeeId)?.firstName} ${performanceData.find(e => e.id === selectedEmployeeId)?.lastName}`}
        </h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <XAxis dataKey="firstName" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
              {chartData.map((item) => (
                <Cell
                  key={item.id}
                  fill={item.isSelected ? "#3b82f6" : "#cbd5e1"}
                  opacity={item.isSelected ? 1 : 0.5}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 flex items-center gap-4 flex-wrap">
        <SearchBox
          value={tableState.searchTerm}
          onChange={tableState.setSearchTerm}
          placeholder="Search employee..."
        />
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            tableState.setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="5">5 rows</option>
          <option value="10">10 rows</option>
          <option value="20">20 rows</option>
          <option value="50">50 rows</option>
        </select>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl overflow-hidden">
        {tableState.paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-4xl mb-4 opacity-50">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No employees found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
              {tableState.searchTerm ? "No employees match your search criteria. Try adjusting your filters." : "No employees available."}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d] bg-gray-50 dark:bg-[#0f172a]">
                <th className="text-left pl-8 py-4 font-semibold text-(--text-muted)">Employee</th>
                <th className="text-left py-4 font-semibold text-(--text-muted)">Department</th>
                <th className="text-center py-4 font-semibold text-(--text-muted)">Avg Score</th>
                <th className="text-center py-4 font-semibold text-(--text-muted)">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
              {tableState.paginatedData.map((emp) => {
                const rating = emp.avgScore >= 90 ? "Excellent" : emp.avgScore >= 75 ? "Good" : emp.avgScore >= 60 ? "Average" : "Poor";
                const ratingVariant = rating === "Excellent" ? "green" : rating === "Good" ? "blue" : rating === "Average" ? "amber" : "red";
                const isSelected = emp.id === selectedEmployeeId;
                return (
                  <tr 
                    key={emp.id} 
                    onClick={() => setSelectedEmployeeId(emp.id)}
                    className={`cursor-pointer transition-colors ${isSelected ? "bg-blue-50 dark:bg-blue-950/20" : "hover:bg-gray-50 dark:hover:bg-[#0f172a]"}`}
                  >
                    <td className="pl-8 py-4">
                      <div className="flex items-center gap-3">
                        <img src={emp.image} className="w-8 h-8 rounded-full" alt="" />
                        <span className="font-medium text-(--text-primary)">{emp.firstName} {emp.lastName}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant="blue">{emp.department}</Badge>
                    </td>
                    <td className="py-4 text-center font-mono font-semibold text-lg">{emp.avgScore}</td>
                    <td className="py-4 text-center">
                      <Badge variant={ratingVariant as any}>{rating}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Updated Pagination Block */}
      {computedTotalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 dark:text-[#4b5e7a]">
            Showing {((tableState.currentPage - 1) * rowsPerPage) + 1} to {Math.min(tableState.currentPage * rowsPerPage, tableState.filteredData.length)} of {tableState.filteredData.length} results
          </p>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => tableState.setCurrentPage(Math.max(1, tableState.currentPage - 1))}
              disabled={tableState.currentPage === 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d] text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              &larr; Prev
            </button>
            
            <div className="flex gap-1">
              {Array.from({ length: computedTotalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === computedTotalPages || Math.abs(p - tableState.currentPage) <= 1)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipse-${i}`} className="px-2 py-1.5 text-xs text-gray-400 dark:text-[#4b5e7a]">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => tableState.setCurrentPage(p as number)}
                      className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                        tableState.currentPage === p
                          ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-900"
                          : "border-[#e2e8f0] dark:border-[#1f2a3d] text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => tableState.setCurrentPage(Math.min(computedTotalPages, tableState.currentPage + 1))}
              disabled={tableState.currentPage === computedTotalPages}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d] text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}