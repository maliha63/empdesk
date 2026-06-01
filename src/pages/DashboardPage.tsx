import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useEmployees } from "../hooks/useEmployees";
import { useLeave }     from "../hooks/useLeave";
import { useAuth }      from "../hooks/useAuth";
import { getRecentActivity } from "../utils/mockData";
import { PageHeader }   from "../components/PageHeader";
import { Badge }        from "../components/Badge";
import {
  Users, Building2, CalendarCheck, TrendingUp,
  CheckCircle2, XCircle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

const COLORS = ["#4f6ef7","#6ee7b7","#fbbf24","#f87171","#a78bfa","#34d399","#60a5fa"];

export default function DashboardPage() {
  const { employees, isLoading } = useEmployees();
  const { requests, approveLeave, rejectLeave } = useLeave();
  const { user } = useAuth();
  const activity = getRecentActivity();

  const pendingLeaves = requests.filter((r) => r.status === "pending");

  const deptStats = useMemo(() => {
    const map: Record<string, number> = {};
    employees.forEach((e) => {
      const dept = e.company?.department ?? "Unknown";
      map[dept] = (map[dept] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([dept, count]) => ({ dept, count }))
      .sort((a, b) => b.count - a.count);
  }, [employees]);

  if (isLoading) return <DashboardSkeleton />;

  const stats = [
    { label: "Total Employees", value: employees.length,                              icon: <Users size={18} />,         color: "text-brand-500",   bg: "bg-brand-500/10"   },
    { label: "Departments",     value: deptStats.length,                              icon: <Building2 size={18} />,     color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { label: "Avg Age",         value: Math.round(employees.reduce((s,e) => s + e.age, 0) / (employees.length || 1)),
                                                                                      icon: <TrendingUp size={18} />,    color: "text-amber-400",   bg: "bg-amber-400/10"   },
    { label: "Active Today",    value: Math.floor(employees.length * 0.87),           icon: <CalendarCheck size={18} />, color: "text-purple-400",  bg: "bg-purple-400/10"  },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Company overview" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-surface-card border border-surface-border rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400">{s.label}</p>
              <span className={`p-1.5 rounded-lg ${s.bg} ${s.color}`}>{s.icon}</span>
            </div>
            <p className={`text-3xl font-bold font-mono ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-card border border-surface-border rounded-xl p-5"
        >
          <p className="text-sm font-medium text-white mb-4">Employees by Department</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptStats} barSize={28}>
              <XAxis dataKey="dept" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "#171c27", border: "1px solid #232a3a", borderRadius: 8 }}
                labelStyle={{ color: "#e2e8f0" }}
                itemStyle={{ color: "#94a3b8" }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="count" radius={[4,4,0,0]}>
                {deptStats.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-surface-card border border-surface-border rounded-xl p-5"
        >
          <p className="text-sm font-medium text-white mb-4">Recent Activity</p>
          <ul className="space-y-3">
            {activity.map((a, i) => (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                <div>
                  <p className="text-sm text-slate-300">{a.action}</p>
                  <p className="text-xs text-slate-500">{a.time}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Leave requests — manager only */}
      {user?.role === "manager" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-card border border-surface-border rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-white">Leave Requests</p>
            {pendingLeaves.length > 0 && (
              <Badge variant="amber">{pendingLeaves.length} pending</Badge>
            )}
          </div>

          {requests.length === 0 ? (
            <p className="text-sm text-slate-500 py-4 text-center">No leave requests yet.</p>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {requests.map((r) => (
                  <motion.div
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className="flex items-center justify-between gap-4 p-3 rounded-lg bg-surface border border-surface-border"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={r.image} alt={r.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm text-white font-medium truncate">{r.name}</p>
                        <p className="text-xs text-slate-500 truncate">{r.reason} · {r.from} → {r.to}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {r.status === "pending" ? (
                        <>
                          <button
                            onClick={() => approveLeave(r.id)}
                            className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                          >
                            <CheckCircle2 size={14} /> Approve
                          </button>
                          <button
                            onClick={() => rejectLeave(r.id)}
                            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors"
                          >
                            <XCircle size={14} /> Reject
                          </button>
                        </>
                      ) : (
                        <Badge variant={r.status === "approved" ? "green" : "red"}>
                          {r.status}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-40 bg-surface-card rounded" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-surface-card rounded-xl border border-surface-border" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="h-72 bg-surface-card rounded-xl border border-surface-border" />
        <div className="h-72 bg-surface-card rounded-xl border border-surface-border" />
      </div>
    </div>
  );
}