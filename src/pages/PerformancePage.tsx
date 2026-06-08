import { useMemo } from "react";
import { useEmployees } from "../hooks/useEmployees";
import { getMockPerformance } from "../utils/mockData";
import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/Badge";
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

  const performanceData = useMemo(() => {
    return employees.map((emp) => {
      const perf = getMockPerformance(emp.id);
      const avgScore = Math.round(
        perf.reduce((sum, p) => sum + p.score, 0) / perf.length
      );
      return {
        ...emp,
        avgScore,
        performance: perf,
      };
    });
  }, [employees]);

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
          <BarChart data={performanceData.slice(0, 8)}>
            <XAxis dataKey="firstName" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Bar dataKey="avgScore" radius={[4, 4, 0, 0]}>
              {performanceData.slice(0, 8).map((_, index) => (
                <Cell
                  key={index}
                  fill={index % 3 === 0 ? "#3b82f6" : index % 3 === 1 ? "#10b981" : "#f59e0b"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d] bg-gray-50 dark:bg-[#0f172a]">
              <th className="text-left pl-8 py-4">Employee</th>
              <th className="text-left py-4">Department</th>
              <th className="text-center py-4">Avg Score</th>
              <th className="text-center py-4">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
            {performanceData.map((emp) => {
              const rating = emp.avgScore >= 90 ? "Excellent" : emp.avgScore >= 75 ? "Good" : "Average";
              return (
                <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                  <td className="pl-8 py-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.image} className="w-8 h-8 rounded-full" alt="" />
                      <span className="font-medium">{emp.firstName} {emp.lastName}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <Badge variant="blue">{emp.company?.department}</Badge>
                  </td>
                  <td className="py-4 text-center font-mono font-semibold">{emp.avgScore}</td>
                  <td className="py-4 text-center">
                    <Badge variant={rating === "Excellent" ? "green" : "amber"}>{rating}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}