import { useState, useMemo } from "react";
import { PageHeader } from "../components/PageHeader";
import toast, { Toaster } from "react-hot-toast";
import { Clock, MapPin, Calendar as CalendarIcon, Briefcase, Users, Book, ChevronLeft, ChevronRight, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  location?: string;
  category?: "meeting" | "deadline" | "social" | "training";
}

type ViewType = "month" | "week" | "list";

const categoryIcons = {
  meeting: <Briefcase size={16} />,
  deadline: <Clock size={16} />,
  social: <Users size={16} />,
  training: <Book size={16} />,
};

const categoryColors = {
  meeting: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-300 dark:border-purple-600", dot: "bg-purple-500", lightBg: "bg-purple-50 dark:bg-purple-950/20", icon: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
  deadline: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", border: "border-red-300 dark:border-red-600", dot: "bg-red-500", lightBg: "bg-red-50 dark:bg-red-950/20", icon: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
  social: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-300 dark:border-emerald-600", dot: "bg-emerald-500", lightBg: "bg-emerald-50 dark:bg-emerald-950/20", icon: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
  training: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", border: "border-orange-300 dark:border-orange-600", dot: "bg-orange-500", lightBg: "bg-orange-50 dark:bg-orange-950/20", icon: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
};

const initialEvents: Event[] = [
  {
    id: 0,
    title: "Team Building Workshop",
    date: "2026-06-12",
    time: "10:00",
    description: "Interactive team bonding workshop focused on collaboration and trust",
    location: "Conference Room A",
    category: "meeting",
  },
  {
    id: 1,
    title: "Product Launch",
    date: "2026-06-16",
    time: "09:30",
    description: "Launch of new AI features with demo and Q&A",
    location: "Main Auditorium",
    category: "social",
  },
  {
    id: 2,
    title: "Monthly Townhall",
    date: "2026-06-19",
    time: "14:00",
    description: "Company-wide update and employee Q&A session",
    location: "Virtual (Google Meet)",
    category: "meeting",
  },
  {
    id: 3,
    title: "Wellness Session",
    date: "2026-06-26",
    time: "11:00",
    description: "Guided meditation and wellness activity",
    location: "Wellness Room",
    category: "training",
  },
  {
    id: 4,
    title: "Q2 Performance Review Deadline",
    date: "2026-06-15",
    time: "23:59",
    description: "All performance reviews must be submitted",
    location: "Online",
    category: "deadline",
  },
];

