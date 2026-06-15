import { useMemo, useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { getMockPerformance, getMockAttendance } from "../utils/mockData";
import { PageHeader } from "../components/PageHeader";
import {
  Download,
  Star,
  TrendingUp,
  CheckCircle2,
  Users,
  Award,
  Clock,
  Target,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import toast, { Toaster } from "react-hot-toast";

// ── Shared Workspace Layout Core Components ─────────────────────────────────
import Button from "../components/Button";
import Card from "../components/Card";
import { DatePicker } from "../components/DatePicker";
import CustomSelect from "../components/CustomSelect";

const TREND_OPTIONS = [
  { value: "year", label: "This Year" },
  { value: "6months", label: "Last 6 Months" },
  { value: "3months", label: "Last 3 Months" },
];

const TASKS_OPTIONS = [
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_year", label: "This Year" },
];

const TASKS_DATA: Record<string, { assigned: number; completed: number }> = {
  this_month: { assigned: 41, completed: 32 },
  last_month: { assigned: 38, completed: 30 },
  this_year: { assigned: 210, completed: 178 },
};

function StarRating({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < Math.floor(value) || (i < value && value % 1 >= 0.5)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 dark:text-gray-700"
          }
        />
      ))}
    </div>
  );
}

function CircularScore({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color =
    score >= 85
      ? "#10b981"
      : score >= 70
        ? "#3b82f6"
        : score >= 55
          ? "#f59e0b"
          : "#ef4444";
  const label =
    score >= 85
      ? "Excellent"
      : score >= 70
        ? "Good"
        : score >= 55
          ? "Average"
          : "Poor";

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="120" height="120" className="-rotate-90">
        <circle
          cx="60"
          cy="65"
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth="6"
          className="text-gray-100 dark:text-gray-800"
        />
        <circle
          cx="60"
          cy="65"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center pointer-events-none mt-2">
        <span className="text-xl font-black text-(--text-primary)">
          {score}
        </span>
        <span className="text-[9px] text-(--text-muted)">/100</span>
        <span className="text-[10px] font-bold mt-0.5" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
}

export default function MyPerformancePage() {
  const { user } = useAuth();

  const [trendPeriod, setTrendPeriod] = useState("year");
  const [tasksPeriod, setTasksPeriod] = useState("this_month");

  const today = new Date().toISOString().slice(0, 10);
  const firstOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  )
    .toISOString()
    .slice(0, 10);
  const [dateFrom, setDateFrom] = useState(firstOfMonth);
  const [dateTo, setDateTo] = useState(today);

  const allPerformance = useMemo(
    () => getMockPerformance(user?.id ?? 1),
    [user?.id],
  );
  const attendance = useMemo(
    () => getMockAttendance(user?.id ?? 1),
    [user?.id],
  );

  const trendData = useMemo(() => {
    if (trendPeriod === "3months") return allPerformance.slice(-3);
    if (trendPeriod === "6months") return allPerformance.slice(-6);
    return allPerformance;
  }, [allPerformance, trendPeriod]);

  const avgScore = useMemo(
    () =>
      Math.round(trendData.reduce((s, p) => s + p.score, 0) / trendData.length),
    [trendData],
  );

  const attendanceSummary = useMemo(() => {
    const total = attendance.length || 26;
    const present =
      attendance.filter((a) => a.status === "Present").length || 25;
    return { total, present, pct: Math.round((present / total) * 100) };
  }, [attendance]);

  const taskStats = useMemo(() => {
    const d = TASKS_DATA[tasksPeriod] ?? TASKS_DATA.this_month;
    return { ...d, pending: Math.max(0, d.assigned - d.completed) };
  }, [tasksPeriod]);

  const taskCompletionPct = Math.round(
    (taskStats.completed / taskStats.assigned) * 100,
  );
  const managerRating = 4.6;

  const tasksChartData = useMemo(
    () => [
      { label: "Assigned", value: taskStats.assigned, color: "#3b82f6" },
      { label: "Completed", value: taskStats.completed, color: "#10b981" },
      { label: "Pending", value: taskStats.pending, color: "#f59e0b" },
    ],
    [taskStats],
  );

  const handleDownloadReport = useCallback(() => {
    if (!dateFrom || !dateTo) {
      toast.error("Please select both From and To dates.");
      return;
    }
    if (new Date(dateTo) < new Date(dateFrom)) {
      toast.error("'To' date must be after 'From' date.");
      return;
    }

    const name =
      `${user?.firstName ?? "Employee"} ${user?.lastName ?? ""}`.trim();
    const lines = [
      `Performance Report — ${name}`,
      `Period: ${dateFrom} to ${dateTo}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "Month,Score,Tasks Completed",
      ...trendData.map((p) => `${p.month},${p.score},${p.tasksCompleted}`),
      "",
      `Average Score,${avgScore}`,
      `Attendance,${attendanceSummary.pct}%`,
      `Task Completion,${taskCompletionPct}%`,
      `Manager Rating,${managerRating}/5`,
    ];

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `Performance_Report_${name.replace(/\s+/g, "_")}_${dateFrom}_${dateTo}.csv`,
    });
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Spreadsheet report statement generated successfully.");
  }, [
    dateFrom,
    dateTo,
    trendData,
    avgScore,
    attendanceSummary,
    taskCompletionPct,
    user,
  ]);

  const strengths = ["Problem Solving", "Design Quality", "Timely Delivery"];
  const feedback = {
    text: "Consistently delivers high-quality work and meets deadlines. Great collaboration and positive attitude.",
    reviewer: "Sarah Johnson",
    role: "Team Lead",
    date: "May 31, 2025",
    avatar: `https://i.pravatar.cc/64?u=${user?.id ?? 1}`,
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* ── Header Toolbar Controls ── */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <PageHeader
          title="My Performance"
          description="Track your performance and grow every day"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "My Performance" },
          ]}
        />

        <div className="flex flex-wrap items-end gap-3 self-end lg:self-auto shrink-0 text-left">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-(--text-muted) uppercase tracking-wide">
              From
            </span>
            <DatePicker
              value={dateFrom}
              onChange={setDateFrom}
              placeholder="Start date"
              className="w-36"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-(--text-muted) uppercase tracking-wide">
              To
            </span>
            <DatePicker
              value={dateTo}
              onChange={setDateTo}
              placeholder="End date"
              className="w-36"
            />
          </div>
          <Button
            variant="secondary"
            icon={<Download size={13} />}
            onClick={handleDownloadReport}
          >
            Download Report
          </Button>
        </div>
      </div>

      {/* ── 4 Locked Stat Cards (flat={true} applied to remove hover translates) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          flat={true}
          className="p-5 flex flex-col items-center justify-between text-center min-h-35"
        >
          <p className="text-xs font-semibold text-(--text-muted) self-start uppercase tracking-wider">
            Performance Score
          </p>
          <CircularScore score={avgScore} />
          <p className="text-[10px] text-gray-400 font-semibold mt-1">
            Based on {trendData.length} active periods
          </p>
        </Card>

        <Card
          flat={true}
          className="p-5 flex flex-col justify-between text-left min-h-35"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
                Attendance
              </p>
              <p className="text-3xl font-black text-(--text-primary) mt-1">
                {attendanceSummary.pct}%
              </p>
            </div>
            <Clock size={16} className="text-blue-500 shrink-0" />
          </div>
          <div className="mt-2 space-y-1">
            <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-1.5 rounded-full bg-emerald-500 transition-all"
                style={{ width: `${attendanceSummary.pct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-400">
              <span className="text-emerald-500">Present</span>
              <span>
                {attendanceSummary.present} / {attendanceSummary.total} Days
              </span>
            </div>
          </div>
        </Card>

        <Card
          flat={true}
          className="p-5 flex flex-col justify-between text-left min-h-35"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
                Task Completion
              </p>
              <p className="text-3xl font-black text-(--text-primary) mt-1">
                {taskCompletionPct}%
              </p>
            </div>
            <Target size={16} className="text-purple-500 shrink-0" />
          </div>
          <div className="mt-2 space-y-1">
            <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className="h-1.5 rounded-full bg-purple-500 transition-all"
                style={{ width: `${taskCompletionPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-gray-400">
              <span className="text-purple-500">Completed</span>
              <span>
                {taskStats.completed} / {taskStats.assigned} Tasks
              </span>
            </div>
          </div>
        </Card>

        <Card
          flat={true}
          className="p-5 flex flex-col justify-between text-left min-h-35"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wider">
                Manager Rating
              </p>
              <p className="text-3xl font-black text-(--text-primary) mt-1">
                {managerRating}
              </p>
            </div>
            <Award size={16} className="text-amber-400 shrink-0" />
          </div>
          <div className="mt-2 space-y-1">
            <StarRating value={managerRating} />
            <p className="text-[10px] text-gray-400 font-bold tracking-wide uppercase">
              Out of 5 Stars
            </p>
          </div>
        </Card>
      </div>

      {/* ── Recharts Graphs Blocks Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trend Area Layout Block */}
        <Card flat={true} className="p-5 text-left">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              Performance Trend
            </p>
            <CustomSelect
              value={trendPeriod}
              onChange={(v) => setTrendPeriod(String(v))}
              options={TREND_OPTIONS}
            />
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trendData}
                margin={{ top: 4, right: 4, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                  strokeOpacity={0.06}
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#scoreGrad)"
                  dot={{ r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Dynamic Tasks Distribution Bar Element */}
        <Card flat={true} className="p-5 text-left">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              Tasks Overview
            </p>
            <CustomSelect
              value={tasksPeriod}
              onChange={(v) => setTasksPeriod(String(v))}
              options={TASKS_OPTIONS}
            />
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tasksChartData}
                margin={{ top: 4, right: 4, left: -25, bottom: 0 }}
                barSize={32}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  vertical={false}
                  strokeOpacity={0.06}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Bar dataKey="value" radius={[5, 5, 0, 0]}>
                  {tasksChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ── Feedbacks & Review Blocks Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-left">
        <Card flat={true} className="p-5 flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-4">
              Manager Feedback
            </p>
            <div className="flex items-start gap-1">
              <span className="text-blue-300 text-3xl font-serif leading-none opacity-40">
                “
              </span>
              <p className="text-xs text-(--text-secondary) font-medium leading-relaxed italic">
                {feedback.text}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 pt-3 border-t border-(--border)">
            <img
              src={feedback.avatar}
              alt=""
              className="w-8 h-8 rounded-full object-cover bg-gray-50 border"
            />
            <div>
              <p className="text-xs font-bold text-(--text-primary)">
                {feedback.reviewer}
              </p>
              <p className="text-[10px] text-(--text-muted) font-semibold">
                {feedback.role} · {feedback.date}
              </p>
            </div>
          </div>
        </Card>

        <Card flat={true} className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-(--text-muted) mb-4">
            Top Strengths
          </p>
          <div className="space-y-2.5">
            {strengths.map((s, i) => {
              const palette = [
                { bg: "bg-blue-50 dark:bg-blue-950/20", text: "text-blue-500" },
                {
                  bg: "bg-emerald-50 dark:bg-emerald-950/20",
                  text: "text-emerald-500",
                },
                {
                  bg: "bg-purple-50 dark:bg-purple-950/20",
                  text: "text-purple-500",
                },
              ];
              const icons = [
                <TrendingUp size={14} />,
                <CheckCircle2 size={14} />,
                <Users size={14} />,
              ];
              return (
                <div
                  key={s}
                  className={`flex items-center gap-3 p-2.5 border border-(--border)] rounded-xl bg-(--bg-card2)]`}
                >
                  <div
                    className={`p-1.5 rounded-lg shrink-0 ${palette[i].bg} ${palette[i].text}`}
                  >
                    {icons[i]}
                  </div>
                  <span className="text-xs font-bold text-(--text-primary)">
                    {s}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* ── Score Matrix Breakdown Table ── */}
      <Card
        flat={true}
        className="text-left"
        title="Monthly Performance Breakdown"
        subtitle={`Analytical summaries matching continuous evaluation tracks`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-(--border) text-(--text-muted) font-bold bg-gray-50/40 dark:bg-gray-800/10">
                <th className="py-3 pl-4">Month</th>
                <th className="py-3">Efficiency Score</th>
                <th className="py-3">Sprint Tasks Closed</th>
                <th className="py-3 text-center">Status Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border) font-medium text-(--text-primary)">
              {trendData.map((p) => {
                const rating =
                  p.score >= 90
                    ? "Excellent"
                    : p.score >= 75
                      ? "Good"
                      : p.score >= 60
                        ? "Average"
                        : "Poor";
                const rColor =
                  p.score >= 90
                    ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"
                    : p.score >= 75
                      ? "text-blue-600 bg-blue-50 dark:bg-blue-950/30"
                      : p.score >= 60
                        ? "text-amber-600 bg-amber-50 dark:bg-amber-950/30"
                        : "text-red-600 bg-red-50 dark:bg-red-950/30";
                return (
                  <tr
                    key={p.month}
                    className="hover:bg-gray-50/30 transition-colors"
                  >
                    <td className="py-3.5 pl-4 font-semibold">{p.month}</td>
                    <td className="py-3.5 font-mono font-bold text-sm text-blue-500">
                      {p.score}%
                    </td>
                    <td className="py-3.5 font-mono text-(--text-secondary)">
                      {p.tasksCompleted} Tasks
                    </td>
                    <td className="py-3.5 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${rColor}`}
                      >
                        {rating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
