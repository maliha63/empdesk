import { useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

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
  ChevronLeft, ChevronRight, ListTodo,
  CheckCircle2, UserCheck, Briefcase,  
  CheckSquare, LogIn, LogOut, CalendarPlus, ShieldAlert
} from "lucide-react";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, 
  AreaChart, Area, CartesianGrid, PieChart, Pie
} from "recharts";

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

// Leave Balance
const annualLeaveRemaining = 12;
const medicalLeaveRemaining = 5;

const EMPLOYEE_LEAVE_DISTRIBUTION = [
  { name: "Annual Remaining", value: annualLeaveRemaining, fill: "#3b82f6" },
  { name: "Medical Remaining", value: medicalLeaveRemaining, fill: "#10b981" },
];

// Production Analytics Dataset for Managers
const MANAGER_TREND_DATA = [
  { name: "Jan", attendance: 88, productivity: 82 },
  { name: "Feb", attendance: 92, productivity: 85 },
  { name: "Mar", attendance: 87, productivity: 84 },
  { name: "Apr", attendance: 94, productivity: 89 },
  { name: "May", attendance: 90, productivity: 88 },
  { name: "Jun", attendance: 95, productivity: 91 },
  { name: "Jul", attendance: 91, productivity: 89 },
  { name: "Aug", attendance: 93, productivity: 92 },
  { name: "Sep", attendance: 96, productivity: 94 },
];

const EMPLOYEE_ACTIVITY_DATA = [
  { name: "Week 1", checkIns: 100, tasks: 90 },
  { name: "Week 2", checkIns: 100, tasks: 95 },
  { name: "Week 3", checkIns: 80, tasks: 85 },
  { name: "Week 4", checkIns: 100, tasks: 100 },
];

