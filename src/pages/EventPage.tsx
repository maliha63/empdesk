import { useState, useMemo, useRef, useEffect } from "react";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import Modal from "../components/Modal";
import toast, { Toaster } from "react-hot-toast";
import {
  Clock,
  MapPin,
  Calendar as CalendarIcon,
  Briefcase,
  Users,
  Book,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { DatePicker } from "../components/DatePicker";
import CustomSelect from "../components/CustomSelect";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  location?: string;
  category?: "meeting" | "deadline" | "social" | "training";
}

const categoryMeta = {
  meeting: {
    icon: <Briefcase size={16} />,
    label: "Meeting",
    dot: "bg-purple-500",
    card: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800",
    iconBox:
      "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  },
  deadline: {
    icon: <Clock size={16} />,
    label: "Deadline",
    dot: "bg-red-500",
    card: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
    iconBox: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  },
  social: {
    icon: <Users size={16} />,
    label: "Social",
    dot: "bg-emerald-500",
    card: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800",
    iconBox:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
  },
  training: {
    icon: <Book size={16} />,
    label: "Training",
    dot: "bg-orange-500",
    card: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800",
    iconBox:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  },
};

const initialEvents: Event[] = [
  {
    id: 1,
    title: "Team Building Workshop",
    date: "2026-06-12",
    time: "10:00",
    description: "Interactive team bonding workshop",
    location: "Conference Room A",
    category: "meeting",
  },
  {
    id: 2,
    title: "Product Launch",
    date: "2026-06-16",
    time: "09:30",
    description: "Launch of new AI features",
    location: "Main Auditorium",
    category: "social",
  },
  {
    id: 3,
    title: "Monthly Townhall",
    date: "2026-06-19",
    time: "14:00",
    description: "Company-wide update and Q&A",
    location: "Virtual (Google Meet)",
    category: "meeting",
  },
  {
    id: 4,
    title: "Wellness Session",
    date: "2026-06-26",
    time: "11:00",
    description: "Guided meditation and wellness",
    location: "Wellness Room",
    category: "training",
  },
  {
    id: 5,
    title: "Q2 Performance Review Deadline",
    date: "2026-06-15",
    time: "23:59",
    description: "All reviews must be submitted",
    location: "Online",
    category: "deadline",
  },
];

const DAYS_HEADER = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
type ViewType = "month" | "week" | "list";

const TIME_OPTIONS = [
  { value: "09:00", label: "09:00 AM" },
  { value: "09:30", label: "09:30 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "10:30", label: "10:30 AM" },
  { value: "11:00", label: "11:00 AM" },
  { value: "11:30", label: "11:30 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "12:30", label: "12:30 PM" },
  { value: "13:00", label: "01:00 PM" },
  { value: "13:30", label: "01:30 PM" },
  { value: "14:00", label: "02:00 PM" },
  { value: "14:30", label: "02:30 PM" },
  { value: "15:00", label: "03:00 PM" },
  { value: "15:30", label: "03:30 PM" },
  { value: "16:00", label: "04:00 PM" },
  { value: "16:30", label: "04:30 PM" },
  { value: "17:00", label: "05:00 PM" },
  { value: "17:30", label: "05:30 PM" },
  { value: "18:00", label: "06:00 PM" },
  { value: "23:59", label: "11:59 PM" },
];

// Slots for week view (include an All day row plus all time values)
const TIME_SLOTS = ["All day", ...TIME_OPTIONS.map((o) => o.value)];

const CATEGORY_OPTIONS = [
  { value: "meeting", label: "Meeting" },
  { value: "deadline", label: "Deadline" },
  { value: "social", label: "Social Event" },
  { value: "training", label: "Training" },
];

/* Event Menu */
function EventMenu({
  onEdit,
  onDelete,
}: {
  event: Event;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 hover:bg-(--bg-card2) rounded-lg transition-colors"
      >
        <MoreVertical size={15} className="text-(--text-muted)" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-(--bg-card) border border-(--border) rounded-lg shadow-lg z-50 min-w-32 py-1">
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-(--text-primary) hover:bg-(--bg-card2) transition-colors"
          >
            <Edit2 size={13} /> Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors border-t border-(--border)"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function EventPage() {
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [viewMode, setViewMode] = useState<ViewType>("month");
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "09:00",
    description: "",
    location: "",
    category: "meeting" as Event["category"],
  });

  /* ── derived ── */
  const upcomingEvents = useMemo(
    () =>
      events
        .filter((e) => {
          const d = new Date(e.date + "T00:00:00");
          return d >= today;
        })
        .sort(
          (a, b) =>
            a.date.localeCompare(b.date) || a.time.localeCompare(b.time),
        ),
    [events, today],
  );

  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    events.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [events]);

  /* ── month grid ── */
  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = Array(firstDow).fill(null);
    for (let i = 1; i <= daysInMonth; i++) cells.push(new Date(year, month, i));
    return cells;
  }, [currentDate]);

  /* ── week days ── */
  const weekDays = useMemo(() => {
    const base = new Date(currentDate);
    const dow = base.getDay();
    base.setDate(base.getDate() - dow);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return d;
    });
  }, [currentDate]);

  /* ── helpers ── */
  function dateStr(d: Date) {
    return d.toISOString().split("T")[0];
  }
  function isToday(d: Date) {
    return d.toDateString() === today.toDateString();
  }
  function isSelected(d: Date) {
    return d.toDateString() === selectedDate.toDateString();
  }

  function prevPeriod() {
    if (viewMode === "month")
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
      );
    else setCurrentDate(new Date(currentDate.getTime() - 7 * 86400000));
  }
  function nextPeriod() {
    if (viewMode === "month")
      setCurrentDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
      );
    else setCurrentDate(new Date(currentDate.getTime() + 7 * 86400000));
  }

  function openAdd() {
    setEditingEvent(null);
    setForm({
      title: "",
      date: dateStr(selectedDate),
      time: "09:00",
      description: "",
      location: "",
      category: "meeting",
    });
    setShowModal(true);
  }
  function openEdit(ev: Event) {
    setEditingEvent(ev);
    setForm({
      title: ev.title,
      date: ev.date,
      time: ev.time,
      description: ev.description,
      location: ev.location || "",
      category: ev.category || "meeting",
    });
    setShowModal(true);
  }
  function handleSave() {
    if (!form.title.trim() || !form.date || !form.time) {
      toast.error("Title, date and time are required");
      return;
    }
    if (editingEvent) {
      setEvents((ev) =>
        ev.map((e) => (e.id === editingEvent.id ? { ...e, ...form } : e)),
      );
      toast.success("Event updated");
    } else {
      setEvents((ev) => [{ id: Date.now(), ...form }, ...ev]);
      toast.success("Event created");
    }
    setShowModal(false);
  }
  function handleDelete(id: number) {
    setEvents((ev) => ev.filter((e) => e.id !== id));
    toast.success("Event deleted");
  }

  const weekLabel = useMemo(() => {
    const s = weekDays[0];
    const e = weekDays[6];
    return `${s.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – ${e.toLocaleDateString("en-US", { month: "long", day: "numeric" })}`;
  }, [weekDays]);

  function getEventHour(e: Event) {
    // return the event time value (e.g., "09:00")
    return e.time;
  }

  function slotHour(slot: any) {
    // slot is either "All day" or a time value from TIME_SLOTS
    return slot === "All day" ? null : slot;
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Events"
          description="View and manage all company events"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Events" },
          ]}
          action={
            <div className="flex items-center gap-3">
              <div className="flex bg-(--bg-card2) border border-(--border) rounded-xl p-1">
                {(["month", "week", "list"] as ViewType[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => setViewMode(v)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${viewMode === v ? "bg-white dark:bg-[#1f2a3d] text-(--text-primary) shadow-sm" : "text-(--text-muted) hover:text-(--text-primary)"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <Button onClick={openAdd}>
                <Plus size={14} /> Create Event
              </Button>
            </div>
          }
        />

        {/* ── Month view ── */}
        {viewMode === "month" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevPeriod}
                    className="p-2 hover:bg-(--bg-card2) rounded-lg transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <h3 className="text-lg font-semibold text-(--text-primary)">
                    {currentDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </h3>
                  <button
                    onClick={nextPeriod}
                    className="p-2 hover:bg-(--bg-card2) rounded-lg transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_HEADER.map((d) => (
                  <div
                    key={d}
                    className="text-center text-xs font-semibold text-(--text-muted) py-2"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {monthDays.map((day, idx) => {
                  if (!day)
                    return (
                      <div
                        key={idx}
                        className="min-h-20 rounded-lg bg-gray-50 dark:bg-[#0b0f1a]"
                      />
                    );
                  const ds = dateStr(day);
                  const dayEvts = eventsByDate[ds] || [];
                  const todayDay = isToday(day);
                  const selDay = isSelected(day);
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDate(day)}
                      className={`min-h-20 p-2 rounded-lg border text-left transition-all
                        ${
                          selDay
                            ? "bg-blue-500 border-blue-500 text-white"
                            : todayDay
                              ? "bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700"
                              : "bg-white dark:bg-[#0f172a] border-(--border) hover:border-blue-300 dark:hover:border-blue-700"
                        }`}
                    >
                      <div
                        className={`text-sm font-semibold mb-1 ${selDay ? "text-white" : "text-(--text-primary)"}`}
                      >
                        {day.getDate()}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {dayEvts.slice(0, 3).map((ev) => {
                          const meta = categoryMeta[ev.category ?? "meeting"];
                          return (
                            <span
                              key={ev.id}
                              className={`w-2 h-2 rounded-full shrink-0 ${meta.dot} ${selDay ? "opacity-80" : ""}`}
                              title={ev.title}
                            />
                          );
                        })}
                        {dayEvts.length > 3 && (
                          <span className="text-[9px] text-(--text-muted)">
                            +{dayEvts.length - 3}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4 flex-wrap mt-4 text-xs">
                {Object.entries(categoryMeta).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1.5">
                    <div className={`w-2.5 h-2.5 rounded-full ${v.dot}`} />
                    <span className="text-(--text-muted)">{v.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {upcomingEvents.length > 0 && (
              <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-6">
                <h3 className="text-base font-semibold text-(--text-primary) mb-4">
                  Upcoming Events
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {upcomingEvents.slice(0, 4).map((ev) => {
                    const meta = categoryMeta[ev.category ?? "meeting"];
                    return (
                      <div
                        key={ev.id}
                        className={`p-4 rounded-xl border-2 relative ${meta.card}`}
                      >
                        {isManager && (
                          <div className="absolute top-2 right-2">
                            <EventMenu
                              event={ev}
                              onEdit={() => openEdit(ev)}
                              onDelete={() => handleDelete(ev.id)}
                            />
                          </div>
                        )}
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${meta.iconBox}`}
                        >
                          {meta.icon}
                        </div>
                        <h4 className="text-sm font-semibold text-(--text-primary) mb-2 pr-6">
                          {ev.title}
                        </h4>
                        <div className="space-y-1.5 text-xs text-(--text-muted)">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon size={12} />
                            {new Date(ev.date + "T00:00:00").toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={12} />
                            {ev.time}
                          </div>
                          {ev.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin size={12} />
                              <span className="truncate">{ev.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Week view ── */}
        {viewMode === "week" && (
          <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={prevPeriod}
                  className="p-2 hover:bg-(--bg-card2) rounded-lg"
                >
                  <ChevronLeft size={18} />
                </button>
                <h3 className="text-lg font-semibold text-(--text-primary)">
                  {weekLabel}
                </h3>
                <button
                  onClick={nextPeriod}
                  className="p-2 hover:bg-(--bg-card2) rounded-lg"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <div style={{ minWidth: "700px" }}>
                <div className="grid grid-cols-8 gap-1 mb-2">
                  <div />
                  {weekDays.map((d, i) => (
                    <div key={i} className="text-center">
                      <div className="text-xs text-(--text-muted) font-medium">
                        {d.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                      <div
                        className={`text-xl font-bold mt-0.5 ${isToday(d) ? "text-blue-600 dark:text-blue-400" : "text-(--text-primary)"}`}
                      >
                        {d.getDate()}
                      </div>
                    </div>
                  ))}
                </div>

                {TIME_SLOTS.map((slot) => (
                  <div key={slot} className="grid grid-cols-8 gap-1 mb-1">
                    <div className="text-[10px] text-(--text-muted) pt-2 pr-2 text-right">
                      {slot}
                    </div>
                    {weekDays.map((d, di) => {
                      const ds = dateStr(d);
                      const dayEvts = (eventsByDate[ds] || []).filter((e) => {
                        const eh = getEventHour(e);
                        const sh = slotHour(slot);
                        return slot === "All day" ? false : eh === sh;
                      });
                      return (
                        <div
                          key={di}
                          className={`h-12 rounded-lg border border-(--border) p-1 ${isToday(d) ? "bg-blue-50 dark:bg-blue-950/10" : "bg-gray-50 dark:bg-[#0f172a]"}`}
                        >
                          {dayEvts.map((ev) => {
                            const meta = categoryMeta[ev.category ?? "meeting"];
                            return (
                              <div
                                key={ev.id}
                                className={`text-[9px] font-medium px-1 py-0.5 rounded truncate ${meta.card}`}
                              >
                                {ev.title}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── List view ── */}
        {viewMode === "list" && (
          <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-6">
            <h3 className="text-base font-semibold text-(--text-primary) mb-4">
              Upcoming Events
            </h3>
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-16 text-(--text-muted)">
                <CalendarIcon size={40} className="mx-auto mb-3 opacity-30" />
                <p>No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((ev) => {
                  const meta = categoryMeta[ev.category ?? "meeting"];
                  return (
                    <div
                      key={ev.id}
                      className="flex items-start gap-4 p-4 rounded-xl bg-(--bg-card2) border border-(--border) hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                      <div
                        className={`p-2.5 rounded-lg shrink-0 ${meta.iconBox}`}
                      >
                        {meta.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-(--text-primary) mb-1">
                          {ev.title}
                        </h4>
                        <div className="flex flex-wrap gap-3 text-xs text-(--text-muted)">
                          <span className="flex items-center gap-1">
                            <CalendarIcon size={12} />
                            {new Date(ev.date + "T00:00:00").toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {ev.time}
                          </span>
                          {ev.location && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {ev.location}
                            </span>
                          )}
                        </div>
                      </div>
                      {isManager && (
                        <EventMenu
                          event={ev}
                          onEdit={() => openEdit(ev)}
                          onDelete={() => handleDelete(ev.id)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEvent ? "Edit Event" : "Create Event"}
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} className="flex-1">
              {editingEvent ? "Update" : "Create"} Event
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">
              Event Title
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Q3 Planning Meeting"
              className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-(--text-primary) block mb-2">
                Date
              </label>
              <DatePicker
                value={form.date}
                onChange={(val) => setForm({ ...form, date: val })}
                placeholder="Select event date"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-(--text-primary) block mb-2">
                Time
              </label>
              <CustomSelect
                value={form.time}
                onChange={(val) => setForm({ ...form, time: val as string })}
                options={TIME_OPTIONS}
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">
              Category
            </label>
            <CustomSelect
              value={form.category || "meeting"}
              onChange={(val) =>
                setForm({ ...form, category: val as Event["category"] })
              }
              options={CATEGORY_OPTIONS}
              className="w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">
              Location (Optional)
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g., Main Hall, Zoom"
              className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Event details..."
              rows={3}
              className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
