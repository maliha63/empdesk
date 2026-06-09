import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { PageHeader } from "../components/PageHeader";
import toast, { Toaster } from "react-hot-toast";

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
  const [attendances, setAttendances] = useState<EmployeeAttendance[]>(mockEmployeeAttendance);
  const isManager = user?.role === "manager";

  const handleStatusChange = (empId: number, newStatus: EmployeeAttendance["status"]) => {
    if (!isManager) return;
    setAttendances(prev =>
      prev.map(emp => emp.id === empId ? { ...emp, status: newStatus } : emp)
    );
    toast.success("Attendance updated");
  };

  const handleNoteChange = (empId: number, note: string) => {
    if (!isManager) return;
    setAttendances(prev =>
      prev.map(emp => emp.id === empId ? { ...emp, note } : emp)
    );
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

        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--border) bg-[#f8fafc] dark:bg-[#0f172a]">
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary) whitespace-nowrap">Admission No</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary)">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary)">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary)">Designation</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-(--text-primary) whitespace-nowrap">Attendance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary)">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border)">
                {attendances.map((emp) => (
                  <tr key={emp.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] transition-colors">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded" />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600">
                      {emp.admissionNo}
                    </td>
                    <td className="px-4 py-3 text-sm text-(--text-primary) font-medium">
                      <div className="flex items-center gap-2">
                        <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full" />
                        {emp.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-(--text-secondary)">
                      {emp.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-(--text-secondary)">
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
                            <span className="text-xs text-(--text-secondary)">Present</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Late"}
                              onChange={() => handleStatusChange(emp.id, "Late")}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-(--text-secondary)">Late</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Absent"}
                              onChange={() => handleStatusChange(emp.id, "Absent")}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-(--text-secondary)">Absent</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Halfday"}
                              onChange={() => handleStatusChange(emp.id, "Halfday")}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-(--text-secondary)">Halfday</span>
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`status-${emp.id}`}
                              checked={emp.status === "Holiday"}
                              onChange={() => handleStatusChange(emp.id, "Holiday")}
                              className="w-4 h-4"
                            />
                            <span className="text-xs text-(--text-secondary)">Holiday</span>
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
                          className="w-full max-w-xs px-2 py-1 text-xs border border-(--border) rounded bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      </div>
    </>
  );
}
