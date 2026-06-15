import { useState, useMemo } from "react";
import { PageHeader } from "../components/PageHeader";
import {
  Plus,
  Clock,
  CheckCircle2,
  MoreVertical,
  Trash2,
  Circle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

// ── Shared Common System Custom Components Integrated ───────────────────────
import Button from "../components/Button";
import SearchBox from "../components/SearchBox";
import CustomSelect from "../components/CustomSelect";
import Card from "../components/Card";
import Modal from "../components/Modal";
import { DatePicker } from "../components/DatePicker";

/* ────────────────────────────────────────────────────────── */
type Lane = "todo" | "progress" | "done";
type Priority = "High" | "Medium" | "Low";

interface Task {
  id: string;
  title: string;
  lane: Lane;
  priority: Priority;
  dueDate: string; // "YYYY-MM-DD"
  progressPercent: number; // only shown when lane === "progress"
}

const INITIAL_TASKS: Task[] = [
  {
    id: "t-1",
    title: "Design homepage for new landing",
    lane: "todo",
    priority: "High",
    dueDate: "2025-06-02",
    progressPercent: 0,
  },
  {
    id: "t-2",
    title: "Create wireframes for dashboard",
    lane: "todo",
    priority: "Medium",
    dueDate: "2025-06-04",
    progressPercent: 0,
  },
  {
    id: "t-3",
    title: "Update company style guide",
    lane: "todo",
    priority: "Low",
    dueDate: "2025-06-06",
    progressPercent: 0,
  },
  {
    id: "t-4",
    title: "Prepare UI assets for mobile app",
    lane: "todo",
    priority: "Medium",
    dueDate: "2025-06-08",
    progressPercent: 0,
  },
  {
    id: "t-5",
    title: "Fix UI issues in login page",
    lane: "todo",
    priority: "Low",
    dueDate: "2025-06-09",
    progressPercent: 0,
  },
  {
    id: "t-6",
    title: "Improve responsiveness for product page",
    lane: "progress",
    priority: "High",
    dueDate: "2025-06-01",
    progressPercent: 60,
  },
  {
    id: "t-7",
    title: "Integrate API for user profile",
    lane: "progress",
    priority: "Medium",
    dueDate: "2025-06-03",
    progressPercent: 40,
  },
  {
    id: "t-8",
    title: "Redesign icons for navigation",
    lane: "progress",
    priority: "Low",
    dueDate: "2025-06-05",
    progressPercent: 70,
  },
  {
    id: "t-9",
    title: "Research on user experience trends",
    lane: "done",
    priority: "Medium",
    dueDate: "2025-05-24",
    progressPercent: 100,
  },
  {
    id: "t-10",
    title: "Design landing page hero section",
    lane: "done",
    priority: "High",
    dueDate: "2025-05-22",
    progressPercent: 100,
  },
  {
    id: "t-11",
    title: "Meeting with product team",
    lane: "done",
    priority: "Medium",
    dueDate: "2025-05-20",
    progressPercent: 100,
  },
  {
    id: "t-12",
    title: "Review design feedback",
    lane: "done",
    priority: "Low",
    dueDate: "2025-05-18",
    progressPercent: 100,
  },
];

/* ────────────────────────────────────────────────────────── */
/* Helpers */
const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const PRIORITY_STYLE: Record<Priority, string> = {
  High: "text-red-600 bg-red-50 dark:bg-red-950/30",
  Medium: "text-amber-600 bg-amber-50 dark:bg-amber-950/30",
  Low: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30",
};

const LANE_SEQUENCE: Record<Lane, Lane> = {
  todo: "progress",
  progress: "done",
  done: "todo",
};

const STATUS_SELECT_OPTIONS = [
  { value: "All Status", label: "All Statuses" },
  { value: "To Do", label: "To Do" },
  { value: "In Progress", label: "In Progress" },
  { value: "Completed", label: "Completed" },
];

const PRIORITY_SELECT_OPTIONS = [
  { value: "All Priority", label: "All Priorities" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

/* ────────────────────────────────────────────────────────── */
/* Add Task Modal */
interface AddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (t: Omit<Task, "id" | "progressPercent">) => void;
  lane?: Lane;
}

function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  lane = "todo",
}: AddModalProps) {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [dueDate, setDueDate] = useState("");
  const [toLane, setToLane] = useState<Lane>(lane);

  const reset = () => {
    setTitle("");
    setPriority("Medium");
    setDueDate("");
    setToLane(lane);
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("Task title is required.");
      return;
    }
    onSubmit({
      title: title.trim(),
      lane: toLane,
      priority,
      dueDate: dueDate || new Date().toISOString().slice(0, 10),
    });
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} className="flex-1">
            Add Task
          </Button>
        </>
      }
    >
      <div className="space-y-4 text-left">
        <div>
          <label className="block text-xs font-semibold text-(--text-secondary) mb-1.5">
            Task Title *
          </label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="What needs to be done?"
            className="w-full px-3 py-2 border border-(--border) rounded-xl text-sm bg-gray-50/50 dark:bg-gray-800 text-(--text-primary) focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-(--text-secondary) mb-1.5">
              Priority
            </label>
            <CustomSelect
              value={priority}
              onChange={(val) => setPriority(val as Priority)}
              options={[
                { value: "High", label: "High" },
                { value: "Medium", label: "Medium" },
                { value: "Low", label: "Low" },
              ]}
              className="w-full text-sm py-1.5" // Smaller dropdown
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-(--text-secondary) mb-1.5">
              Column Section
            </label>
            <CustomSelect
              value={toLane}
              onChange={(val) => setToLane(val as Lane)}
              options={[
                { value: "todo", label: "To Do" },
                { value: "progress", label: "In Progress" },
                { value: "done", label: "Completed" },
              ]}
              className="w-full text-sm py-1.5"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-(--text-secondary) mb-1.5">
            Due Date Target
          </label>
          <DatePicker
            value={dueDate}
            onChange={setDueDate}
            placeholder="Select due date"
          />
        </div>
      </div>
    </Modal>
  );
}

