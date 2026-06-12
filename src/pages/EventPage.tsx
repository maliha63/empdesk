import { useState, useMemo } from "react";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import Modal from "../components/Modal";
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

const categoryIcons = {
  meeting: <Briefcase size={16} />,
  deadline: <Clock size={16} />,
  social: <Users size={16} />,
  training: <Book size={16} />,
};

const categoryColors = {
  meeting: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300", border: "border-purple-200 dark:border-purple-800", lightBg: "bg-purple-50 dark:bg-purple-950/20", icon: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
  deadline: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300", border: "border-red-200 dark:border-red-800", lightBg: "bg-red-50 dark:bg-red-950/20", icon: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
  social: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800", lightBg: "bg-emerald-50 dark:bg-emerald-950/20", icon: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
  training: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-300", border: "border-orange-200 dark:border-orange-800", lightBg: "bg-orange-50 dark:bg-orange-950/20", icon: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" },
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

type ViewType = "month" | "week" | "list";

export default function EventPage() {
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const [events, setEvents] = useState(initialEvents);
  const [currentDate, setCurrentDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<ViewType>("month");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Event, "id">>({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
    category: "meeting",
  });

  const monthDays = useMemo(() => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [currentDate]);

  const weekStart = useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    date.setDate(date.getDate() - day);
    return date;
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }, [weekStart]);

  const upcomingEvents = useMemo(() => {
    return events
      .filter((e) => new Date(e.date) >= currentDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events, currentDate]);

  const timeSlots = ["All day", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"];

  const getEventsForWeekDay = (date: Date) => {
    return events.filter((event) => event.date === date.toISOString().split("T")[0]);
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
      const newEvent: Event = { ...form, id: Math.max(...events.map((e) => e.id), 0) + 1 };
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

  const getTabClassName = (tab: ViewType) => {
    const baseClass = "px-4 py-1.5 rounded-full text-sm font-medium transition-all";
    const activeClass = "bg-blue-600 text-white";
    const inactiveClass = "text-(--text-primary) hover:bg-gray-100 dark:hover:bg-[#111827]";
    return `${baseClass} ${viewMode === tab ? activeClass : inactiveClass}`;
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Events"
          description="View and manage all company events"
          crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Events" }]}
          action={<Button onClick={() => handleOpenModal()}>+ Create Event</Button>}
        />

        {viewMode === "month" && (
          <div className="space-y-6">
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
                <div className="flex gap-2">
                  <button onClick={() => setViewMode("month")} className={getTabClassName("month")}>
                    Month
                  </button>
                  <button onClick={() => setViewMode("week")} className={getTabClassName("week")}>
                    Week
                  </button>
                  <button onClick={() => setViewMode("list")} className={getTabClassName("list")}>
                    List
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-semibold text-(--text-muted) text-xs py-2">
                    {day}
                  </div>
                ))}
                {monthDays.map((day, idx) => {
                  const dateStr = day ? `2026-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
                  const dayEvents = dateStr ? events.filter((e) => e.date === dateStr) : [];
                  const isToday = day && day === new Date().getDate();
                  const isSelected = day && day === currentDate.getDate() && currentDate.getMonth() === new Date().getMonth();

                  return (
                    <div
                      key={idx}
                      onClick={() => day && setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                      className={`min-h-16 p-2 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected ? "bg-blue-600 dark:bg-blue-600 border-blue-600 text-white" : day ? "border-[#e2e8f0] dark:border-[#1f2a3d] hover:border-blue-400" : "border-transparent bg-gray-50 dark:bg-[#0f172a] cursor-default"
                      }`}
                    >
                      <div className={`text-xs font-semibold mb-1 ${isSelected ? "text-white" : isToday ? "text-blue-600 dark:text-blue-400" : "text-(--text-primary)"}`}>
                        {day || ""}
                      </div>
                      <div className="flex flex-wrap gap-0.5">
                        {dayEvents.map((event) => (
                          <div key={event.id} className={`w-1.5 h-1.5 rounded-full ${categoryColors[event.category || "meeting"].border}`} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-(--text-primary) mb-4">Upcoming Events</h3>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon size={40} className="mx-auto mb-2 text-(--text-muted) opacity-50" />
                  <p className="text-(--text-muted)">No upcoming events</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {upcomingEvents.slice(0, 4).map((event) => (
                    <div key={event.id} className={`p-4 rounded-xl ${categoryColors[event.category || "meeting"].lightBg} border ${categoryColors[event.category || "meeting"].border}`}>
                      <div className={`p-3 rounded-lg inline-block mb-3 ${categoryColors[event.category || "meeting"].icon}`}>
                        {categoryIcons[event.category || "meeting"]}
                      </div>
                      <h4 className="font-semibold text-(--text-primary) text-sm mb-2">{event.title}</h4>
                      <div className="text-xs text-(--text-muted) space-y-1">
                        <div className="flex items-center gap-1.5">
                          <CalendarIcon size={12} />
                          {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} />
                          {event.time}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={12} />
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {viewMode === "week" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1f2a3d] rounded-lg">
                    <ChevronLeft size={18} />
                  </button>
                  <h3 className="text-lg font-semibold text-(--text-primary) min-w-56 text-center">
                    {weekStart.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                  </h3>
                  <button onClick={() => setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1f2a3d] rounded-lg">
                    <ChevronRight size={18} />
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewMode("month")} className={getTabClassName("month")}>
                    Month
                  </button>
                  <button onClick={() => setViewMode("week")} className={getTabClassName("week")}>
                    Week
                  </button>
                  <button onClick={() => setViewMode("list")} className={getTabClassName("list")}>
                    List
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="grid grid-cols-8 gap-1 min-w-max">
                  <div className="w-16 pt-6"></div>
                  {weekDays.map((day, idx) => (
                    <div key={idx} className="w-24">
                      <div className="text-center">
                        <div className="text-xs font-medium text-(--text-muted) mb-0.5">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                        <div className={`text-lg font-bold ${day.toDateString() === new Date().toDateString() ? "text-blue-600" : "text-(--text-primary)"}`}>{day.getDate()}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-2 grid grid-cols-8 gap-1 min-w-max">
                  {timeSlots.map((slot, slotIdx) => (
                    <div key={slotIdx} className={slotIdx === 0 ? "w-16" : "w-24"}>
                      {slotIdx === 0 ? (
                        <div className="text-xs font-medium text-(--text-muted) h-8 flex items-end pb-1">{slot}</div>
                      ) : (
                        <div className="space-y-1">
                          <div className="text-xs text-(--text-muted) mb-1">{slot}</div>
                          {weekDays.map((day, dayIdx) => {
                            const dayEvents = getEventsForWeekDay(day).filter((e) => {
                              const eventHour = parseInt(e.time.split(":")[0]);
                              const slotHour = parseInt(slot.replace(/\s[AP]M/, ""));
                              return eventHour === slotHour || (slot === "All day" && eventHour < 9);
                            });

                            return (
                              <div key={dayIdx} className="h-8 bg-gray-50 dark:bg-[#0f172a] rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d] p-0.5">
                                {dayEvents.map((event) => (
                                  <div key={event.id} className={`text-[8px] font-medium p-0.5 rounded ${categoryColors[event.category || "meeting"].bg} cursor-pointer truncate`}>
                                    {event.title}
                                  </div>
                                ))}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === "list" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-(--text-primary)">Upcoming Events</h3>
                <div className="flex gap-2">
                  <button onClick={() => setViewMode("month")} className={getTabClassName("month")}>
                    Month
                  </button>
                  <button onClick={() => setViewMode("week")} className={getTabClassName("week")}>
                    Week
                  </button>
                  <button onClick={() => setViewMode("list")} className={getTabClassName("list")}>
                    List
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon size={48} className="mx-auto mb-4 text-(--text-muted) opacity-50" />
                  <p className="text-(--text-muted)">No upcoming events</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#0f172a] border border-[#e2e8f0] dark:border-[#1f2a3d] hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                      <div className={`p-3 rounded-lg flex-shrink-0 ${categoryColors[event.category || "meeting"].icon}`}>
                        {categoryIcons[event.category || "meeting"]}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-(--text-primary) mb-1">{event.title}</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-(--text-muted)">
                          <div className="flex items-center gap-1.5">
                            <CalendarIcon size={14} />
                            {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            {event.time}
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1.5">
                              <MapPin size={14} />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="relative">
                        <button onClick={() => setOpenMenuId(openMenuId === event.id ? null : event.id)} className="p-2 hover:bg-gray-200 dark:hover:bg-[#1f2a3d] rounded-lg flex-shrink-0">
                          <MoreVertical size={18} className="text-(--text-muted)" />
                        </button>
                        {isManager && openMenuId === event.id && (
                          <div className="absolute right-0 top-full mt-2 bg-white dark:bg-[#1f2a3d] border border-[#e2e8f0] dark:border-[#2d3748] rounded-lg shadow-lg z-10 w-40">
                            <button onClick={() => handleOpenModal(event)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-[#111827] text-(--text-primary) transition-colors">
                              <Edit2 size={14} />
                              Edit Event
                            </button>
                            <button onClick={() => handleDelete(event.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors border-t border-[#e2e8f0] dark:border-[#2d3748]">
                              <Trash2 size={14} />
                              Delete Event
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingEvent ? "Edit Event" : "Add Event"}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)} size="md" className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} size="md" className="flex-1">
              {editingEvent ? "Update" : "Create"} Event
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">Event Title</label>
            <input
              type="text"
              placeholder="e.g., Q3 Planning Meeting, Team Lunch"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-(--text-primary) block mb-2">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-(--text-primary) block mb-2">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as "meeting" | "deadline" | "social" | "training" })}
              className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="social">Social Event</option>
              <option value="training">Training</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">Location (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Main Hall, Boardroom, Zoom"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">Description</label>
            <textarea
              placeholder="Event details, agenda, and attendee information..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
