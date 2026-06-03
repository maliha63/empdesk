import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useEmployees } from "../hooks/useEmployees";
import { useLeave } from "../hooks/useLeave";
import { useAuth } from "../hooks/useAuth";
import { getRecentActivity } from "../utils/mockData";
import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/Badge";
import Card from "../components/Card";
import {
  Users,
  Building2,
  CalendarCheck,
  TrendingUp,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#f43f5e",
  "#06b6d4",
];

export default function DashboardPage() {
  const { employees, isLoading } = useEmployees();
  const { requests, approveLeave, rejectLeave } = useLeave();
  const { user } = useAuth();
  const activity = getRecentActivity();

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
    {
      label: "Total Employees",
      value: employees.length,
      icon: <Users size={18} />,
      color: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-500",
      cardBg: "bg-gradient-to-br from-blue-50 to-blue-100/60 dark:from-blue-500/10 dark:to-blue-500/5",
      border: "border border-blue-100 dark:border-blue-500/15",
      trend: "+4.3% vs last month",
    },
    {
      label: "Departments",
      value: deptStats.length,
      icon: <Building2 size={18} />,
      color: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-500",
      cardBg: "bg-gradient-to-br from-emerald-50 to-emerald-100/60 dark:from-emerald-500/10 dark:to-emerald-500/5",
      border: "border border-emerald-100 dark:border-emerald-500/15",
      trend: "Active divisions",
    },
    {
      label: "Avg Age",
      value: Math.round(
        employees.reduce((s, e) => s + (e.age || 0), 0) / (employees.length || 1)
      ),
      icon: <TrendingUp size={18} />,
      color: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-500",
      cardBg: "bg-gradient-to-br from-amber-50 to-amber-100/60 dark:from-amber-500/10 dark:to-amber-500/5",
      border: "border border-amber-100 dark:border-amber-500/15",
      trend: "Workforce average",
    },
    {
      label: "Active Today",
      value: Math.floor(employees.length * 0.87),
      icon: <CalendarCheck size={18} />,
      color: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-500",
      cardBg: "bg-gradient-to-br from-purple-50 to-purple-100/60 dark:from-purple-500/10 dark:to-purple-500/5",
      border: "border border-purple-100 dark:border-purple-500/15",
      trend: "87% attendance rate",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Here's an overview of your workforce today."
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.3 }}
          >
            <div
              className={`relative overflow-hidden rounded-2xl p-5 ${s.cardBg} ${s.border}
                transition-all duration-200 hover:shadow-[0_8px_24px_-4px_rgb(0,0,0,0.10)] 
                dark:hover:shadow-[0_8px_24px_-4px_rgb(0,0,0,0.4)] hover:-translate-y-px`}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="text-[11px] font-semibold text-gray-500 dark:text-[#4b5e7a] uppercase tracking-widest leading-tight">
                  {s.label}
                </p>
                <div className={`w-8 h-8 rounded-xl ${s.iconBg} flex items-center justify-center text-white shadow-sm shrink-0`}>
                  {s.icon}
                </div>
              </div>
              <p className={`text-3xl font-bold font-mono tracking-tight ${s.color}`}>
                {s.value}
              </p>
              <p className="text-[11px] text-gray-500 dark:text-[#4b5e7a] mt-1.5 flex items-center gap-1">
                <ArrowUpRight size={11} className="text-emerald-500 dark:text-emerald-400 shrink-0" />
                {s.trend}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <motion.div className="lg:col-span-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
          <Card title="Employees by Department" subtitle="Headcount distribution across all divisions" className="h-full">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={deptStats} barSize={26} margin={{ top: 8, right: 4 }}>
                <XAxis dataKey="dept" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {deptStats.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
          <Card title="Recent Activity" subtitle="Latest actions in the system" className="h-full">
            <ul className="space-y-3">
              {activity.map((a, i) => (
                <motion.li key={a.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.05 }} className="flex items-start gap-3">
                  <div className="mt-1.25 flex flex-col items-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-brand-400 dark:bg-brand-500 ring-2 ring-blue-100 dark:ring-blue-500/20" />
                  </div>
                  <div className="pb-3 flex-1 min-w-0">
                    <p className="text-[13px] text-gray-700 dark:text-gray-300 leading-snug">{a.action}</p>
                    <p className="text-[11px] text-gray-400 dark:text-[#4b5e7a] mt-0.5">{a.time}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* Leave Requests - Full Width */}
      {user?.role === "manager" && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card title="Leave Requests" subtitle="Review and action pending requests">
            {requests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-2 px-5">
                <Clock size={28} className="text-gray-400 dark:text-gray-500" />
                <p className="text-sm font-medium text-gray-400 dark:text-gray-400">No leave requests yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                <AnimatePresence>
                  {requests.map((r) => (
                    <motion.div
                      key={r.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors"
                    >
                      <img src={r.image} alt={r.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white">{r.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {r.reason} • {r.from} → {r.to}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {r.status === "pending" ? (
                          <>
                            <button
                              onClick={() => approveLeave(r.id)}
                              className="px-5 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => rejectLeave(r.id)}
                              className="px-5 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                            >
                              Reject
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
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="skeleton h-5 w-28 rounded-lg" />
        <div className="skeleton h-4 w-52 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-25 rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="skeleton lg:col-span-3 h-80 rounded-2xl" />
        <div className="skeleton lg:col-span-2 h-80 rounded-2xl" />
      </div>
    </div>
  );
}