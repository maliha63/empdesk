import { useState, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useEmployees } from "../hooks/useEmployees";
import { PageHeader } from "../components/PageHeader";
import Pagination from "../components/Pagination";
import SearchBox from "../components/SearchBox";
import { useTableState } from "../hooks/useTableState";
import CustomSelect from "../components/CustomSelect";
import toast, { Toaster } from "react-hot-toast";

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

export default function AttendancePage() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const isManager = user?.role === "manager";

  const attendanceData = useMemo(() => {
    let data = employees.map((emp) => ({
      id: emp.id || Math.random(),
      admissionNo: emp.id?.toString() || "",
      name: `${emp.firstName} ${emp.lastName}`,
      avatar: emp.image,
      department: emp.company?.department || "N/A",
      designation: emp.company?.title || "N/A",
      status: "Present" as const,
      note: "",
    }));

    // Show only current user's attendance if they're an employee
    if (!isManager && user) {
      data = data.filter(
        (emp) => emp.name === `${user.firstName} ${user.lastName}`
      );
    }

    return data;
  }, [employees, isManager, user]);

  const [attendances, setAttendances] = useState<EmployeeAttendance[]>(attendanceData as unknown as EmployeeAttendance[]);
  const tableState = useTableState(attendances, rowsPerPage, ["name", "department"]);

  const handleStatusChange = (empId: string, newStatus: EmployeeAttendance["status"]) => {
    if (!isManager) return;
    setAttendances((prev) =>
      prev.map((emp) => (emp.id === empId ? { ...emp, status: newStatus } : emp))
    );
    toast.success("Attendance updated");
  };

  const handleNoteChange = (empId: string, note: string) => {
    if (!isManager) return;
    setAttendances((prev) =>
      prev.map((emp) => (emp.id === empId ? { ...emp, note } : emp))
    );
  };

  const statusColor: Record<EmployeeAttendance["status"], string> = {
    "Present": "text-green-600 dark:text-green-400",
    "Late": "text-yellow-600 dark:text-yellow-400",
    "Absent": "text-red-600 dark:text-red-400",
    "Halfday": "text-orange-600 dark:text-orange-400",
    "Holiday": "text-blue-600 dark:text-blue-400",
  };

  const displayData = tableState.paginatedData;

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Employee Attendance"
          description={isManager ? "Manage team member attendance" : "View your attendance"}
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Attendance" },
          ]}
        />

        {/* Search and Filter Bar */}
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

        {/* Data Table */}
        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d] bg-gray-50 dark:bg-[#0f172a]">
                  <th className="text-left px-4 py-3 font-semibold text-(--text-muted) text-xs">Admission No</th>
                  <th className="text-left px-4 py-3 font-semibold text-(--text-muted) text-xs">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-(--text-muted) text-xs">Department</th>
                  <th className="text-left px-4 py-3 font-semibold text-(--text-muted) text-xs">Designation</th>
                  <th className="text-center px-4 py-3 font-semibold text-(--text-muted) text-xs">Attendance</th>
                  <th className="text-left px-4 py-3 font-semibold text-(--text-muted) text-xs">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
                {displayData.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                      {emp.admissionNo}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {emp.avatar && (
                          <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full" />
                        )}
                        <span className="text-sm font-medium text-(--text-primary)">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-(--text-secondary)">{emp.department}</td>
                    <td className="px-4 py-3 text-sm text-(--text-secondary)">{emp.designation}</td>
                    <td className="px-4 py-3">
                      {isManager ? (
                        <div className="flex items-center justify-center gap-3 flex-wrap">
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Present"}
                              onChange={() => handleStatusChange(emp.id, "Present")}
                              className="w-3 h-3"
                            />
                            <span className="text-xs text-(--text-secondary)">P</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Late"}
                              onChange={() => handleStatusChange(emp.id, "Late")}
                              className="w-3 h-3"
                            />
                            <span className="text-xs text-(--text-secondary)">L</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Absent"}
                              onChange={() => handleStatusChange(emp.id, "Absent")}
                              className="w-3 h-3"
                            />
                            <span className="text-xs text-(--text-secondary)">A</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Halfday"}
                              onChange={() => handleStatusChange(emp.id, "Halfday")}
                              className="w-3 h-3"
                            />
                            <span className="text-xs text-(--text-secondary)">H</span>
                          </label>
                          <label className="flex items-center gap-1 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Holiday"}
                              onChange={() => handleStatusChange(emp.id, "Holiday")}
                              className="w-3 h-3"
                            />
                            <span className="text-xs text-(--text-secondary)">Ho</span>
                          </label>
                        </div>
                      ) : (
                        <span className={`text-sm font-medium ${statusColor[emp.status]}`}>
                          {emp.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isManager ? (
                        <input
                          type="text"
                          placeholder="Write note..."
                          value={emp.note || ""}
                          onChange={(e) => handleNoteChange(emp.id, e.target.value)}
                          className="w-full max-w-xs px-2 py-1 text-xs border border-[#e2e8f0] dark:border-[#1f2a3d] rounded bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-xs text-(--text-secondary)">{emp.note || "-"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={tableState.currentPage}
          totalPages={tableState.totalPages}
          totalItems={attendances.length}
          itemsPerPage={rowsPerPage}
          onPageChange={tableState.setCurrentPage}
        />
      </div>
    </>
  );
}
