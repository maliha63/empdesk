import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { useAuth }      from "../hooks/useAuth";
import { useEmployees } from "../hooks/useEmployees";
import { useLeave }     from "../hooks/useLeave";
import { getMockAttendance, getMockPerformance } from "../utils/mockData";
import { PageHeader }   from "../components/PageHeader";
import { Badge }        from "../components/Badge";
import { DatePicker }   from "../components/DatePicker";
import { CalendarDays, Mail, Phone, MapPin, Building2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";

interface LeaveFormValues {
  reason: string;
  from:   string;
  to:     string;
}

export default function ProfilePage() {
  const { user }      = useAuth();
  const { employees } = useEmployees();
  const { applyLeave, requests } = useLeave();
  const [showLeaveForm, setShowLeaveForm] = useState(false);

  const employee = useMemo(
    () => employees.find((e) => e.id === user?.id),
    [employees, user]
  );

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<LeaveFormValues>();

  const myLeaves = requests.filter((r) => r.employeeId === user?.id);

  const attendance  = employee ? getMockAttendance(employee.id) : [];
  const performance = employee ? getMockPerformance(employee.id) : [];
  const presentDays = attendance.filter((a) => a.status === "Present").length;
  const avgScore    = performance.length
    ? Math.round(performance.reduce((s, p) => s + p.score, 0) / performance.length)
    : 0;

  function onLeaveSubmit(data: LeaveFormValues) {
    if (!employee) return;
    applyLeave({
      employeeId: employee.id,
      name:       `${employee.firstName} ${employee.lastName}`,
      image:      employee.image,
      reason:     data.reason,
      from:       data.from,
      to:         data.to,
    });
    reset();
    setShowLeaveForm(false);
  }

  if (!employee) return (
    <div className="text-center py-20 text-slate-400">Loading profile...</div>
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="My Profile"
        crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Profile" }]}
      />

      {/* Profile card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface-card border border-surface-border rounded-xl p-6 flex gap-5 items-start"
      >
        <img src={employee.image} alt={employee.firstName} className="w-16 h-16 rounded-xl object-cover ring-2 ring-surface-border" />
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-white">{employee.firstName} {employee.lastName}</h2>
          <p className="text-slate-400 text-sm mt-0.5">{employee.company?.title}</p>
          <div className="flex gap-2 mt-2 flex-wrap">
            <Badge variant="blue">{employee.company?.department}</Badge>
            <Badge variant="purple">{user?.role}</Badge>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Attendance",  value: `${presentDays}/20`, color: "text-emerald-400" },
          { label: "Avg Score",   value: avgScore,            color: "text-brand-500"   },
          { label: "Tasks Done",  value: performance.reduce((s, p) => s + p.tasksCompleted, 0), color: "text-amber-400" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-surface-card border border-surface-border rounded-xl p-4"
          >
            <p className="text-xs text-slate-400">{s.label}</p>
            <p className={`text-2xl font-bold font-mono mt-1 ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-3">
        {[
          { icon: <Mail size={14} />,      label: employee.email },
          { icon: <Phone size={14} />,     label: employee.phone },
          { icon: <Building2 size={14} />, label: employee.company?.name },
          { icon: <MapPin size={14} />,    label: `${employee.address?.city}, ${employee.address?.country}` },
        ].map((f, i) => (
          <div key={i} className="flex items-center gap-3 text-sm">
            <span className="text-slate-500">{f.icon}</span>
            <span className="text-slate-300">{f.label}</span>
          </div>
        ))}
      </div>

      {/* Leave section — employee only */}
      {user?.role === "employee" && (
        <div className="bg-surface-card border border-surface-border rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">Leave Requests</p>
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
              className="space-y-3 border-t border-surface-border pt-4"
            >
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Reason</label>
                <input
                  type="text"
                  placeholder="e.g. Medical leave"
                  className={`w-full bg-surface border rounded-lg px-3 py-2 text-sm text-white
                    placeholder-slate-600 outline-none focus:border-brand-500 transition-colors
                    ${errors.reason ? "border-red-500" : "border-surface-border"}`}
                  {...register("reason", { required: "Reason is required" })}
                />
                {errors.reason && <p className="mt-1 text-xs text-red-400">{errors.reason.message}</p>}
              </div>

              {/* Date pickers — custom, fully styled */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">From</label>
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
                  <label className="block text-xs text-slate-400 mb-1.5">To</label>
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
                <button type="button" onClick={() => setShowLeaveForm(false)}
                  className="px-4 py-2 text-xs border border-surface-border text-slate-400 rounded-lg hover:text-white transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="px-4 py-2 text-xs bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors">
                  Submit
                </button>
              </div>
            </motion.form>
          )}

          {myLeaves.length === 0 ? (
            <p className="text-xs text-slate-500">No leave requests submitted.</p>
          ) : (
            <div className="space-y-2">
              {myLeaves.map((r) => (
                <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-surface-border">
                  <div>
                    <p className="text-sm text-white">{r.reason}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{r.from} → {r.to}</p>
                  </div>
                  <Badge variant={r.status === "approved" ? "green" : r.status === "rejected" ? "red" : "amber"}>
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