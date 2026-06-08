import { useMemo } from "react";
import { useEmployees } from "../hooks/useEmployees";
import { PageHeader } from "../components/PageHeader";

export default function PositionsPage() {
  const { employees } = useEmployees();

  const positionCards = useMemo(() => {
    const map = new Map();

    employees.forEach(emp => {
      const dept = emp.company?.department || "Other";
      const title = emp.company?.title || "Staff";
      const key = `${dept}-${title}`;

      if (!map.has(key)) {
        map.set(key, { department: dept, title, count: 0 });
      }
      map.get(key).count++;
    });

    return Array.from(map.values());
  }, [employees]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {positionCards.map((pos, i) => (
          <div key={i} className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6 hover:shadow-md transition-all">
            <div className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 rounded-full mb-3">
              {pos.department}
            </div>
            <h3 className="text-xl font-semibold text-(--text-primary) mb-1">{pos.title}</h3>
            <div className="flex items-baseline gap-1 mt-6">
              <span className="text-5xl font-bold text-brand-600">{pos.count}</span>
              <span className="text-(--text-muted) text-lg">Employees</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}