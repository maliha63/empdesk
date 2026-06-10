import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { useEmployees } from "../hooks/useEmployees";
import { PageHeader } from "../components/PageHeader";
import { usePagination } from "../hooks/usePagination";
import toast, { Toaster } from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EmployeeAttendance {
  id: number;
  admissionNo: string;
  name: string;
  avatar?: string;
  department: string;
  designation: string;
  status: "Present" | "Late" | "Absent" | "Halfday" | "Holiday";
  note?: string;
}

const mockEmployeeAttendance: EmployeeAttendance[] = [
  {
    id: 1,
    admissionNo: "EMP001",
    name: "John Smith",
    avatar: "https://dummyjson.com/icon/user/48",
    department: "Engineering",
    designation: "Senior Software Engineer",
    status: "Present",
    note: "",
  },
  {
    id: 2,
    admissionNo: "EMP002",
    name: "Sarah Johnson",
    avatar: "https://dummyjson.com/icon/user/48",
    department: "Design",
    designation: "Product Designer",
    status: "Present",
    note: "",
  },
  {
    id: 3,
    admissionNo: "EMP003",
    name: "Mike Chen",
    avatar: "https://dummyjson.com/icon/user/48",
    department: "Engineering",
    designation: "DevOps Engineer",
    status: "Late",
    note: "",
  },
  {
    id: 4,
    admissionNo: "EMP004",
    name: "Emma Davis",
    avatar: "https://dummyjson.com/icon/user/48",
    department: "Product",
    designation: "Product Manager",
    status: "Present",
    note: "",
  },
  {
    id: 5,
    admissionNo: "EMP005",
    name: "Alex Brown",
    avatar: "https://dummyjson.com/icon/user/48",
    department: "Marketing",
    designation: "Marketing Manager",
    status: "Absent",
    note: "",
  },
];

export default function AttendancePage() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const isManager = user?.role === "manager";
  const [searchTerm, setSearchTerm] = useState("");

  // Initialize attendance records from employees
  const attendances = useMemo(() => {
    return employees.map(emp => ({
      id: emp.id,
      admissionNo: `EMP${String(emp.id).padStart(3, "0")}`,
      name: `${emp.firstName} ${emp.lastName}`,
      avatar: emp.image || "https://dummyjson.com/icon/user/48",
      department: emp.company?.department || "Other",
      designation: emp.company?.title || "Staff",
      status: (["Present", "Late", "Absent", "Halfday", "Holiday"] as const)[
        Math.floor(Math.random() * 5)
      ],
      note: "",
    }));
  }, [employees]);

  const [attendanceUpdates, setAttendanceUpdates] = useState<Record<number, EmployeeAttendance>>({});

  const updatedAttendances = attendances.map(att => 
    attendanceUpdates[att.id] ? { ...att, ...attendanceUpdates[att.id] } : att
  );

  const filteredAttendances = useMemo(() => {
    return updatedAttendances.filter(att =>
      att.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      att.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [updatedAttendances, searchTerm]);

  const { currentPage, totalPages, getCurrentItems, goToPage } = usePagination(filteredAttendances, 10);
  const currentAttendances = getCurrentItems();

  const handleStatusChange = (empId: number, newStatus: EmployeeAttendance["status"]) => {
    if (!isManager) return;
    setAttendanceUpdates(prev => ({
      ...prev,
      [empId]: { ...attendances.find(a => a.id === empId)!, status: newStatus }
    }));
    toast.success("Attendance updated");
  };

  const handleNoteChange = (empId: number, note: string) => {
    if (!isManager) return;
    setAttendanceUpdates(prev => ({
      ...prev,
      [empId]: { ...updatedAttendances.find(a => a.id === empId)!, note }
    }));
  };

  const statusColor: Record<EmployeeAttendance["status"], string> = {
    "Present": "text-green-600",
    "Late": "text-yellow-600",
    "Absent": "text-red-600",
    "Halfday": "text-orange-600",
    "Holiday": "text-purple-600",
  };

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

        <div className="bg-white dark:bg-[#111827] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search attendance..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  goToPage(1);
                }}
                className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[#f8fafc] dark:bg-[#0b0f1a] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-sm text-[var(--text-muted)]">
              {filteredAttendances.length} employees
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[#f8fafc] dark:bg-[#0f172a]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap">Admission No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-primary)]">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-primary)]">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-primary)]">Designation</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[var(--text-primary)] whitespace-nowrap">Attendance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-primary)]">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {currentAttendances.map((emp, idx) => (
                  <tr key={emp.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">
                      {emp.admissionNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-primary)] font-medium">
                      <div className="flex items-center gap-2">
                        <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full" />
                        {emp.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                      {emp.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                      {emp.designation}
                    </td>
                    <td className="px-4 py-3">
                      {isManager ? (
                        <div className="flex items-center justify-center gap-6">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Present"}
                              onChange={() => handleStatusChange(emp.id, "Present")}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-[var(--text-secondary)]">Present</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Late"}
                              onChange={() => handleStatusChange(emp.id, "Late")}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-[var(--text-secondary)]">Late</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Absent"}
                              onChange={() => handleStatusChange(emp.id, "Absent")}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-[var(--text-secondary)]">Absent</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Halfday"}
                              onChange={() => handleStatusChange(emp.id, "Halfday")}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-[var(--text-secondary)]">Halfday</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Holiday"}
                              onChange={() => handleStatusChange(emp.id, "Holiday")}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-[var(--text-secondary)]">Holiday</span>
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
                          value={emp.note}
                          onChange={(e) => handleNoteChange(emp.id, e.target.value)}
                          className="w-full max-w-xs px-2 py-1 text-xs border border-[var(--border)] rounded bg-white dark:bg-[#0f172a] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="text-xs text-[var(--text-secondary)]">{emp.note || "-"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between">
              <div className="text-sm text-[var(--text-muted)]">
                Page {currentPage} of {totalPages} ({filteredAttendances.length} total)
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
    </>
  );
}
