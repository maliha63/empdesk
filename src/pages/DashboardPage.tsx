import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEmployees } from "../hooks/useEmployees";
import { useLeave } from "../hooks/useLeave";
import { useAuth } from "../hooks/useAuth";
import { getNotices } from "../utils/mockData";
import { Dropdown } from "../components/Dropdown";
import {
  Users,
  CalendarCheck,
  Clock,
  Building2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  UserCheck,
  CheckSquare,
  FileText,
  Eye,
  Calendar as CalendarIcon,
  AlertCircle,
  BarChart2,
  UserPlus,
  Filter,
  Award,
  Circle,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
} from "recharts";

/* ── TIMEFRAME EMULATION CONFIG ── */
const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

const categoryMeta = {
  meeting: {
    icon: <Users size={14} />,
    dot: "bg-purple-500",
    card: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800",
    textCls: "text-purple-600 dark:text-purple-400",
  },
  deadline: {
    icon: <Clock size={14} />,
    dot: "bg-red-500",
    card: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
    textCls: "text-red-600 dark:text-red-400",
  },
  social: {
    icon: <Award size={14} />,
    dot: "bg-emerald-500",
    card: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800",
    textCls: "text-emerald-600 dark:text-emerald-400",
  },
  training: {
    icon: <BookOpen size={14} />,
    dot: "bg-orange-500",
    card: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
    textCls: "text-orange-600 dark:text-orange-400",
  },
};

function BookOpen({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h6a4 4 0 0 0-4 4v14a3 3 0 0 1-3-3H22z" />
    </svg>
  );
}

const EMP_DATA_BY_TIMEFRAME = {
  "This Week": {
    attendanceStrip: [
      { day: "Mon 9", status: "present", label: "Mon" },
      { day: "Tue 10", status: "present", label: "Tue" },
      { day: "Wed 11", status: "present", label: "Wed" },
      { day: "Thu 12", status: "absent", label: "Thu" },
      { day: "Fri 13", status: "present", label: "Fri" },
      { day: "Sat 14", status: null, label: "Sat" },
      { day: "Sun 15", status: null, label: "Sun" },
    ],
    leaveRing: { taken: 1, available: 14, pending: 0 },
    attendanceOverview: [
      { name: "Present", value: 4, pct: "80%", color: "#10b981" },
      { name: "Absent", value: 1, pct: "20%", color: "#ef4444" },
      { name: "Half Day", value: 0, pct: "0%", color: "#f59e0b" },
      { name: "Leave", value: 0, pct: "0%", color: "#3b82f6" },
    ],
  },
  "This Month": {
    attendanceStrip: [
      { day: "W1 Avg", status: "present", label: "W1" },
      { day: "W2 Avg", status: "present", label: "W2" },
      { day: "W3 Avg", status: "absent", label: "W3" },
      { day: "W4 Avg", status: "present", label: "W4" },
      { day: "W5 Avg", status: null, label: "W5" },
    ],
    leaveRing: { taken: 3, available: 12, pending: 1 },
    attendanceOverview: [
      { name: "Present", value: 18, pct: "82%", color: "#10b981" },
      { name: "Absent", value: 2, pct: "9%", color: "#ef4444" },
      { name: "Half Day", value: 1, pct: "5%", color: "#f59e0b" },
      { name: "Leave", value: 1, pct: "4%", color: "#3b82f6" },
    ],
  },
  "This Year": {
    attendanceStrip: [
      { day: "Jan-Mar", status: "present", label: "Q1" },
      { day: "Apr-Jun", status: "present", label: "Q2" },
      { day: "Jul-Sep", status: null, label: "Q3" },
      { day: "Oct-Dec", status: null, label: "Q4" },
    ],
    leaveRing: { taken: 12, available: 14, pending: 2 },
    attendanceOverview: [
      { name: "Present", value: 142, pct: "88%", color: "#10b981" },
      { name: "Absent", value: 10, pct: "6%", color: "#ef4444" },
      { name: "Half Day", value: 5, pct: "3%", color: "#f59e0b" },
      { name: "Leave", value: 4, pct: "3%", color: "#3b82f6" },
    ],
  },
};

const MGR_LEAVE_BY_TIMEFRAME = {
  "This Week": { pending: 2, approved: 3, rejected: 1, cancelled: 0 },
  "This Month": { pending: 12, approved: 8, rejected: 2, cancelled: 0 },
  "This Year": { pending: 45, approved: 92, rejected: 14, cancelled: 5 },
};

const MY_TASKS = [
  { id: 1, title: "Update Project Documentation", status: "In Progress" },
  { id: 2, title: "Fix Login API Bug", status: "To Do" },
  { id: 3, title: "Review PR #245", status: "Done" },
  { id: 4, title: "Prepare Sprint Demo", status: "To Do" },
  { id: 5, title: "Client Feedback Summary", status: "To Do" },
];

const PRODUCTIVITY_DATA = [
  { day: "Mon", value: 75 },
  { day: "Tue", value: 82 },
  { day: "Wed", value: 92 },
  { day: "Thu", value: 78 },
  { day: "Fri", value: 85 },
  { day: "Sat", value: 60 },
  { day: "Sun", value: 55 },
];