const PERSONAL_TASKS = [
  { id: 1, title: "Optimize Recharts rendering performance blueprints", status: "In Progress", priority: "High" },
  { id: 2, title: "Resolve theme toggler variable context styles", status: "Review", priority: "Medium" },
  { id: 3, title: "Refactor dynamic context navigation hooks", status: "Completed", priority: "High" },
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
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, type: "prev" });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, type: "curr" });
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) cells.push({ day: i, type: "next" });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrent(new Date(year, month - 1, 1))} className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card2)] transition-colors">
          <ChevronLeft size={14} />
        </button>
        <span className="text-sm font-medium text-[var(--text-primary)]">{MONTHS[month]} {year}</span>
        <button onClick={() => setCurrent(new Date(year, month + 1, 1))} className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card2)] transition-colors">
          <ChevronRight size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d) => (
          <div key={d} className={`text-[10px] font-medium text-center py-1 ${d === "Sa" || d === "Su" ? "text-red-400" : "text-[var(--text-muted)]"}`}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-[var(--border)] rounded-xl overflow-hidden flex-1">
        {cells.map((cell, i) => (
          <div 
            key={i} 
            className={`h-9 flex items-center justify-center text-[11px] font-medium transition-colors ${
              cell.type === "curr" && 
              cell.day === today.getDate() && 
              month === today.getMonth() && 
              year === today.getFullYear() 
                ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold" 
                : cell.type !== "curr" 
                  ? "text-[var(--text-muted)] bg-[var(--bg-card)]" 
                  : (i % 7 === 5 || i % 7 === 6) 
                    ? "text-red-400 hover:bg-[var(--bg-card2)]" 
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-card2)] cursor-pointer"
            }`}
          >
            {cell.day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { employees, isLoading } = useEmployees();
  const { requests, approveLeave, rejectLeave } = useLeave();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);

  const notices = getNotices();
  const events = getUpcomingEvents();

  const handleClockInToggle = () => {
    if (!isClockedIn) {
      setClockInTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setClockInTime(null);
    }
    setIsClockedIn(!isClockedIn);
  };

  const handleApplyLeaveNavigation = () => {
    navigate("/profile");
  };

  const deptStats = useMemo(() => {
    const map: Record<string, number> = {};
    employees.forEach((e) => {
      const dept = e.company?.department ?? "Unknown";
      map[dept] = (map[dept] ?? 0) + 1;
    });
    return Object.entries(map).map(([dept, count]) => ({ dept, count })).sort((a, b) => b.count - a.count);
  }, [employees]);

  const pendingLeaves = requests.filter((r) => r.status === "pending").length;
  const isManager = user?.role === "manager";

  const displayLeaves = useMemo(() => {
    return requests.filter(r => 
      r.employeeId === user?.id || 
      r.name?.toLowerCase() === `${user?.firstName} ${user?.lastName}`.toLowerCase() ||
      r.name?.toLowerCase() === "sophia brown"
    );
  }, [requests, user]);

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        description={isManager ? "Here's an operational overview of your workforce layout today." : "Welcome back, Team Member. Here is your personalized tracking console."} 
      />

      {/* Stat Cards - Aggressive Flat Design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isManager ? (
          <>
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-5 shadow-none hover:shadow-none">
              <div className="flex items-center justify-between mb-3"><p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Total Headcount</p><div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600"><Users size={18} /></div></div>
              <p className="text-3xl font-bold text-[var(--text-primary)]">{employees.length}</p>
            </div>
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-5 shadow-none hover:shadow-none">
              <div className="flex items-center justify-between mb-3"><p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Action Items</p><div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600"><Clock size={18} /></div></div>
              <p className="text-3xl font-bold text-amber-500">{pendingLeaves}</p>
            </div>
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-5 shadow-none hover:shadow-none">
              <div className="flex items-center justify-between mb-3"><p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Global Attendance</p><div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600"><CalendarCheck size={18} /></div></div>
              <p className="text-3xl font-bold text-emerald-600">87%</p>
            </div>
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-5 shadow-none hover:shadow-none">
              <div className="flex items-center justify-between mb-3"><p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Active Divisions</p><div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600"><Building2 size={18} /></div></div>
              <p className="text-3xl font-bold text-[var(--text-primary)]">{deptStats.length}</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-5 shadow-none hover:shadow-none">
              <div className="flex items-center justify-between mb-3"><p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">My Attendance</p><div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600"><UserCheck size={18} /></div></div>
              <p className="text-3xl font-bold text-blue-600">96%</p>
            </div>
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-5 shadow-none hover:shadow-none">
              <div className="flex items-center justify-between mb-3"><p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Leave Bank</p><div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600"><Clock size={18} /></div></div>
              <p className="text-3xl font-bold text-[var(--text-primary)]">{annualLeaveRemaining + medicalLeaveRemaining} <span className="text-xs text-[var(--text-muted)] font-normal">Days Left</span></p>
            </div>
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-5 shadow-none hover:shadow-none">
              <div className="flex items-center justify-between mb-3"><p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Tasks Finalized</p><div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600"><CheckSquare size={18} /></div></div>
              <p className="text-3xl font-bold text-emerald-600">24</p>
            </div>
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-5 shadow-none hover:shadow-none">
              <div className="flex items-center justify-between mb-3"><p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">Active Assignment</p><div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center text-purple-600"><Briefcase size={18} /></div></div>
              <p className="text-lg font-bold text-purple-600 truncate">EmpDesk Architecture</p>
            </div>
          </>
        )}
      </div>

      {/* Analytics Section */}
      {isManager ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Card title="Corporate Workforce Trends" subtitle="Company Attendance Fluctuations vs Measured Productivity Performance" className="shadow-none hover:shadow-none !shadow-none">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={MANAGER_TREND_DATA} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="managerAtt" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                    <linearGradient id="managerProd" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.12}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.08)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <YAxis tickLine={false} axisLine={false} width={45} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" name="Attendance Rate %" dataKey="attendance" stroke="#3b82f6" strokeWidth={2} fill="url(#managerAtt)" />
                  <Area type="monotone" name="Productivity %" dataKey="productivity" stroke="#f59e0b" strokeWidth={2} fill="url(#managerProd)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <div className="xl:col-span-1">
            <Card title="Division Headcounts" subtitle="Headcount breakdown metrics across primary departments" className="shadow-none hover:shadow-none !shadow-none">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={deptStats.slice(0, 5)} barSize={16} margin={{ top: 15, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.08)" />
                  <XAxis dataKey="dept" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--text-muted)" }} />
                  <YAxis tickLine={false} axisLine={false} width={35} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {deptStats.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Card title="My Engagement Ledger" subtitle="Personal Attendance Cycles vs Assignment Targets Completed" className="shadow-none hover:shadow-none !shadow-none h-full">
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={EMPLOYEE_ACTIVITY_DATA} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="empCheck" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.12}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.08)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <YAxis tickLine={false} axisLine={false} width={40} tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                  <Tooltip contentStyle={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                  <Area type="monotone" name="Attendance Rate %" dataKey="checkIns" stroke="#10b981" strokeWidth={2} fill="url(#empCheck)" />
                  <Area type="monotone" name="Task Velocity %" dataKey="tasks" stroke="#8b5cf6" strokeWidth={2} fill="none" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </div>
          <div className="xl:col-span-1">
            <Card title="Leave Allocation Balance" subtitle="Structural breakdown of available leave time" className="shadow-none hover:shadow-none !shadow-none h-full">
              <div className="flex flex-col items-center justify-center h-[260px] pt-2">
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={EMPLOYEE_LEAVE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                      {EMPLOYEE_LEAVE_DISTRIBUTION.map((entry, idx) => <Cell key={idx} fill={entry.fill} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-[11px] text-[var(--text-secondary)] font-medium">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500"/>Annual ({annualLeaveRemaining})</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"/>Medical ({medicalLeaveRemaining})</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
            
            <Card title={isManager ? "Leave status" : "My Leave History"} subtitle="Recent logs timeline" className="shadow-none hover:shadow-none !shadow-none">
              {/* ... rest of the leave card content remains same ... */}
              <div className="space-y-0 h-64 overflow-y-auto pr-1">
                {displayLeaves.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] text-xs p-4 py-12">
                    <CheckCircle2 size={16} className="text-emerald-500 mb-1" />
                    <span>No active time-off requests logged.</span>
                  </div>
                ) : (
                  displayLeaves.slice(0, 5).map((req) => (
                    <div key={req.id} className="flex items-center justify-between gap-3 py-3.5 border-b border-[var(--border)] last:border-0">
                      <div className="min-w-0 flex-1">
                        {isManager ? (
                          <>
                            <div className="flex justify-between items-baseline">
                              <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{req.reason}</p>
                              <span className="text-[9px] text-[var(--text-muted)] shrink-0 ml-2">{req.from}</span>
                            </div>
                            <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">{req.name} · Staff Member</p>
                          </>
                        ) : (
                          <div className="flex flex-col gap-0.5">
                            <div className="flex justify-between items-center w-full">
                              <p className="text-xs font-bold text-[var(--text-primary)] truncate">{req.reason}</p>
                              <span className="text-[10px] text-[var(--text-muted)] tracking-tight font-mono">{req.from}</span>
                            </div>
                            <p className="text-[10px] text-[var(--text-muted)]">Time-off Duration Logs</p>
                          </div>
                        )}
                      </div>
                      <Badge variant={req.status === "approved" ? "green" : req.status === "pending" ? "yellow" : "red"}>{req.status}</Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card title="Notice board" subtitle="Global organizational logs" className="shadow-none hover:shadow-none !shadow-none">
              <div className="space-y-0 h-64 overflow-y-auto pr-1">
                {notices.slice(0, 4).map((notice, idx) => (
                  <div key={notice.id} className="flex gap-2.5 py-3 border-b border-[var(--border)] last:border-0">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${notice.priority === "high" ? "bg-red-500" : "bg-blue-500"}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{notice.title}</p>
                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 mt-0.5 leading-tight">
                        {idx === 0 && "Office closed on 10th June for scheduled maintenance. All staff requested to work remotely."}
                        {idx === 1 && "Team building event this Friday at 4 PM. Please confirm your participation by tomorrow."}
                        {idx === 2 && "New HR policy update regarding remote work and flexible hours effective from next month."}
                        {idx === 3 && "Quarterly performance review cycle begins next week. Submit your self-assessment by 15th June."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {isManager ? (
              <Card title="Pending requests" subtitle="Action items required" className="shadow-none hover:shadow-none !shadow-none">
                <div className="space-y-0 h-64 overflow-y-auto pr-1">
                  {requests.filter((r) => r.status === "pending").length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)] text-center py-12">
                      <CheckCircle2 size={32} className="text-emerald-500 mb-3" />
                      <p className="font-medium text-[var(--text-primary)]">No pending leave requests</p>
                      <p className="text-sm mt-1">All requests have been processed.</p>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {requests.filter((r) => r.status === "pending").map((r) => (
                        <motion.div key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 py-2.5 border-b border-[var(--border)] last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{r.name}</p>
                            <p className="text-[10px] text-[var(--text-muted)] truncate">{r.reason}</p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button onClick={() => approveLeave(r.id)} className="p-1 px-2 text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-md hover:bg-emerald-100 transition-colors">✓</button>
                            <button onClick={() => rejectLeave(r.id)} className="p-1 px-2 text-[10px] bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-md hover:bg-red-100 transition-colors">✕</button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </div>
              </Card>
            ) : (
              <Card title="My Work Assignments" subtitle="Active operation items tracker" icon={<ListTodo size={16} />} className="shadow-none hover:shadow-none !shadow-none">
                <div className="space-y-0 h-64 overflow-y-auto pr-1">
                  {PERSONAL_TASKS.map((task) => (
                    <div key={task.id} className="py-2.5 border-b border-[var(--border)] last:border-0 flex flex-col gap-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-xs font-semibold text-[var(--text-primary)] leading-tight">{task.title}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
                          task.priority === "High" ? "bg-red-50 text-red-600 dark:bg-red-950/20 dark:text-red-400" : "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400"
                        }`}>{task.priority}</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-[var(--text-muted)]">Sprint Item</span>
                        <span className={`text-[10px] font-medium ${task.status === "Completed" ? "text-emerald-500" : "text-blue-400"}`}>{task.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-4 shadow-none hover:shadow-none h-full flex flex-col">
            <MiniCalendar />
            
            <div className="mt-4 pt-3 border-t border-[var(--border)] mt-auto">
              {isManager ? (
                <div>
                  <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wide mb-1.5">Management Summary</p>
                  <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-900/40 p-2 rounded-xl border border-gray-100 dark:border-gray-800">
                    <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1.5 font-medium">
                      {pendingLeaves > 0 ? <ShieldAlert size={13} className="text-amber-500" /> : <CheckCircle2 size={13} className="text-emerald-500" />}
                      Action Items
                    </span>
                    <span className="text-xs font-bold text-[var(--text-primary)]">{pendingLeaves > 0 ? `${pendingLeaves} Tasks` : "Stable"}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <button 
                      onClick={handleClockInToggle}
                      className={`flex-1 py-2 rounded-xl font-bold text-[10px] text-center flex items-center justify-center gap-1 transition-colors ${
                        isClockedIn 
                          ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200/30" 
                          : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200/30"
                      }`}
                    >
                      {isClockedIn ? <LogOut size={11} /> : <LogIn size={11} />}
                      {isClockedIn ? "Clock Out" : "Clock In"}
                    </button>
                    <button 
                      onClick={handleApplyLeaveNavigation}
                      className="flex-1 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-200/30 font-bold text-[10px] text-center flex items-center justify-center gap-1 transition-colors"
                    >
                      <CalendarPlus size={11} />
                      Request Leave
                    </button>
                  </div>
                  {isClockedIn && clockInTime && (
                    <p className="text-[9px] text-center text-emerald-500 font-semibold animate-pulse tracking-wide">
                      Shift operational since {clockInTime}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse p-6">
      <div className="space-y-2">
        <div className="h-5 w-28 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="h-4 w-52 bg-gray-200 dark:bg-gray-800 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}
      </div>
      <div className="space-y-6">
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 h-56 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
          <div className="lg:col-span-1 h-56 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}