import { useMemo, useState } from "react";
import { useEmployees } from "../hooks/useEmployees";
import { getMockPerformance } from "../utils/mockData";
import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/Badge";
import Pagination from "../components/Pagination";
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

  const chartData = performanceData.slice(0, 8);

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
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <XAxis dataKey="firstName" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell
                  key={index}
                  fill={index % 3 === 0 ? "#3b82f6" : index % 3 === 1 ? "#10b981" : "#f59e0b"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Search and Filter Bar */}
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
              const rating = emp.avgScore >= 90 ? "Excellent" : emp.avgScore >= 75 ? "Good" : "Average";
              const ratingVariant = rating === "Excellent" ? "green" : rating === "Good" ? "blue" : "amber";
              return (
                <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
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
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={tableState.currentPage}
        totalPages={Math.ceil(tableState.filteredData.length / rowsPerPage)}
        totalItems={tableState.filteredData.length}
        itemsPerPage={rowsPerPage}
        onPageChange={tableState.setCurrentPage}
      />
    </div>
  );
}