const UPCOMING_EVENTS_DATA = [
  {
    id: 1,
    title: "Team Standup",
    date: "Jun 16, 10:00 AM",
    category: "meeting",
  },
  {
    id: 2,
    title: "Sprint Planning",
    date: "Jun 17, 11:00 AM",
    category: "meeting",
  },
  { id: 3, title: "Client Demo", date: "Jun 18, 03:30 PM", category: "social" },
  { id: 4, title: "Townhall", date: "Jun 19, 04:00 PM", category: "training" },
];

const MANAGER_TREND = [
  { date: "Mon 9", rate: 97 },
  { date: "Tue 10", rate: 95 },
  { date: "Wed 11", rate: 92 },
  { date: "Thu 12", rate: 96 },
  { date: "Fri 13", rate: 97 },
  { date: "Sat 14", rate: 93 },
  { date: "Sun 15", rate: 97 },
];

const DEPT_ATT = [
  { dept: "Engineering", rate: 96 },
  { dept: "Legal", rate: 94 },
  { dept: "Product", rate: 92 },
  { dept: "Marketing", rate: 90 },
  { dept: "Finance", rate: 89 },
];

/* ── RECHARTS THEMED TOOLTIP ── */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string | number;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-(--border) bg-(--bg-card) p-3 shadow-lg backdrop-blur-md z-50">
        <p className="text-xs font-semibold text-(--text-primary) mb-1.5">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((item: any, index: number) => (
            <div
              key={index}
              className="flex items-center gap-4 justify-between text-xs"
            >
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color || item.payload.fill }}
                />
                <span className="text-(--text-secondary)">
                  {item.name || item.dataKey}
                </span>
              </div>
              <span className="font-bold text-(--text-primary)">
                {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

/* ── FUNCTIONAL DROPDOWN TIMEFRAME SELECTOR ── */
function FunctionalTimeframeSelector({
  options = ["This Week", "This Month", "This Year"],
  value,
  onChange,
}: {
  options?: string[];
  value: string;
  onChange: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative z-20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-(--border) rounded-lg bg-white dark:bg-gray-800 text-(--text-secondary) hover:text-(--text-primary) transition-colors"
      >
        {value} <Filter size={10} className="opacity-60" />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-(--bg-card) border border-(--border) rounded-lg shadow-lg py-1 min-w-27.5 z-30">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${value === opt ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 font-medium" : "text-(--text-secondary) hover:bg-(--bg-card2)"}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── IN-LINE ADVANCED FILTER PANEL DROPDOWN ── */
function AdvancedFilterDropdown({
  isOpen,
  onClose,
  filters,
  onApply,
  onReset,
  departments,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: any;
  onApply: (nextFilters: any) => void;
  onReset: () => void;
  departments: string[];
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters, isOpen]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        onClose();
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  if (!isOpen) return null;

  const mappedDepts = [
    { label: "All Departments", value: "All" },
    ...departments.map((d) => ({ label: d, value: d })),
  ];
  const mappedLocations = [
    { label: "All Locations", value: "All" },
    { label: "Remote HQ", value: "Remote" },
    { label: "On-Site Office", value: "Office" },
  ];
  const mappedAttendance = [
    { label: "All Statuses", value: "All" },
    { label: "Present Only", value: "Present" },
    { label: "Absent Tracked", value: "Absent" },
  ];
  const mappedTasks = [
    { label: "All Statuses", value: "All" },
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Done" },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 p-5 bg-(--bg-card) border border-(--border) rounded-2xl shadow-xl z-50 w-75 space-y-4 animate-in fade-in zoom-in-95 duration-100 text-left"
    >
      <div className="flex items-center justify-between pb-2 border-b border-(--border)">
        <span className="text-xs font-bold text-(--text-primary)">
          Advanced Dashboard Filters
        </span>
        <button
          onClick={onReset}
          className="text-[11px] text-blue-500 font-semibold hover:underline"
        >
          Reset
        </button>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Department
          </label>
          <Dropdown
            options={mappedDepts}
            value={localFilters.department}
            onChange={(val) =>
              setLocalFilters({ ...localFilters, department: val })
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Work Location
          </label>
          <Dropdown
            options={mappedLocations}
            value={localFilters.location}
            onChange={(val) =>
              setLocalFilters({ ...localFilters, location: val })
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Attendance Status
          </label>
          <Dropdown
            options={mappedAttendance}
            value={localFilters.attendanceStatus}
            onChange={(val) =>
              setLocalFilters({ ...localFilters, attendanceStatus: val })
            }
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            Task Tracking Status
          </label>
          <Dropdown
            options={mappedTasks}
            value={localFilters.taskStatus}
            onChange={(val) =>
              setLocalFilters({ ...localFilters, taskStatus: val })
            }
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={onClose}
          className="flex-1 py-1.5 border border-(--border) text-(--text-secondary) rounded-xl text-xs font-medium hover:bg-(--bg-card2) transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => onApply(localFilters)}
          className="flex-1 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

/* ── INTERACTIVE WORKSPACE CALENDAR POPUP ── */
function InteractiveCalendarModal({
  isOpen,
  onClose,
  onSelectDate,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (dStr: string) => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      )
        onClose();
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  const daysGrid = useMemo(() => {
    const firstDay = new Date(2026, 5, 1).getDay();
    const firstDow = firstDay === 0 ? 6 : firstDay - 1;
    const cells: (number | null)[] = Array(firstDow).fill(null);
    for (let i = 1; i <= 30; i++) cells.push(i);
    while (cells.length < 35) cells.push(null);
    return cells;
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      className="absolute top-full mt-2 right-0 bg-(--bg-card) border border-(--border) rounded-2xl shadow-xl p-4 min-w-70 z-50 animate-in fade-in duration-100 text-left"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold text-(--text-primary) px-1">
          <ChevronLeft size={14} className="opacity-50 cursor-pointer" />
          <span>June 2026</span>
          <ChevronRight size={14} className="opacity-50 cursor-pointer" />
        </div>
        <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
        <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-semibold">
          {daysGrid.map((day, idx) => {
            if (!day)
              return (
                <span
                  key={idx}
                  className="text-gray-200 dark:text-gray-800 text-[11px] py-1"
                ></span>
              );
            const isTarget = day === 15;
            return (
              <button
                key={idx}
                onClick={() => {
                  onSelectDate(`Jun ${day}, 2026`);
                  onClose();
                }}
                className={`py-1 rounded-full w-7 h-7 flex items-center justify-center mx-auto transition-colors ${isTarget ? "bg-blue-600 text-white shadow-sm font-black" : "text-(--text-primary) hover:bg-(--bg-card2)"}`}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div className="border-t border-(--border) pt-2 text-center">
          <button
            onClick={() => {
              onSelectDate("Jun 15, 2026");
              onClose();
            }}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            Today
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── SUCCESS CHECK IN DIALOG ── */
function CheckInSuccessModal({
  isOpen,
  onClose,
  timeString,
  onViewAttendance,
}: {
  isOpen: boolean;
  onClose: () => void;
  timeString: string;
  onViewAttendance: () => void;
}) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#111827] border border-(--border) w-full max-w-90 rounded-2xl p-6 relative shadow-2xl text-center space-y-5 animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
        >
          <X size={16} />
        </button>
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mx-auto border border-emerald-100">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
            ✓
          </div>
        </div>
        <div>
          <h3 className="text-base font-black text-gray-900 dark:text-white tracking-tight">
            Checked In Successfully!
          </h3>
          <p className="text-xs text-(--text-muted) mt-1">
            You have been checked in at <br />
            <span className="font-bold text-(--text-primary)">
              {timeString}, Mon, Jun 15, 2026
            </span>
          </p>
        </div>
        <div className="bg-gray-50/60 dark:bg-gray-800/40 border border-(--border) rounded-xl p-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Today's Total Work Hours
          </p>
          <p className="text-xl font-black text-gray-900 dark:text-white font-mono mt-0.5">
            00h 00m
          </p>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">
            Work in progress
          </p>
        </div>
        <button
          onClick={() => {
            onViewAttendance();
            onClose();
          }}
          className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
        >
          View Attendance
        </button>
      </div>
    </div>
  );
}

/* ── SVG DONUT CHART ── */
function DonutChart({
  data,
}: {
  data: { name: string; value: number; pct: string; color: string }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let offset = 0;
  const r = 54;
  const cx = 64;
  const cy = 64;
  const circum = 2 * Math.PI * r;
  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      {data.map((d, i) => {
        const pct = total > 0 ? d.value / total : 0;
        const dash = pct * circum;
        const gap = circum - dash;
        const rotate = offset * 360 - 90;
        offset += pct;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={d.color}
            strokeWidth="16"
            strokeDasharray={`${dash} ${gap}`}
            transform={`rotate(${rotate} ${cx} ${cy})`}
            strokeLinecap={dash > 0 ? "round" : "butt"}
          />
        );
      })}
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        fill="currentColor"
        fontSize="20"
        fontWeight="700"
        className="text-(--text-primary)"
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fill="#94a3b8"
        fontSize="10"
        fontWeight="500"
      >
        Total Days
      </text>
    </svg>
  );
}

/* ── MINI SPARKLINE GRAPH ── */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const w = 120;
  const h = 32;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className="overflow-visible"
    >
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════
   EMPLOYEE DASHBOARD VIEW
══════════════════════════════════════════════ */
function EmployeeDashboard() {
  const { user } = useAuth();
  const { requests } = useLeave();
  const navigate = useNavigate();
  const notices = getNotices();

  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkTime, setCheckTime] = useState("09:02 AM");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [globalDate, setGlobalDate] = useState("Jun 15, 2026");
  const [showCalendar, setShowCalendar] = useState(false);

  const [attendanceScope, setAttendanceScope] = useState("This Week");
  const [leaveScope, setLeaveScope] = useState("This Year");
  const [overviewScope, setAttendanceOverviewScope] = useState("This Month");

  const myLeaves = requests.filter((r) => r.employeeId === user?.id);
  const pendingLeave = myLeaves.filter((r) => r.status === "pending").length;

  const currentAttendanceData = useMemo(() => {
    return (
      EMP_DATA_BY_TIMEFRAME[
        attendanceScope as keyof typeof EMP_DATA_BY_TIMEFRAME
      ]?.attendanceStrip || []
    );
  }, [attendanceScope]);

  const currentLeaveRing = useMemo(() => {
    return (
      EMP_DATA_BY_TIMEFRAME[leaveScope as keyof typeof EMP_DATA_BY_TIMEFRAME]
        ?.leaveRing || { taken: 12, available: 14, pending: 2 }
    );
  }, [leaveScope]);

  const currentOverviewDistribution = useMemo(() => {
    return (
      EMP_DATA_BY_TIMEFRAME[overviewScope as keyof typeof EMP_DATA_BY_TIMEFRAME]
        ?.attendanceOverview || []
    );
  }, [overviewScope]);

  const handleActionCheckToggle = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
    } else {
      const now = new Date();
      setCheckTime(
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      );
      setIsCheckedIn(true);
      setShowSuccessModal(true);
    }
  };

  const taskBadge = (status: string) => {
    if (status === "In Progress")
      return "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60";
    if (status === "Done")
      return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60";
    return "bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200/60";
  };

  return (
    <div className="space-y-6">
      <CheckInSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        timeString={checkTime}
        onViewAttendance={() => navigate("/attendance")}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--text-primary) tracking-tight">
            Welcome back, {user?.firstName || "James"}!
          </h1>
          <p className="text-xs text-(--text-muted) mt-0.5">
            Here's your personal workspace overview.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap relative">
          <button
            onClick={handleActionCheckToggle}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${isCheckedIn ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100" : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"}`}
          >
            <CheckCircle2 size={14} /> {isCheckedIn ? "Check Out" : "Check In"}
          </button>
          <button
            onClick={() => navigate("/leave")}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
          >
            <CalendarIcon size={14} /> Request Leave
          </button>

          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-gray-800 border border-(--border) text-(--text-primary) hover:bg-(--bg-card2) transition-colors"
            >
              <CalendarIcon size={14} className="text-gray-400" />
              <span>{globalDate}</span>
            </button>
            <InteractiveCalendarModal
              isOpen={showCalendar}
              onClose={() => setShowCalendar(false)}
              onSelectDate={setGlobalDate}
            />
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          {
            label: "Today's Status",
            value: isCheckedIn ? "Checked In" : "Checked Out",
            sub: isCheckedIn ? checkTime : "--:--",
            icon: (
              <CheckCircle2
                size={20}
                className={isCheckedIn ? "text-emerald-500" : "text-gray-400"}
              />
            ),
          },
          {
            label: "Weekly Attendance",
            value: "98%",
            sub: "Excellent",
            icon: <BarChart2 size={20} className="text-blue-500" />,
            spark: (
              <div className="pt-2">
                <Sparkline data={[70, 85, 98, 60, 98]} color="#10b981" />
              </div>
            ),
          },
          {
            label: "Leave Balance",
            value: "14",
            sub: "Days available",
            icon: <CalendarIcon size={20} className="text-amber-500" />,
          },
          {
            label: "Tasks Assigned",
            value: "6",
            sub: "2 pending",
            icon: <CheckSquare size={20} className="text-purple-500" />,
          },
          {
            label: "Upcoming Event",
            value: "Team Standup",
            sub: "Tomorrow, 10:00 AM",
            icon: <CalendarCheck size={20} className="text-indigo-500" />,
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-4 flex flex-col justify-between min-h-27.5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-wider mb-1">
                  {s.label}
                </p>
                <p
                  className={`text-base font-bold text-(--text-primary) ${i === 0 && isCheckedIn ? "text-emerald-600 dark:text-emerald-400" : ""}`}
                >
                  {s.value}
                </p>
              </div>
              <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-xl shrink-0">
                {s.icon}
              </div>
            </div>
            {s.spark ? (
              s.spark
            ) : (
              <p className="text-[11px] text-(--text-muted) mt-1">{s.sub}</p>
            )}
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              My Attendance
            </h3>
            <FunctionalTimeframeSelector
              value={attendanceScope}
              onChange={setAttendanceScope}
            />
          </div>
          <div className="flex gap-2 justify-between">
            {currentAttendanceData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className="text-[11px] text-(--text-muted) font-medium">
                  {d.label}
                </span>
                {d.status === "present" ? (
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 flex items-center justify-center">
                    <CheckCircle2 size={15} className="text-emerald-500" />
                  </div>
                ) : d.status === "absent" ? (
                  <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200/60 flex items-center justify-center">
                    <span className="text-red-500 text-xs font-bold">✕</span>
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl border border-dashed border-(--border) bg-gray-50/50 dark:bg-transparent flex items-center justify-center">
                    <span className="text-(--text-muted) text-xs">--</span>
                  </div>
                )}
                <span className="text-[9px] font-semibold tracking-wide text-(--text-muted) uppercase">
                  {d.status || "--"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              My Leave Overview
            </h3>
            <FunctionalTimeframeSelector
              value={leaveScope}
              onChange={setLeaveScope}
              options={["This Week", "This Month", "This Year"]}
            />
          </div>
          <div className="flex items-center justify-around h-24">
            {[
              {
                icon: <Clock size={16} className="text-blue-500" />,
                value: currentLeaveRing.taken,
                label: "Taken",
                bg: "bg-blue-50 dark:bg-blue-950/40",
              },
              {
                icon: <UserCheck size={16} className="text-emerald-500" />,
                value: currentLeaveRing.available,
                label: "Available",
                bg: "bg-emerald-50 dark:bg-emerald-950/40",
              },
              {
                icon: <AlertCircle size={16} className="text-amber-500" />,
                value: currentLeaveRing.pending || pendingLeave,
                label: "Pending",
                bg: "bg-amber-50 dark:bg-amber-950/40",
              },
            ].map((it, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-xl ${it.bg} flex items-center justify-center mb-2 shadow-sm`}
                >
                  {it.icon}
                </div>
                <span className="text-base font-bold text-(--text-primary)">
                  {it.value}
                </span>
                <span className="text-[10px] font-medium text-(--text-muted)">
                  {it.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              My Tasks
            </h3>
            <button
              onClick={() => navigate("/tasks")}
              className="text-xs text-blue-500 font-semibold hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-2 max-h-30 overflow-y-auto pr-1">
            {MY_TASKS.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between gap-3 p-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Circle
                    size={10}
                    className={
                      t.status === "Done"
                        ? "text-emerald-500 fill-emerald-500"
                        : "text-blue-500"
                    }
                  />
                  <span className="text-xs text-(--text-primary) font-medium truncate">
                    {t.title}
                  </span>
                </div>
                <span
                  className={`shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-lg ${taskBadge(t.status)}`}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              Attendance Overview
            </h3>
            <FunctionalTimeframeSelector
              value={overviewScope}
              onChange={setAttendanceOverviewScope}
            />
          </div>
          <div className="flex items-center justify-between gap-2 h-36">
            <DonutChart data={currentOverviewDistribution} />
            <div className="space-y-1.5 flex-1 pl-4">
              {currentOverviewDistribution.map((d) => (
                <div
                  key={d.name}
                  className="flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="text-(--text-secondary) font-medium">
                      {d.name}
                    </span>
                  </div>
                  <span className="font-bold text-(--text-primary)">
                    {d.value} ({d.pct})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              Productivity Trend
            </h3>
            <FunctionalTimeframeSelector
              value="This Week"
              onChange={() => {}}
            />
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <AreaChart
              data={PRODUCTIVITY_DATA}
              margin={{ top: 10, right: 5, bottom: 0, left: -25 }}
            >
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                strokeOpacity={0.06}
              />
              <XAxis
                dataKey="day"
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
              <Tooltip
                content={<CustomTooltip />}
                contentStyle={{ background: "transparent", border: "none" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                name="Productivity"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#prodGrad)"
                dot={{ r: 3, fill: "#3b82f6" }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              Notice Board
            </h3>
            <button
              onClick={() => navigate("/notice-board")}
              className="text-xs text-blue-500 font-semibold hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {notices.slice(0, 3).map((n) => (
              <div key={n.id} className="flex gap-3 items-start p-1 rounded-xl">
                <div className="p-2 rounded-xl shrink-0 bg-blue-50 dark:bg-blue-950/30 text-blue-600">
                  <FileText size={14} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-(--text-primary) leading-snug truncate">
                    {n.title}
                  </p>
                  <p className="text-[10px] text-(--text-muted) mt-0.5">
                    {n.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Events */}
      <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
            Upcoming Events
          </h3>
          <button
            onClick={() => navigate("/event")}
            className="text-xs text-blue-500 font-semibold hover:underline flex items-center gap-1"
          >
            View all events →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {UPCOMING_EVENTS_DATA.map((ev) => {
            const meta =
              categoryMeta[ev.category as keyof typeof categoryMeta] ||
              categoryMeta.meeting;
            return (
              <div
                key={ev.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-(--bg-card2) border border-(--border)"
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${meta.card} ${meta.textCls}`}
                >
                  {meta.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-(--text-primary) truncate">
                    {ev.title}
                  </p>
                  <p className="text-[10px] text-(--text-muted) mt-0.5">
                    {ev.date}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MANAGER DASHBOARD VIEW
══════════════════════════════════════════════ */
function ManagerDashboard() {
  const { employees } = useEmployees();
  const { requests, approveLeave, rejectLeave } = useLeave();
  const navigate = useNavigate();
  const notices = getNotices();

  const [managerLeaveScope, setManagerLeaveScope] = useState("This Month");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [globalDate, setGlobalDate] = useState("Jun 15, 2026");
  const [showCalendar, setShowCalendar] = useState(false);

  const [activeFilters, setActiveFilters] = useState({
    department: "All",
    location: "All",
    attendanceStatus: "All",
    taskStatus: "All",
  });

  const uniqueDepartments = useMemo(() => {
    const sets = new Set<string>();
    employees.forEach((e) => {
      if (e.company?.department) sets.add(e.company.department);
    });
    return Array.from(sets);
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    return employees.filter((e) => {
      if (
        activeFilters.department !== "All" &&
        e.company?.department !== activeFilters.department
      )
        return false;
      return true;
    });
  }, [employees, activeFilters]);

  const computedWorkforceInsights = useMemo(() => {
    const headcount = filteredEmployees.length || 1;
    const baseProd = 72;
    const prodVariance = activeFilters.department !== "All" ? 3.4 : 0;
    const baseOvertime = headcount * 1.28;
    const dynamicAttrition =
      activeFilters.department === "Engineering" ? "4.2" : "8.5";

    return [
      {
        label: "Productivity Score",
        value: String(Math.round(baseProd + prodVariance)),
        unit: "/100",
        delta: "+4.2% from last month",
        color: "#3b82f6",
        sparkData: [
          65,
          70,
          68,
          72,
          74,
          70,
          Math.round(baseProd + prodVariance),
        ],
      },
      {
        label: "Overtime Hours",
        value: String(Math.round(baseOvertime)),
        unit: " hrs",
        delta: "+8.1% from last month",
        color: "#10b981",
        sparkData: [110, 115, 120, 118, 125, 122, Math.round(baseOvertime)],
      },
      {
        label: "Attrition Rate",
        value: dynamicAttrition,
        unit: "%",
        delta: "-1.3% from last month",
        color: "#f59e0b",
        sparkData: [10, 9.5, 9, 9.2, 8.8, 8.7, parseFloat(dynamicAttrition)],
      },
      {
        label: "New Hires",
        value: String(Math.max(1, Math.round(headcount / 20))),
        unit: "",
        delta: "+2 from last month",
        color: "#8b5cf6",
        sparkData: [2, 3, 2, 4, 3, 4, Math.max(1, Math.round(headcount / 20))],
      },
      {
        label: "Training Hours",
        value: String(headcount * 0.64),
        unit: " hrs",
        delta: "+12% from last month",
        color: "#ef4444",
        sparkData: [50, 52, 55, 58, 60, 62, Math.round(headcount * 0.64)],
      },
    ];
  }, [filteredEmployees, activeFilters]);

  const [quickActions, setQuickActions] = useState([
    {
      label: "Add Employee",
      icon: <UserPlus size={15} />,
      action: () => navigate("/employees"),
      cls: "text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-100",
    },
    {
      label: "Create Notice",
      icon: <FileText size={15} />,
      action: () => navigate("/notice-board"),
      cls: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100",
    },
    {
      label: "Generate Report",
      icon: <BarChart2 size={15} />,
      action: () => navigate("/reports"),
      cls: "text-purple-600 bg-purple-50 dark:bg-purple-950/20 border-purple-100",
    },
    {
      label: "View Attendance",
      icon: <Eye size={15} />,
      action: () => navigate("/attendance"),
      cls: "text-amber-600 bg-amber-50 dark:bg-amber-950/20 border-amber-100",
    },
  ]);
  const [showActionCreator, setShowActionCreator] = useState(false);
  const [newActionTitle, setNewActionTitle] = useState("");
  const [newActionPath, setNewActionPath] = useState("/dashboard");

  const deptStats = useMemo(() => {
    const map: Record<string, number> = {};
    filteredEmployees.forEach((e) => {
      const d = e.company?.department ?? "Unknown";
      map[d] = (map[d] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([dept, count]) => ({ dept, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredEmployees]);

  const pendingLeaves = requests.filter((r) => r.status === "pending");
  const pendingCount = pendingLeaves.length;

  const leaveMetrics = useMemo(() => {
    return (
      MGR_LEAVE_BY_TIMEFRAME[
        managerLeaveScope as keyof typeof MGR_LEAVE_BY_TIMEFRAME
      ] || { pending: 12, approved: 8, rejected: 2, cancelled: 0 }
    );
  }, [managerLeaveScope]);

  const handleCreateCustomAction = () => {
    if (!newActionTitle.trim()) return;
    setQuickActions([
      ...quickActions,
      {
        label: newActionTitle,
        icon: <Sparkles size={15} />,
        action: () => navigate(newActionPath),
        cls: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 border-indigo-100",
      },
    ]);
    setNewActionTitle("");
    setShowActionCreator(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--text-primary) tracking-tight">
            Manager Dashboard
          </h1>
          <p className="text-sm text-(--text-muted) mt-0.5">
            Real-time overview of your team and operations.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap relative">
          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-gray-800 border border-(--border) text-(--text-primary) hover:bg-(--bg-card2) transition-colors"
            >
              <CalendarIcon size={14} className="text-gray-400" />
              <span>{globalDate}</span>
            </button>
            <InteractiveCalendarModal
              isOpen={showCalendar}
              onClose={() => setShowCalendar(false)}
              onSelectDate={setGlobalDate}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl bg-white dark:bg-gray-800 text-xs font-semibold shadow-sm transition-colors border-(--border) text-(--text-primary) hover:bg-(--bg-card2)`}
            >
              <Filter size={13} />
              <span>Filters</span>
            </button>

            <AdvancedFilterDropdown
              isOpen={showAdvancedFilters}
              onClose={() => setShowAdvancedFilters(false)}
              filters={activeFilters}
              onApply={(next) => {
                setActiveFilters(next);
                setShowAdvancedFilters(false);
              }}
              onReset={() => {
                setActiveFilters({
                  department: "All",
                  location: "All",
                  attendanceStatus: "All",
                  taskStatus: "All",
                });
                setShowAdvancedFilters(false);
              }}
              departments={uniqueDepartments}
            />
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Headcount",
            value: filteredEmployees.length,
            sub: `+4 from last month`,
            icon: <Users size={20} className="text-blue-500" />,
          },
          {
            label: "Action Items",
            value: pendingCount || 7,
            sub: `${Math.min(3, pendingCount)} overdue`,
            icon: <AlertCircle size={20} className="text-amber-500" />,
            valueCls: "text-amber-500",
          },
          {
            label: "Attendance Rate",
            value: "96%",
            sub: "+2.4% from last week",
            icon: <CalendarCheck size={20} className="text-emerald-500" />,
            valueCls: "text-emerald-600 dark:text-emerald-400",
          },
          {
            label: "Active Divisions",
            value: deptStats.length || 12,
            sub: "+1 new this month",
            icon: <Building2 size={20} className="text-purple-500" />,
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5 flex items-start justify-between min-h-27.5"
          >
            <div>
              <p className="text-[10px] font-bold text-(--text-primary) uppercase tracking-wider mb-1">
                {s.label}
              </p>
              <p
                className={`text-2xl font-bold ${s.valueCls || "text-(--text-primary)"}`}
              >
                {s.value}
              </p>
              <p className="text-xs text-(--text-muted) mt-2 font-medium">
                {s.sub}
              </p>
            </div>
            <div className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-xl shrink-0">
              {s.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
                Attendance Trend
              </h3>
              <p className="text-[11px] text-(--text-muted) mt-0.5">
                Daily operational attendance curves
              </p>
            </div>
            <FunctionalTimeframeSelector
              value="This Week"
              onChange={() => {}}
            />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={MANAGER_TREND}
              margin={{ top: 10, right: 5, bottom: 0, left: -25 }}
            >
              <defs>
                <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                strokeOpacity={0.06}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[80, 100]}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                contentStyle={{ background: "transparent", border: "none" }}
              />
              <Area
                type="monotone"
                dataKey="rate"
                name="Attendance"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#attGrad)"
                dot={{ r: 3, fill: "#3b82f6" }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-4 bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
                Department Overview
              </h3>
              <p className="text-[11px] text-(--text-muted) mt-0.5">
                Average division distribution metrics
              </p>
            </div>
            <button
              onClick={() => navigate("/employees")}
              className="text-xs text-blue-500 font-semibold hover:underline"
            >
              View all
            </button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={DEPT_ATT}
              margin={{ top: 10, right: 0, bottom: 0, left: -25 }}
            >
              <XAxis
                dataKey="dept"
                tick={{ fontSize: 9, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[80, 100]}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                contentStyle={{ background: "transparent", border: "none" }}
              />
              <Bar
                dataKey="rate"
                name="Attendance"
                radius={[6, 6, 0, 0]}
                maxBarSize={28}
              >
                {DEPT_ATT.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-3 bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              Upcoming Events
            </h3>
            <button
              onClick={() => navigate("/event")}
              className="text-xs text-blue-500 font-semibold hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-3.5">
            {UPCOMING_EVENTS_DATA.map((ev, i) => {
              const meta =
                categoryMeta[ev.category as keyof typeof categoryMeta] ||
                categoryMeta.meeting;
              return (
                <div key={i} className="flex items-center gap-3 p-0.5">
                  <div
                    className={`w-8 h-8 rounded-lg ${meta.card} ${meta.textCls} flex items-center justify-center shrink-0`}
                  >
                    {meta.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-(--text-primary) truncate">
                      {ev.title}
                    </p>
                    <p className="text-[10px] text-(--text-muted) mt-0.5">
                      {ev.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              Leave Overview
            </h3>
            <FunctionalTimeframeSelector
              value={managerLeaveScope}
              onChange={setManagerLeaveScope}
              options={["This Week", "This Month", "This Year"]}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: "Pending",
                value: leaveMetrics.pending,
                icon: <Clock size={16} className="text-amber-500" />,
                bg: "bg-amber-50 dark:bg-amber-950/20",
              },
              {
                label: "Approved",
                value: leaveMetrics.approved,
                icon: <CheckCircle2 size={16} className="text-emerald-500" />,
                bg: "bg-emerald-50 dark:bg-emerald-950/20",
              },
              {
                label: "Rejected",
                value: leaveMetrics.rejected,
                icon: <AlertCircle size={16} className="text-red-500" />,
                bg: "bg-red-50 dark:bg-red-950/20",
              },
              {
                label: "Cancelled",
                value: leaveMetrics.cancelled,
                icon: <CheckSquare size={16} className="text-gray-400" />,
                bg: "bg-gray-50 dark:bg-gray-800/20",
              },
            ].map((it, i) => (
              <div
                key={i}
                className={`${it.bg} rounded-xl p-3 flex flex-col gap-1.5`}
              >
                {it.icon}
                <span className="text-lg font-bold text-(--text-primary)">
                  {it.value}
                </span>
                <span className="text-[10px] text-(--text-muted) font-semibold">
                  {it.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              Pending Requests
            </h3>
            <button
              onClick={() => navigate("/leave")}
              className="text-xs text-blue-500 font-semibold hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-3 max-h-42.5 overflow-y-auto">
            {pendingLeaves.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-(--text-muted) text-xs">
                <CheckCircle2 size={24} className="text-emerald-500 mb-2" />
                <p className="font-medium">All caught up!</p>
              </div>
            ) : (
              <AnimatePresence>
                {pendingLeaves.slice(0, 3).map((r) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-between p-2 rounded-xl bg-gray-50/50 dark:bg-gray-800/40 border border-(--border)"
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="text-xs font-bold text-(--text-primary) truncate">
                        {r.name || "Employee ID: " + r.employeeId}
                      </p>
                      <p className="text-[10px] text-(--text-muted) truncate">
                        {r.reason || "Annual Vacation Slot"}
                      </p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button
                        onClick={() => approveLeave(r.id)}
                        className="px-2 py-1 text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-lg font-bold hover:bg-emerald-100 transition-colors"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => rejectLeave(r.id)}
                        className="px-2 py-1 text-[10px] bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-lg font-bold hover:bg-red-100 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
              Notice Board
            </h3>
            <button
              onClick={() => navigate("/notice-board")}
              className="text-xs text-blue-500 font-semibold hover:underline"
            >
              View all
            </button>
          </div>
          <div className="space-y-3.5">
            {notices.slice(0, 3).map((n) => (
              <div key={n.id} className="flex gap-2.5 items-start">
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.priority === "high" ? "bg-red-500" : n.priority === "medium" ? "bg-amber-500" : "bg-emerald-500"}`}
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-(--text-primary) leading-snug truncate">
                    {n.title}
                  </p>
                  <p className="text-[10px] text-(--text-muted) mt-0.5">
                    {n.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5 flex flex-col justify-between min-h-55">
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
                Quick Actions
              </h3>
              <button
                onClick={() => setShowActionCreator(!showActionCreator)}
                className="text-[11px] text-blue-500 font-bold flex items-center gap-0.5 border border-blue-200 dark:border-blue-900/60 px-2 py-0.5 rounded-lg bg-blue-50/40 dark:bg-transparent"
              >
                <Plus size={10} /> Add Action
              </button>
            </div>

            {showActionCreator && (
              <div className="mb-3 p-2 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl space-y-2 bg-gray-50/50 dark:bg-transparent">
                <input
                  type="text"
                  placeholder="Action Label..."
                  value={newActionTitle}
                  onChange={(e) => setNewActionTitle(e.target.value)}
                  className="w-full text-xs bg-white dark:bg-gray-800 border border-(--border) rounded-lg px-2 py-1 focus:outline-none text-(--text-primary)"
                />
                <input
                  type="text"
                  placeholder="Route (e.g. /payroll)..."
                  value={newActionPath}
                  onChange={(e) => setNewActionPath(e.target.value)}
                  className="w-full text-xs bg-white dark:bg-gray-800 border border-(--border) rounded-lg px-2 py-1 focus:outline-none text-(--text-primary)"
                />
                <button
                  onClick={handleCreateCustomAction}
                  className="w-full text-[10px] bg-blue-600 text-white font-bold py-1 rounded-lg"
                >
                  Confirm Add
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto overflow-x-hidden pr-0.5">
              {quickActions.map((a, i) => (
                <button
                  key={i}
                  onClick={a.action}
                  className={`flex flex-col items-center justify-center gap-2 p-3 h-20 rounded-xl border text-center transition-all hover:scale-[1.02] ${a.cls}`}
                >
                  {a.icon}
                  <span className="text-[10px] font-bold leading-tight truncate w-full px-1">
                    {a.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
        <div className="mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-(--text-muted)">
            Workforce Insights
          </h3>
          <p className="text-[11px] text-(--text-muted) mt-0.5">
            Dynamic high-fidelity corporate telemetry indicators
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
          {computedWorkforceInsights.map((wi, i) => (
            <div key={i} className="space-y-1.5 p-1 rounded-xl">
              <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-wide">
                {wi.label}
              </p>
              <p className="text-xl font-bold text-(--text-primary) tracking-tight">
                {wi.value}
                <span className="text-xs font-medium text-(--text-muted)">
                  {wi.unit}
                </span>
              </p>
              <Sparkline data={wi.sparkData} color={wi.color} />
              <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold pt-1">
                {wi.delta}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN HUB ENTRYPOINT
══════════════════════════════════════════════ */
export default function DashboardPage() {
  const { user } = useAuth();
  const { isLoading } = useEmployees();

  if (isLoading)
    return (
      <div className="space-y-6 animate-pulse p-2">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl"
            />
          ))}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {user?.role === "manager" ? <ManagerDashboard /> : <EmployeeDashboard />}
    </motion.div>
  );
}