/* ────────────────────────────────────────────────────────── */
/* Main Page View Engine Layout */
export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [addModal, setAddModal] = useState<{ open: boolean; lane?: Lane }>({
    open: false,
  });
  const [menuId, setMenuId] = useState<string | null>(null);

  /* Pipeline Evaluation Calculation Filters */
  const filtered = useMemo(
    () =>
      tasks.filter((t) => {
        const laneMap: Record<string, Lane> = {
          "To Do": "todo",
          "In Progress": "progress",
          Completed: "done",
        };
        if (statusFilter !== "All Status" && t.lane !== laneMap[statusFilter])
          return false;
        if (priorityFilter !== "All Priority" && t.priority !== priorityFilter)
          return false;
        if (
          searchQuery &&
          !t.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
          return false;
        return true;
      }),
    [tasks, statusFilter, priorityFilter, searchQuery],
  );

  const byLane = (lane: Lane) => filtered.filter((t) => t.lane === lane);
  const counts = {
    todo: byLane("todo").length,
    progress: byLane("progress").length,
    done: byLane("done").length,
  };

  /* Kanban Functional State Alterations */
  const advanceLane = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const next = LANE_SEQUENCE[t.lane];
        return {
          ...t,
          lane: next,
          progressPercent: next === "progress" ? 20 : next === "done" ? 100 : 0,
          dueDate:
            next === "done" ? new Date().toISOString().slice(0, 10) : t.dueDate,
        };
      }),
    );
    toast.success("Task shifted across status board pipeline.");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setMenuId(null);
    toast.success("Task deleted permanently from workspace.");
  };

  const addTask = (data: Omit<Task, "id" | "progressPercent">) => {
    const newTask: Task = {
      ...data,
      id: `t-${Date.now()}`,
      progressPercent:
        data.lane === "done" ? 100 : data.lane === "progress" ? 20 : 0,
    };
    setTasks((prev) => [newTask, ...prev]);
    toast.success("Task added onto workspace track.");
  };

  /* Chart telemetry coordinate configurations mapping */
  const chartData = [
    { name: "To Do", value: counts.todo, color: "#3b82f6" },
    { name: "In Progress", value: counts.progress, color: "#f59e0b" },
    { name: "Completed", value: counts.done, color: "#10b981" },
  ];

  const upcoming = useMemo(
    () =>
      tasks
        .filter((t) => t.lane !== "done")
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 3),
    [tasks],
  );

  /* ── Task Card Component ── */
  function TaskCard({ task }: { task: Task }) {
    return (
      <div className="p-4 bg-white dark:bg-[#111827] border border-(--border) rounded-xl transition-all space-y-3 group relative text-left">
        {/* Removed hover:shadow-md and hover effects */}
        <div className="flex items-start gap-2">
          {task.lane === "done" ? (
            <CheckCircle2
              size={15}
              className="text-emerald-500 fill-emerald-500/10 shrink-0 mt-0.5"
            />
          ) : (
            <button
              onClick={() => advanceLane(task.id)}
              title="Shift status lane next"
              className={`w-4 h-4 rounded-full border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                task.lane === "progress"
                  ? "border-amber-400 hover:bg-amber-50"
                  : "border-gray-300 dark:border-gray-700 hover:border-blue-500"
              }`}
            />
          )}
          <p
            className={`text-xs font-semibold flex-1 leading-relaxed ${task.lane === "done" ? "line-through text-gray-400" : "text-(--text-primary)"}`}
          >
            {task.title}
          </p>

          <div className="relative shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuId(menuId === task.id ? null : task.id);
              }}
              className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100 dark:hover:bg-gray-800 text-(--text-muted)"
            >
              <MoreVertical size={12} />
            </button>
            {menuId === task.id && (
              <div className="absolute right-0 top-6 bg-white dark:bg-[#111827] border border-(--border) rounded-xl shadow-xl py-1 z-30 min-w-30">
                <button
                  onClick={() => advanceLane(task.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-(--text-secondary) hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors text-left"
                >
                  Advance State
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-[11px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 font-medium transition-colors text-left"
                >
                  <Trash2 size={11} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {task.lane === "progress" && (
          <div className="space-y-1">
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all"
                style={{ width: `${task.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] font-bold text-gray-400">
              <span>Progress Tracker</span>
              <span>{task.progressPercent}%</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-[10px] text-(--text-muted) font-semibold flex items-center gap-1">
            <Clock size={10} /> {task.lane === "done" ? "Done" : "Due"}:{" "}
            {fmt(task.dueDate)}
          </span>
          {task.lane !== "done" && (
            <span
              className={`px-2 py-0.5 font-bold rounded-md uppercase text-[9px] ${PRIORITY_STYLE[task.priority]}`}
            >
              {task.priority}
            </span>
          )}
        </div>
      </div>
    );
  }

  const LANE_META: Record<
    Lane,
    { label: string; badgeClass: string; bgClass: string }
  > = {
    todo: {
      label: "To Do",
      badgeClass: "bg-blue-50 text-blue-600",
      bgClass: "bg-gray-50/50 dark:bg-gray-900/10",
    },
    progress: {
      label: "In Progress",
      badgeClass: "bg-amber-50 text-amber-600",
      bgClass: "bg-amber-50/10 dark:bg-amber-950/5",
    },
    done: {
      label: "Completed",
      badgeClass: "bg-emerald-50 text-emerald-600",
      bgClass: "bg-emerald-50/10 dark:bg-emerald-950/5",
    },
  };

  function BoardColumn({ lane }: { lane: Lane }) {
    const meta = LANE_META[lane];
    const items = byLane(lane);
    return (
      <div
        className={`${meta.bgClass} border border-(--border) rounded-2xl p-4 space-y-4 flex flex-col justify-between h-full min-h-105`}
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-(--text-primary)">
              {meta.label}
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full font-mono ${meta.badgeClass}`}
            >
              {items.length}
            </span>
          </div>
          <div className="space-y-3">
            {items.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
        <button
          onClick={() => setAddModal({ open: true, lane })}
          className="w-full mt-4 flex items-center justify-center gap-1.5 py-2 text-[11px] font-bold text-blue-500 border border-dashed border-blue-200 dark:border-blue-900/40 rounded-xl hover:bg-white dark:hover:bg-transparent transition-colors"
        >
          <Plus size={12} /> Add Task
        </button>
      </div>
    );
  }

  function ListView() {
    return (
      <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-(--border) bg-gray-50/60 dark:bg-gray-800/40 text-(--text-secondary) font-bold">
              <th className="p-4 pl-6">Task Description</th>
              <th className="p-4">Status Lane</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Due Target Date</th>
              <th className="p-4 text-center">Progress Metrics</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--border) text-(--text-primary) font-medium">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-gray-400">
                  No matching tasks active inside workspace filters.
                </td>
              </tr>
            ) : (
              filtered.map((task) => (
                <tr
                  key={task.id}
                  className="hover:bg-gray-50/40 transition-colors"
                >
                  <td className="p-4 pl-6 font-semibold max-w-xs truncate">
                    <div className="flex items-center gap-2">
                      {task.lane === "done" ? (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                      ) : (
                        <Circle size={14} className="text-gray-300" />
                      )}
                      <span
                        className={
                          task.lane === "done"
                            ? "line-through text-gray-400"
                            : ""
                        }
                      >
                        {task.title}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${task.lane === "todo" ? "bg-blue-50 text-blue-600" : task.lane === "progress" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}
                    >
                      {LANE_META[task.lane].label}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 font-bold rounded-md uppercase text-[9px] ${PRIORITY_STYLE[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="p-4 text-(--text-secondary) font-mono">
                    {fmt(task.dueDate)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-16 bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-1.5 bg-emerald-500 rounded-full"
                          style={{ width: `${task.progressPercent}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-gray-400">
                        {task.progressPercent}%
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => advanceLane(task.id)}
                      >
                        Cycle
                      </Button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div
      className="space-y-6"
      onClick={() => {
        if (menuId) setMenuId(null);
      }}
    >
      <Toaster position="top-right" />

      {/* Control Filter layer Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
        <PageHeader
          title="My Tasks"
          description="View and manage your daily tasks"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "My Tasks" },
          ]}
        />

        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold self-end xl:self-auto">
          <div className="flex bg-gray-100 dark:bg-gray-800 border border-(--border) rounded-xl p-1 mr-2 shadow-sm">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 flex items-center gap-1.5 rounded-lg transition-all text-xs ${viewMode === "list" ? "bg-blue-600 text-white shadow-sm font-bold" : "text-(--text-secondary)"}`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`px-3 py-1 flex items-center gap-1.5 rounded-lg transition-all text-xs ${viewMode === "board" ? "bg-blue-600 text-white shadow-sm font-bold" : "text-(--text-secondary)"}`}
            >
              Board View
            </button>
          </div>

          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search workspace tasks..."
          />

          <CustomSelect
            value={statusFilter}
            onChange={(v) => setStatusFilter(String(v))}
            options={STATUS_SELECT_OPTIONS}
          />
          <CustomSelect
            value={priorityFilter}
            onChange={(v) => setPriorityFilter(String(v))}
            options={PRIORITY_SELECT_OPTIONS}
          />

          <Button
            icon={<Plus size={13} />}
            onClick={() => setAddModal({ open: true })}
          >
            New Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        <div className="xl:col-span-3">
          {viewMode === "board" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              <BoardColumn lane="todo" />
              <BoardColumn lane="progress" />
              <BoardColumn lane="done" />
            </div>
          ) : (
            <ListView />
          )}
        </div>

        {/* Dynamic Telemetry Panel Layout Sidebar Card */}
        <div className="space-y-4">
          <Card>
            <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-wide mb-3">
              Task Breakdown Summary
            </p>
            <div className="relative flex items-center justify-center w-full h-32 mx-auto">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={50}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-black text-(--text-primary)">
                  {filtered.length}
                </span>
                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-wider">
                  Total
                </span>
              </div>
            </div>
            <div className="mt-3 space-y-1.5 text-[11px] font-semibold text-(--text-secondary)">
              {chartData.map((d) => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: d.color }}
                    />
                    {d.name}
                  </div>
                  <span className="font-mono text-(--text-primary)">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-wide mb-3">
              Upcoming Schedules
            </p>
            <div className="space-y-2">
              {upcoming.length === 0 ? (
                <p className="text-xs text-gray-400 py-4 text-center">
                  All caught up! 🎉
                </p>
              ) : (
                upcoming.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50/50 dark:bg-gray-800 border border-(--border) text-xs font-semibold"
                  >
                    <span className="truncate max-w-32.5 text-(--text-primary)">
                      {t.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold font-mono shrink-0 ml-2 px-1.5 py-0.5 rounded ${PRIORITY_STYLE[t.priority]}`}
                    >
                      {t.priority}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      <AddTaskModal
        isOpen={addModal.open}
        lane={addModal.lane}
        onClose={() => setAddModal({ open: false })}
        onSubmit={addTask}
      />
    </div>
  );
}
