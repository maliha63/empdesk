import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEmployees } from "../hooks/useEmployees";
import { getMockAttendance } from "../utils/mockData";
import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/Badge";
import { Dropdown } from "../components/Dropdown";
import toast, { Toaster } from "react-hot-toast";
import type { AttendanceRecord, AttendanceStatus } from "../types";

const ATTENDANCE_OPTIONS = [
  { label: "Present", value: "Present" },
  { label: "Absent", value: "Absent" },
  { label: "Late", value: "Late" },
  { label: "Leave", value: "Leave" },
];

export default function AttendancePage() {
  const { id } = useParams<{ id?: string }>(); // For individual or overview
  const { user } = useAuth();
  const { employees } = useEmployees();

  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  // If viewing specific employee attendance
  useEffect(() => {
    if (id) {
      const emp = employees.find(e => e.id === Number(id));
      if (emp) {
        setSelectedEmployee(emp);
        setAttendance(getMockAttendance(emp.id));
      }
    } else {
      // Overview - show all (mock for now)
      setAttendance(getMockAttendance(1)); // placeholder
    }
  }, [id, employees]);

  const statusColor: Record<string, string> = {
    Present: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
    Absent: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400",
    Late: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
    Leave: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
  };

  function handleStatusChange(date: string, newStatus: AttendanceStatus) {
    if (user?.role !== "manager") return;
    setAttendance(prev =>
      prev.map(a => a.date === date ? { ...a, status: newStatus } : a)
    );
    toast.success("Attendance updated");
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title={id ? `Attendance - ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}` : "Attendance Overview"}
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Attendance" },
          ]}
        />

        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d] bg-gray-50 dark:bg-[#0f172a]">
                <th className="text-left pl-8 py-4 font-medium text-(--text-muted)">Date</th>
                <th className="text-left py-4 font-medium text-(--text-muted)">Status</th>
                <th className="text-left py-4 font-medium text-(--text-muted)">Check In</th>
                <th className="text-left py-4 font-medium text-(--text-muted)">Check Out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
              {attendance.map((record) => (
                <tr key={record.date} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                  <td className="pl-8 py-4 font-mono text-(--text-muted)">{record.date}</td>
                  <td className="py-4">
                    {user?.role === "manager" ? (
                      <Dropdown
                        variant="pill"
                        options={ATTENDANCE_OPTIONS}
                        value={record.status}
                        onChange={(val) => handleStatusChange(record.date, val as AttendanceStatus)}
                        pillColorClass={statusColor[record.status]}
                      />
                    ) : (
                      <Badge variant={
                        record.status === "Present" ? "green" :
                        record.status === "Absent" ? "red" : "amber"
                      } dot>
                        {record.status}
                      </Badge>
                    )}
                  </td>
                  <td className="py-4 font-mono text-(--text-secondary)">{record.checkIn}</td>
                  <td className="py-4 font-mono text-(--text-secondary)">{record.checkOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}