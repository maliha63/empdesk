import { useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useEmployees } from "../hooks/useEmployees";
import { getMockAttendance } from "../utils/mockData";
import { PageHeader } from "../components/PageHeader";
import SearchBox from "../components/SearchBox";
import { useTableState } from "../hooks/useTableState";
import CustomSelect from "../components/CustomSelect";
import { Badge } from "../components/Badge";
import toast, { Toaster } from "react-hot-toast";
import {
  CheckCircle2,
  Clock,
  XCircle,
  CalendarOff,
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface EmployeeAttendance {
  id: string;
  admissionNo: string;
  name: string;
  avatar?: string;
  department: string;
  designation: string;
  status: "Present" | "Late" | "Absent" | "Halfday" | "Holiday";
  note?: string;
}

const STATUS_META = {
  Present: { color: "#10b981", variant: "green" as const, icon: CheckCircle2 },
  Late: { color: "#f59e0b", variant: "amber" as const, icon: Clock },
  Absent: { color: "#ef4444", variant: "red" as const, icon: XCircle },
  Leave: { color: "#3b82f6", variant: "blue" as const, icon: CalendarOff },
};

function EmployeeAttendanceView({ userId }: { userId: number }) {
  const records = useMemo(() => getMockAttendance(userId), [userId]);

  const counts = useMemo(() => {
    const c = { Present: 0, Late: 0, Absent: 0, Leave: 0 };
    records.forEach((r) => {
      c[r.status as keyof typeof c] = (c[r.status as keyof typeof c] || 0) + 1;
    });
    return c;
  }, [records]);

  const total = records.length;
  const attendanceRate = total ? Math.round((counts.Present / total) * 100) : 0;

  const pieData = (Object.keys(counts) as Array<keyof typeof counts>)
    .map((k) => ({ name: k, value: counts[k] }))
    .filter((d) => d.value > 0);

  const monthlyData = useMemo(() => {
    const map: Record<
      string,
      {
        month: string;
        Present: number;
        Late: number;
        Absent: number;
        Leave: number;
      }
    > = {};
    records.forEach((r) => {
      const month = new Date(r.date).toLocaleString("en-US", {
        month: "short",
      });
      if (!map[month])
        map[month] = { month, Present: 0, Late: 0, Absent: 0, Leave: 0 };
      map[month][r.status as "Present" | "Late" | "Absent" | "Leave"] += 1;
    });
    return Object.values(map).reverse();
  }, [records]);

  const statCards = [
    { label: "Present", value: counts.Present, meta: STATUS_META.Present },
    { label: "Late", value: counts.Late, meta: STATUS_META.Late },
    { label: "Absent", value: counts.Absent, meta: STATUS_META.Absent },
    { label: "On Leave", value: counts.Leave, meta: STATUS_META.Leave },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mb-1">
            Overall Attendance Rate
          </p>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold text-emerald-600">
              {attendanceRate}%
            </span>
            <span className="text-sm text-(--text-muted) mb-1.5">
              of {total} recorded days
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-emerald-600">
          <TrendingUp size={20} />
          <span className="text-sm font-medium">
            {counts.Present} days present this period
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => {
          const Icon = s.meta.icon;
          return (
            <div
              key={s.label}
              className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide">
                  {s.label}
                </p>
                <span
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: `${s.meta.color}1a`,
                    color: s.meta.color,
                  }}
                >
                  <Icon size={18} />
                </span>
              </div>
              <p className="text-3xl font-bold text-(--text-primary)">
                {s.value}
              </p>
              <p className="text-[11px] text-(--text-muted) mt-2">
                {total ? Math.round((s.value / total) * 100) : 0}% of total days
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-(--text-primary) mb-4">
            Status Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={3}
              >
                {pieData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      STATUS_META[entry.name as keyof typeof STATUS_META].color
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-(--text-primary) mb-4">
            Monthly Trend
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="Present"
                stackId="a"
                fill={STATUS_META.Present.color}
              />
              <Bar dataKey="Late" stackId="a" fill={STATUS_META.Late.color} />
              <Bar
                dataKey="Absent"
                stackId="a"
                fill={STATUS_META.Absent.color}
              />
              <Bar
                dataKey="Leave"
                stackId="a"
                fill={STATUS_META.Leave.color}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-(--border)">
          <h3 className="text-sm font-semibold text-(--text-primary)">
            Recent Records
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-(--border) bg-[#f8fafc] dark:bg-[#0f172a]">
                <th className="text-left px-6 py-3 font-semibold text-(--text-muted) text-xs">
                  Date
                </th>
                <th className="text-left px-6 py-3 font-semibold text-(--text-muted) text-xs">
                  Check In
                </th>
                <th className="text-left px-6 py-3 font-semibold text-(--text-muted) text-xs">
                  Check Out
                </th>
                <th className="text-center px-6 py-3 font-semibold text-(--text-muted) text-xs">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border)">
              {records.map((r, i) => (
                <tr
                  key={i}
                  className="hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] transition-colors"
                >
                  <td className="px-6 py-3 text-(--text-primary) font-medium">
                    {new Date(r.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-3 text-(--text-secondary) font-mono">
                    {r.checkIn}
                  </td>
                  <td className="px-6 py-3 text-(--text-secondary) font-mono">
                    {r.checkOut}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <Badge
                      variant={
                        STATUS_META[r.status as keyof typeof STATUS_META]
                          ?.variant || "slate"
                      }
                      dot
                    >
                      {r.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const isManager = user?.role === "manager";

  const attendanceData = useMemo(() => {
    return employees.map((emp) => ({
      id: emp.id || Math.random(),
      admissionNo: emp.id?.toString() || "",
      name: `${emp.firstName} ${emp.lastName}`,
      avatar: emp.image,
      department: emp.company?.department || "N/A",
      designation: emp.company?.title || "N/A",
      status: "Present" as const,
      note: "",
    }));
  }, [employees]);

  const [attendances, setAttendances] = useState<EmployeeAttendance[]>(
    attendanceData as unknown as EmployeeAttendance[],
  );
  const tableState = useTableState(attendances, rowsPerPage, [
    "name",
    "department",
  ]);

  const handleStatusChange = (
    empId: string,
    newStatus: EmployeeAttendance["status"],
  ) => {
    setAttendances((prev) =>
      prev.map((emp) =>
        emp.id === empId ? { ...emp, status: newStatus } : emp,
      ),
    );
    toast.success("Attendance updated");
  };

  const handleNoteChange = (empId: string, note: string) => {
    setAttendances((prev) =>
      prev.map((emp) => (emp.id === empId ? { ...emp, note } : emp)),
    );
  };

  if (!isManager && user) {
    return (
      <>
        <Toaster position="top-right" />
        <div className="space-y-6">
          <PageHeader
            title="My Attendance"
            description="A detailed overview of your attendance record"
            crumbs={[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Attendance" },
            ]}
          />
          <EmployeeAttendanceView userId={user.id} />
        </div>
      </>
    );
  }

  const displayData = tableState.paginatedData;

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Employee Attendance"
          description="Manage team member attendance"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Attendance" },
          ]}
        />

        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 flex items-center gap-4 flex-wrap">
          <SearchBox
            value={tableState.searchTerm}
            onChange={tableState.setSearchTerm}
            placeholder="Search employee..."
          />
          <CustomSelect
            value={rowsPerPage}
            onChange={(value) => {
              setRowsPerPage(Number(value));
              tableState.setCurrentPage(1);
            }}
            options={[
              { value: 5, label: "5 rows" },
              { value: 10, label: "10 rows" },
              { value: 20, label: "20 rows" },
              { value: 50, label: "50 rows" },
            ]}
          />
        </div>

        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d] bg-gray-50 dark:bg-[#0f172a]">
                  <th className="text-left px-4 py-3 font-semibold text-(--text-muted) text-xs">
                    Admission No
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-(--text-muted) text-xs">
                    Name
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-(--text-muted) text-xs">
                    Department
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-(--text-muted) text-xs">
                    Designation
                  </th>
                  <th className="text-center px-4 py-3 font-semibold text-(--text-muted) text-xs">
                    Attendance
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-(--text-muted) text-xs">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
                {displayData.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#0f172a] transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                      {emp.admissionNo}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {emp.avatar && (
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span className="text-sm font-medium text-(--text-primary)">
                          {emp.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-(--text-secondary)">
                      {emp.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-(--text-secondary)">
                      {emp.designation}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-3 flex-wrap">
                        {(
                          [
                            "Present",
                            "Late",
                            "Absent",
                            "Halfday",
                            "Holiday",
                          ] as const
                        ).map((status) => (
                          <label
                            key={status}
                            className="flex items-center gap-1 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === status}
                              onChange={() =>
                                handleStatusChange(emp.id, status)
                              }
                              className="w-3 h-3"
                            />
                            <span className="text-xs text-(--text-secondary)">
                              {status === "Holiday" ? "Ho" : status.charAt(0)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        placeholder="Write note..."
                        value={emp.note || ""}
                        onChange={(e) =>
                          handleNoteChange(emp.id, e.target.value)
                        }
                        className="w-full max-w-xs px-2 py-1 text-xs border border-[#e2e8f0] dark:border-[#1f2a3d] rounded bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unified standard pagination container */}
        {tableState.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-[#4b5e7a]">
              Showing {(tableState.currentPage - 1) * rowsPerPage + 1} to{" "}
              {Math.min(
                tableState.currentPage * rowsPerPage,
                attendances.length,
              )}{" "}
              of {attendances.length} results
            </p>
            <div className="flex gap-2 items-center">
              <button
                onClick={() =>
                  tableState.setCurrentPage(
                    Math.max(1, tableState.currentPage - 1),
                  )
                }
                disabled={tableState.currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d] text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                &larr; Prev
              </button>

              <div className="flex gap-1">
                {Array.from({ length: tableState.totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === tableState.totalPages ||
                      Math.abs(p - tableState.currentPage) <= 1,
                  )
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1)
                      acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`ellipse-${i}`}
                        className="px-2 py-1.5 text-xs text-gray-400 dark:text-[#4b5e7a]"
                      >
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
                    ),
                  )}
              </div>

              <button
                onClick={() =>
                  tableState.setCurrentPage(
                    Math.min(tableState.totalPages, tableState.currentPage + 1),
                  )
                }
                disabled={tableState.currentPage === tableState.totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d] text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
