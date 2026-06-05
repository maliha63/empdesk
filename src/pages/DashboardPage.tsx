import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useEmployees } from "../hooks/useEmployees";
import { useLeave } from "../hooks/useLeave";
import { useAuth } from "../hooks/useAuth";
import { getNotices, getUpcomingEvents } from "../utils/mockData";
import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/Badge";
import Card from "../components/Card";
import {
  Users, Building2, CalendarCheck, Clock,
  ChevronLeft, ChevronRight, Bell, TrendingUp
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, LabelList,
  AreaChart, Area, CartesianGrid
} from "recharts";

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];
const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// Mock data tracking for the premium Area Chart layout seen in your images
const PERFORMANCE_TREND_DATA = [
  { name: "Jan", attendance: 70, performance: 65 },
  { name: "Feb", attendance: 78, performance: 72 },
  { name: "Mar", attendance: 72, performance: 68 },
  { name: "Apr", attendance: 85, performance: 80 },
  { name: "May", attendance: 80, performance: 75 },
  { name: "Jun", attendance: 88, performance: 92 },
  { name: "Jul", attendance: 84, performance: 81 },
  { name: "Aug", attendance: 89, performance: 86 },
  { name: "Sep", attendance: 95, performance: 90 },
];

function MiniCalendar() {
  const [current, setCurrent] = useState(new Date());
  const today = new Date();

  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();

  const cells: { day: number; type: "prev" | "curr" | "next" }[] = [];
  for (let i = startOffset - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, type: "prev" });
  for (let i = 1; i <= daysInMonth; i++)
    cells.push({ day: i, type: "curr" });
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++)
    cells.push({ day: i, type: "next" });

  const isToday = (day: number, type: string) =>
    type === "curr" &&
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setCurrent(new Date(year, month - 1, 1))}
          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card2)] transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={() => setCurrent(new Date(year, month + 1, 1))}
          className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card2)] transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className={`text-[10px] font-medium text-center py-1 
              ${d === "Sa" || d === "Su" ? "text-red-400" : "text-[var(--text-muted)]"}`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((cell, i) => {
          const col = i % 7;
          const weekend = col === 5 || col === 6;
          const today_ = isToday(cell.day, cell.type);
          return (
            <div
              key={i}
              className={`text-[11px] text-center py-1 rounded-md
                ${today_
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold"
                  : cell.type !== "curr"
                  ? "text-[var(--text-muted)] opacity-40"
                  : weekend
                  ? "text-red-400"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-card2)] cursor-pointer"
                }`}
            >
              {cell.day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { employees, isLoading } = useEmployees();
  const { requests, approveLeave, rejectLeave } = useLeave();
  const { user } = useAuth();

  const notices = getNotices();
  const events = getUpcomingEvents();

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

  const pendingLeaves = requests.filter((r) => r.status === "pending").length;
  const attendanceRate = 87;

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-5 pb-8">
      <PageHeader
        title="Dashboard"
        description="Here's an overview of your workforce today."
      />

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Employees", value: employees.length, icon: <Users size={18} />, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10" },
          { label: "Pending Leaves", value: pendingLeaves, icon: <Clock size={18} />, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { label: "Attendance Rate", value: `${attendanceRate}%`, icon: <CalendarCheck size={18} />, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: "Departments", value: deptStats.length, icon: <Building2 size={18} />, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                {s.label}
              </p>
              <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
            </div>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid Content Layout Wrapper — Responsive fix */}
      <div className="flex flex-col lg:flex-row gap-5">
        
        {/* Left Columns (Charts + Subcards) */}
        <div className="flex-1 min-w-0 space-y-5">
          
          {/* Main Analytics Block: Grid Splitting Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            
            {/* 1. Refined Premium Area Chart (Fixes Y-Axis issues from Images 1 & 3) */}
            <Card title="Statistic Insights" subtitle="Avg. Attendance vs Academic Progress">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={PERFORMANCE_TREND_DATA} margin={{ top: 15, right: 10, bottom: 5, left: -20 }}>
                  <defs>
                    <linearGradient id="attendanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                    </linearGradient>
                    <linearGradient id="performanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  {/* Subtle clean horizontal guideline reference markers */}
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.15)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  {/* Explicit width padding spacing prevents text overlapping edges */}
                  <YAxis tickLine={false} axisLine={false} width={45} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <Tooltip
                    contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: "var(--text-primary)", fontWeight: 600 }}
                  />
                  <Area type="monotone" name="Avg. Attendance" dataKey="attendance" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#attendanceGrad)" />
                  <Area type="monotone" name="Exam Scores" dataKey="performance" stroke="#f59e0b" strokeWidth={2.5} fillOpacity={1} fill="url(#performanceGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* 2. Department Distribution Bar Chart */}
            <Card title="Employees by department" subtitle="Headcount distribution">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={deptStats} barSize={24} margin={{ top: 20, right: 10, bottom: 5, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.15)" />
                  <XAxis dataKey="dept" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <YAxis tickLine={false} axisLine={false} width={42} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <Tooltip
                    contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: "rgba(0,0,0,0.02)" }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    <LabelList dataKey="count" position="top" style={{ fontSize: 11, fill: "var(--text-secondary)", fontWeight: 500 }} />
                    {deptStats.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Bottom 3-col Sub-grid Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Leave Status Block — Fully revamped layout match to Image 4 specifications */}
            <Card title="Leave status" subtitle="Recent applications">
              <div className="space-y-0 max-h-56 overflow-y-auto pr-1">
                {requests.length === 0 ? (
                  <p className="text-sm text-[var(--text-muted)] py-4 text-center">No requests yet.</p>
                ) : (
                  requests.slice(0, 8).map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center gap-3 py-3 border-b border-[var(--border)] last:border-0"
                    >
                      <img
                        src={req.image}
                        alt={req.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-100 dark:border-gray-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-1">
                          <p className="text-[13px] font-semibold text-[var(--text-primary)] truncate">
                            {req.name}
                          </p>
                          <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                            {req.from} — {req.to}
                          </span>
                        </div>
                        {/* Custom addition tracking designation role fields directly under the header */}
                        <p className="text-[11px] text-blue-500 dark:text-blue-400 font-medium truncate">
                          {req.designation || "Staff Member"}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] truncate mt-0.5 max-w-xs">
                          {req.reason}
                        </p>
                      </div>
                      <Badge
                        variant={
                          req.status === "approved" ? "green"
                          : req.status === "pending" ? "yellow"
                          : "red"
                        }
                      >
                        {req.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Notice Board Card */}
            <Card title="Notice board" subtitle="Latest announcements" icon={<Bell size={16} />}>
              <div className="space-y-0 max-h-56 overflow-y-auto pr-1">
                {notices.map((notice) => (
                  <div key={notice.id} className="flex gap-3 py-3 border-b border-[var(--border)] last:border-0">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notice.priority === "high" ? "bg-red-500" : "bg-blue-500"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[var(--text-primary)] truncate">{notice.title}</p>
                      {/* Sub-text description placeholder handling layout snippets matching image dashboards */}
                      <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-0.5 leading-normal">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                      </p>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{notice.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Conditionally Managed Component Area based on Account Profile Roles */}
            {user?.role === "manager" ? (
              <Card title="Pending requests" subtitle="Review and take action">
                <div className="space-y-0 max-h-56 overflow-y-auto pr-1">
                  {requests.filter((r) => r.status === "pending").length === 0 ? (
                    <p className="text-sm text-[var(--text-muted)] py-4 text-center">No pending requests.</p>
                  ) : (
                    <AnimatePresence>
                      {requests
                        .filter((r) => r.status === "pending")
                        .map((r) => (
                          <motion.div
                            key={r.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3 py-2.5 border-b border-[var(--border)] last:border-0"
                          >
                            <img src={r.image} alt={r.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{r.name}</p>
                              <p className="text-xs text-[var(--text-muted)] truncate">{r.reason}</p>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button onClick={() => approveLeave(r.id)} className="p-1 px-2.5 text-xs bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 transition-colors">✓</button>
                              <button onClick={() => rejectLeave(r.id)} className="p-1 px-2.5 text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 transition-colors">✕</button>
                            </div>
                          </motion.div>
                        ))}
                    </AnimatePresence>
                  )}
                </div>
              </Card>
            ) : (
              <Card title="Upcoming sessions" subtitle="Live classes timeline" icon={<TrendingUp size={16} />}>
                <div className="space-y-0 max-h-56 overflow-y-auto pr-1">
                  {events.map((event) => (
                    <div key={event.id} className="flex gap-4 py-2.5 border-b border-[var(--border)] last:border-0 items-center">
                      <div className="text-[11px] font-medium text-blue-500 bg-blue-50 dark:bg-blue-950/40 p-1.5 rounded-lg text-center shrink-0 w-20">
                        {event.time}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{event.title}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{event.date} · Scheduled</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Right Sidebar Columns (Calendar + Metric Events Tracking) */}
        <div className="w-full lg:w-56 shrink-0 space-y-5">
          <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-4 shadow-sm">
            <MiniCalendar />
          </div>

          <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-4 shadow-sm">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">Upcoming events</p>
            <p className="text-xs text-[var(--text-muted)] mb-3">This week</p>
            <div className="space-y-0">
              {events.map((event) => (
                <div key={event.id} className="py-2.5 border-b border-[var(--border)] last:border-0">
                  <p className="text-xs font-medium text-[var(--text-primary)]">{event.title}</p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {event.date} · {event.time}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-5 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-4 w-52 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
      </div>
      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1 space-y-5">
          <div className="h-72 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {[...Array(3)].map((_, i) => <div key={i} className="h-52 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
          </div>
        </div>
        <div className="w-full lg:w-56 space-y-5">
          <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}