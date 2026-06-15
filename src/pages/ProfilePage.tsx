import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import { useEmployees } from "../hooks/useEmployees";
import { useLeave } from "../hooks/useLeave";
import { getMockAttendance, getMockPerformance } from "../utils/mockData";
import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/Badge";
import { DatePicker } from "../components/DatePicker";
import { CalendarDays, Mail, Phone, MapPin, Building2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Zap, TrendingUp, Award, Clock } from "lucide-react";

interface LeaveFormValues {
  reason: string;
  from: string;
  to: string;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const { applyLeave, requests } = useLeave();
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const employee = useMemo(
    () => employees.find((e) => e.id === user?.id),
    [employees, user],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<LeaveFormValues>();

  const myLeaves = requests.filter((r) => r.employeeId === user?.id);

  const attendance = employee ? getMockAttendance(employee.id) : [];
  const performance = employee ? getMockPerformance(employee.id) : [];
  const presentDays = attendance.filter((a) => a.status === "Present").length;
  const avgScore = performance.length
    ? Math.round(
        performance.reduce((s, p) => s + p.score, 0) / performance.length,
      )
    : 0;

  function onLeaveSubmit(data: LeaveFormValues) {
    if (!employee) return;
    applyLeave({
      employeeId: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      image: employee.image,
      reason: data.reason,
      from: data.from,
      to: data.to,
      designation: employee.company?.title || "Employee",
    });
    reset();
    setShowLeaveForm(false);
  }

  if (!employee)
    return (
      <div className="text-center py-20 text-gray-400 dark:text-[#4b5e7a]">
        Loading profile...
      </div>
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile"
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Profile" },
        ]}
      />

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-6 flex gap-5 items-start shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
      >
        <img
          src={employee.image}
          alt={employee.firstName}
          className="w-16 h-16 rounded-xl object-cover ring-2 ring-[#e2e8f0] dark:ring-[#1f2a3d]"
        />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {employee.firstName} {employee.lastName}
          </h2>
          <p className="text-gray-500 dark:text-[#4b5e7a] text-sm mt-0.5">
            {employee.company?.title}
          </p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge variant="blue">{employee.company?.department}</Badge>
            <Badge variant="purple">{user?.role}</Badge>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Attendance",
            value: `${presentDays}/20`,
            color: "text-emerald-500 dark:text-emerald-400",
          },
          { label: "Avg Score", value: avgScore, color: "text-brand-500" },
          {
            label: "Tasks Done",
            value: performance.reduce((s, p) => s + p.tasksCompleted, 0),
            color: "text-amber-500 dark:text-amber-400",
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)]"
          >
            <p className="text-xs text-gray-400 dark:text-[#4b5e7a]">
              {s.label}
            </p>
            <p className={`text-2xl font-bold font-mono mt-1 ${s.color}`}>
              {s.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-5 space-y-3 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        {[
          { icon: <Mail size={14} />, label: employee.email },
          { icon: <Phone size={14} />, label: employee.phone },
          { icon: <Building2 size={14} />, label: employee.company?.name },
          {
            icon: <MapPin size={14} />,
            label: `${employee.address?.city}, ${employee.address?.country}`,
          },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="text-gray-400 dark:text-[#4b5e7a]">{f.icon}</span>
            <span className="text-gray-700 dark:text-gray-300">{f.label}</span>
          </div>
        ))}
      </div>

      {/* Skills & Expertise section — manager only */}
      {user?.role === "manager" && (
        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
          <div className="flex items-center gap-2">
            <Zap size={16} className="text-amber-500" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Key Competencies
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Team Leadership",
              "Performance Management",
              "Strategic Planning",
              "Mentoring",
              "Budget Analysis",
            ].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-medium border border-amber-200 dark:border-amber-800/50"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Performance Summary section */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-brand-500" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Performance Insight
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-brand-50 dark:bg-brand-950/20 border border-brand-100 dark:border-brand-800/30">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Performance Trend
            </p>
            <p className="font-semibold text-brand-600 dark:text-brand-400">
              ↑ 12% this quarter
            </p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800/30">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              Projects Completed
            </p>
            <p className="font-semibold text-emerald-600 dark:text-emerald-400">
              {performance.length} this month
            </p>
          </div>
        </div>
      </div>

      {/* Activity Status section */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
        <div className="flex items-center gap-2">
          <Award size={16} className="text-emerald-500" />
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Activity Status
          </p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Current Status
              </span>
            </div>
            <Badge variant="green">Active</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Last login
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Today at 9:45 AM
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Member since
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Jan 2024
            </span>
          </div>
        </div>
      </div>

      {/* Leave section — employee only */}
      {user?.role === "employee" && (
        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-5 space-y-4 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              Leave Requests
            </p>
            <button
              onClick={() => setShowLeaveForm((v) => !v)}
              className="flex items-center gap-2 text-xs bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <CalendarDays size={12} />
              Apply Leave
            </button>
          </div>

          {showLeaveForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              onSubmit={handleSubmit(onLeaveSubmit)}
              className="space-y-3 border-t border-[#e2e8f0] dark:border-[#1f2a3d] pt-4"
            >
              <div>
                <label className="block text-xs text-gray-500 dark:text-[#4b5e7a] mb-1.5">
                  Reason
                </label>
                <input
                  type="text"
                  placeholder="e.g. Medical leave"
                  className={`w-full bg-[#f8fafc] dark:bg-[#0b0f1a] border rounded-lg px-3 py-2 text-sm
                    text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-[#2a3a54]
                    outline-none focus:border-brand-500 transition-colors
                    ${errors.reason ? "border-red-400 dark:border-red-500" : "border-[#e2e8f0] dark:border-[#1f2a3d]"}`}
                  {...register("reason", { required: "Reason is required" })}
                />
                {errors.reason && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.reason.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 dark:text-[#4b5e7a] mb-1.5">
                    From
                  </label>
                  <Controller
                    name="from"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="Start date"
                        hasError={!!errors.from}
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 dark:text-[#4b5e7a] mb-1.5">
                    To
                  </label>
                  <Controller
                    name="to"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        placeholder="End date"
                        hasError={!!errors.to}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveForm(false)}
                  className="px-4 py-2 text-xs border border-[#e2e8f0] dark:border-[#1f2a3d] text-gray-500 dark:text-[#4b5e7a] rounded-lg hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors"
                >
                  Submit
                </button>
              </div>
            </motion.form>
          )}

          {myLeaves.length === 0 ? (
            <p className="text-xs text-gray-400 dark:text-[#4b5e7a]">
              No leave requests submitted.
            </p>
          ) : (
            <div className="space-y-2">
              {myLeaves.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#f8fafc] dark:bg-[#0b0f1a] border border-[#e2e8f0] dark:border-[#1f2a3d]"
                >
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      {r.reason}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-[#4b5e7a] mt-0.5">
                      {r.from} → {r.to}
                    </p>
                  </div>
                  <Badge
                    variant={
                      r.status === "approved"
                        ? "green"
                        : r.status === "rejected"
                          ? "red"
                          : "amber"
                    }
                  >
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