export default function EventPage() {
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const [events, setEvents] = useState(initialEvents);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 12));
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<ViewType>("month");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", date: "", time: "", description: "", location: "", category: "meeting" as "meeting" | "deadline" | "social" | "training" });

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthDays = useMemo(() => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const days = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push(null);
    return days;
  }, [currentDate]);

  // Get week start (Sunday)
  const weekStart = useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  }, [currentDate]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000));
  }, [weekStart]);

  const futureEvents = useMemo(() => {
    return events
      .filter(e => new Date(e.date) >= currentDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, currentDate]);

  const timeSlots = ["All day", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"];

  const getEventsForDate = (dateStr: string) => {
    return events.filter(e => e.date === dateStr);
  };

  const getEventsForWeekDay = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.filter(e => e.date === dateStr);
  };

  const getViewButtonClass = (mode: ViewType) => {
    const baseActive = "px-4 py-1.5 rounded-full text-sm font-medium bg-blue-600 text-white";
    const baseInactive = "px-4 py-1.5 rounded-full text-sm font-medium text-(--text-primary) hover:bg-gray-100 dark:hover:bg-[#111827]";
    return viewMode === mode ? baseActive : baseInactive;
  };

  const handleOpenModal = (event?: Event) => {
    if (event) {
      setEditingEvent(event);
      setForm({
        title: event.title,
        date: event.date,
        time: event.time,
        description: event.description,
        location: event.location || "",
        category: event.category || "meeting",
      });
    } else {
      setEditingEvent(null);
      setForm({ title: "", date: "", time: "", description: "", location: "", category: "meeting" });
    }
    setShowModal(true);
    setOpenMenuId(null);
  };

  const handleSave = () => {
    if (!form.title || !form.date || !form.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editingEvent) {
      setEvents(events.map((e) => (e.id === editingEvent.id ? { ...e, ...form } : e)));
      toast.success("Event updated");
    } else {
      const newEvent: Event = { ...form, id: Math.max(...events.map((e) => e.id), -1) + 1 };
      setEvents([...events, newEvent]);
      toast.success("Event created");
    }

    setShowModal(false);
    setEditingEvent(null);
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter((e) => e.id !== id));
    toast.success("Event deleted");
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events"
        description="View and manage all company events"
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Events" },
        ]}
      />

      {/* Month View */}
      {viewMode === "month" && (
        <div className="space-y-6">
          {/* Calendar */}
          <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1f2a3d] rounded-lg">
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-xl font-bold text-(--text-primary) min-w-40 text-center">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h2>
                <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1f2a3d] rounded-lg">
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="flex gap-2 bg-white dark:bg-[#1f2a3d] border border-[#e2e8f0] dark:border-[#2d3748] rounded-full p-1">
                <button onClick={() => setViewMode("month" as ViewType)} className={getViewButtonClass("month")}>
                  Month
                </button>
                <button onClick={() => setViewMode("week" as ViewType)} className={getViewButtonClass("week")}>
                  Week
                </button>
                <button onClick={() => setViewMode("list" as ViewType)} className={getViewButtonClass("list")}>
                  List
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center font-semibold text-(--text-muted) text-sm py-3">
                  {day}
                </div>
              ))}
              {monthDays.map((day, idx) => {
                const dateStr = day ? `2026-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
                const dayEvents = dateStr ? getEventsForDate(dateStr) : [];
                const isSelected = day === currentDate.getDate() && currentDate.getMonth() === new Date().getMonth();

                return (
                  <div
                    key={idx}
                    onClick={() => day && setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                    className={`aspect-square p-2 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected ? "bg-blue-600 dark:bg-blue-600 border-blue-600 text-white" : day ? "border-[#e2e8f0] dark:border-[#1f2a3d] hover:border-blue-400" : "border-transparent bg-gray-50 dark:bg-[#0f172a] cursor-default"
                    }`}
                  >
                    <div className={`text-sm font-semibold mb-1 ${isSelected ? "text-white" : "text-(--text-primary)"}`}>
                      {day || ""}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div key={event.id} className={`w-2 h-2 rounded-full ${categoryColors[event.category || "meeting"].dot}`} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Events Cards */}
          {futureEvents.length > 0 && (
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-(--text-primary) mb-4">Upcoming Events</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {futureEvents.map((event) => (
                  <div key={event.id} className={`${categoryColors[event.category || "meeting"].lightBg} border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg p-4 relative`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className={`${categoryColors[event.category || "meeting"].icon} p-2 rounded-lg flex-shrink-0`}>
                        {categoryIcons[event.category || "meeting"]}
                      </div>
                      {isManager && (
                        <div className="relative">
                          <button onClick={() => setOpenMenuId(openMenuId === event.id ? null : event.id)} className="p-1 hover:bg-gray-200 dark:hover:bg-[#1f2a3d] rounded flex-shrink-0">
                            <MoreVertical size={16} className="text-(--text-muted)" />
                          </button>
                          {openMenuId === event.id && (
                            <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#1f2a3d] border border-[#e2e8f0] dark:border-[#2d3748] rounded-lg shadow-lg z-20 w-40">
                              <button onClick={() => handleOpenModal(event)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-[#111827] text-(--text-primary) transition-colors">
                                <Edit2 size={14} />
                                Edit
                              </button>
                              <button onClick={() => handleDelete(event.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors border-t border-[#e2e8f0] dark:border-[#2d3748]">
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-(--text-primary) text-sm mb-2">{event.title}</h4>
                    <div className="space-y-1 text-xs text-(--text-muted)">
                      <div className="flex items-center gap-1">
                        <CalendarIcon size={12} />
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {event.time}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Week View */}
      {viewMode === "week" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <button onClick={() => setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1f2a3d] rounded-lg">
                  <ChevronLeft size={18} />
                </button>
                <h2 className="text-lg font-bold text-(--text-primary) min-w-56 text-center">
                  {weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </h2>
                <button onClick={() => setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1f2a3d] rounded-lg">
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="flex gap-2 bg-white dark:bg-[#1f2a3d] border border-[#e2e8f0] dark:border-[#2d3748] rounded-full p-1">
                <button onClick={() => setViewMode("month" as ViewType)} className={getViewButtonClass("month")}>
                  Month
                </button>
                <button onClick={() => setViewMode("week" as ViewType)} className={getViewButtonClass("week")}>
                  Week
                </button>
                <button onClick={() => setViewMode("list" as ViewType)} className={getViewButtonClass("list")}>
                  List
                </button>
              </div>
            </div>

            {/* Week Grid */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-8 gap-0.5 min-w-full">
                {/* Time labels column */}
                <div className="w-20">
                  <div className="h-12"></div>
                  {timeSlots.slice(1).map((slot, idx) => (
                    <div key={idx} className="h-20 flex items-start pt-1 text-xs font-medium text-(--text-muted) px-1">
                      {slot}
                    </div>
                  ))}
                </div>

                {/* Day columns */}
                {weekDays.map((day, dayIdx) => (
                  <div key={dayIdx} className="flex-1 min-w-24">
                    {/* Day header */}
                    <div className="text-center py-3 border-b border-[#e2e8f0] dark:border-[#1f2a3d] mb-1">
                      <div className="text-xs font-medium text-(--text-muted)">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                      <div className="text-lg font-bold text-(--text-primary)">{day.getDate()}</div>
                    </div>

                    {/* Time slots */}
                    {timeSlots.slice(1).map((_slot, slotIdx) => {
                      const dayEvents = getEventsForWeekDay(day);
                      const slotEvents = dayEvents.filter((e) => {
                        const hour = parseInt(e.time.split(":")[0]);
                        const slotHour = slotIdx + 9;
                        return hour === slotHour;
                      });

                      return (
                        <div key={slotIdx} className="h-20 border border-[#e2e8f0] dark:border-[#1f2a3d] p-1 bg-gray-50 dark:bg-[#0f172a]">
                          {slotEvents.map((event) => (
                            <div key={event.id} className={`${categoryColors[event.category || "meeting"].bg} text-(--text-muted) text-xs p-1 rounded mb-1 font-medium truncate cursor-pointer hover:opacity-80`} title={event.title}>
                              {event.title}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs">
              {Object.entries(categoryColors).map(([key, color]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color.dot}`}></div>
                  <span className="text-(--text-muted) capitalize">{key}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-(--text-primary)">Upcoming Events</h2>
              <div className="flex gap-2 bg-white dark:bg-[#1f2a3d] border border-[#e2e8f0] dark:border-[#2d3748] rounded-full p-1">
                <button onClick={() => setViewMode("month" as ViewType)} className={getViewButtonClass("month")}>
                  Month
                </button>
                <button onClick={() => setViewMode("week" as ViewType)} className={getViewButtonClass("week")}>
                  Week
                </button>
                <button onClick={() => setViewMode("list" as ViewType)} className={getViewButtonClass("list")}>
                  List
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {futureEvents.map((event) => (
                <div key={event.id} className={`${categoryColors[event.category || "meeting"].border} border-l-4 ${categoryColors[event.category || "meeting"].lightBg} p-4 rounded-lg flex items-start justify-between hover:shadow-sm transition-shadow`}>
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`${categoryColors[event.category || "meeting"].icon} p-2 rounded-lg flex-shrink-0`}>
                      {categoryIcons[event.category || "meeting"]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-(--text-primary) mb-2">{event.title}</h4>
                      <div className="flex flex-wrap gap-3 text-xs text-(--text-muted)">
                        <div className="flex items-center gap-1">
                          <CalendarIcon size={14} />
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {event.time}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {isManager && (
                    <div className="relative flex-shrink-0">
                      <button onClick={() => setOpenMenuId(openMenuId === event.id ? null : event.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-[#1f2a3d] rounded-lg">
                        <MoreVertical size={18} className="text-(--text-muted)" />
                      </button>
                      {openMenuId === event.id && (
                        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#1f2a3d] border border-[#e2e8f0] dark:border-[#2d3748] rounded-lg shadow-lg z-20 w-40">
                          <button onClick={() => handleOpenModal(event)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-[#111827] text-(--text-primary) transition-colors">
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button onClick={() => handleDelete(event.id)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors border-t border-[#e2e8f0] dark:border-[#2d3748]">
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Event Button */}
      <button onClick={() => handleOpenModal()} className="fixed bottom-8 right-8 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg">
        + Create Event
      </button>

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#111827] rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-(--text-primary) mb-4">{editingEvent ? "Edit Event" : "Create Event"}</h2>

            <input type="text" placeholder="Event Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full mb-3 px-4 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary)" />

            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full mb-3 px-4 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary)" />

            <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full mb-3 px-4 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary)" />

            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as any })} className="w-full mb-3 px-4 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary)">
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="social">Social</option>
              <option value="training">Training</option>
            </select>

            <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full mb-3 px-4 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary)" />

            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mb-4 px-4 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary) resize-none" rows={3} />

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg text-(--text-primary) hover:bg-gray-50 dark:hover:bg-[#1f2a3d] transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {editingEvent ? "Update" : "Create"}
              </button>
            </div>
          </div>
          </div>
      )}

      <Toaster />
    </div>
  );
}
