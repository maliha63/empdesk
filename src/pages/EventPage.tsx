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

// Category icons and colors
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
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [currentDate, setCurrentDate] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<ViewType>("month");
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [form, setForm] = useState<{
    title: string;
    date: string;
    time: string;
    description: string;
    location: string;
    category: "meeting" | "deadline" | "social" | "training";
  }>({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
    category: "meeting",
  });

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
      setForm({
        title: "",
        date: selectedDate.toISOString().split("T")[0],
        time: "",
        description: "",
        location: "",
        category: "meeting",
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.date || !form.time.trim()) {
      toast.error("Title, date, and time are required");
      return;
    }

    if (editingEvent) {
      setEvents(
        events.map((e) =>
          e.id === editingEvent.id
            ? { ...e, ...form, category: form.category as "meeting" | "deadline" | "social" | "training" }
            : e
        )
      );
      toast.success("Event updated");
    } else {
      setEvents([
        {
          id: Date.now(),
          ...form,
          category: form.category as "meeting" | "deadline" | "social" | "training",
        },
        ...events,
      ]);
      toast.success("Event added");
    }

    setShowModal(false);
    setForm({
      title: "",
      date: "",
      time: "",
      description: "",
      location: "",
      category: "meeting",
    });
    setEditingEvent(null);
  };

  const handleDelete = (id: number) => {
    setEvents(events.filter((e) => e.id !== id));
    toast.success("Event deleted");
    setOpenMenuId(null);
  };


  const upcomingEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return events
      .filter((e) => new Date(e.date) >= today)
      .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  }, [events]);

  const monthDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [currentDate]);

  const weekStart = useMemo(() => {
    const date = new Date(currentDate);
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  }, [currentDate]);

  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      days.push(date);
    }
    return days;
  }, [weekStart]);

  const timeSlots = [
    "All day",
    "9 AM",
    "10 AM",
    "11 AM",
    "12 PM",
    "1 PM",
    "2 PM",
    "3 PM",
    "4 PM",
    "5 PM",
  ];

  const getEventsForWeekDay = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events.filter((e) => e.date === dateStr);
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
            {/* Month View Calendar */}
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-(--text-primary)">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1f2a3d] rounded-lg">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1f2a3d] rounded-lg">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2 mb-6">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-(--text-muted) py-3">
                    {day}
                  </div>
                ))}

                {monthDays.map((day, idx) => {
                  const isToday = day && day.toDateString() === new Date().toDateString();
                  const isSelected = day && day.toDateString() === selectedDate.toDateString();
                  const dateStr = day ? day.toISOString().split("T")[0] : "";
                  const dayEvents = dateStr ? events.filter((e) => e.date === dateStr) : [];

                  return (
                    <button
                      key={idx}
                      onClick={() => day && setSelectedDate(day)}
                      className={`min-h-[100px] p-3 rounded-lg border transition-all ${
                        isSelected
                          ? "bg-blue-500 border-blue-500 text-white"
                          : day
                          ? isToday
                            ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                            : "bg-white dark:bg-[#0f172a] border-[#e2e8f0] dark:border-[#1f2a3d] hover:border-blue-300 dark:hover:border-blue-700"
                          : "bg-gray-50 dark:bg-[#0f172a] border-gray-100 dark:border-[#1f2a3d]"
                      }`}
                    >
                      <div className={`text-sm font-semibold mb-2 ${!day ? "text-gray-300" : isSelected ? "text-white" : "text-(--text-primary)"}`}>
                        {day?.getDate()}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div key={event.id} className={`w-2 h-2 rounded-full ${categoryColors[event.category || "meeting"].bg}`} />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Event Legend */}
              <div className="flex gap-6 flex-wrap text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-100"></div>
                  <span className="text-(--text-muted)">Workshop</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-100"></div>
                  <span className="text-(--text-muted)">Launch</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-100"></div>
                  <span className="text-(--text-muted)">Meeting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-100"></div>
                  <span className="text-(--text-muted)">Wellness</span>
                </div>
              </div>
            </div>

            {/* Upcoming Events Cards */}
            {upcomingEvents.length > 0 && (
              <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-(--text-primary) mb-4">Upcoming Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {upcomingEvents.slice(0, 4).map((event) => (
                    <div key={event.id} className={`p-4 rounded-xl border-2 ${categoryColors[event.category || "meeting"].lightBg} ${categoryColors[event.category || "meeting"].border}`}>
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${categoryColors[event.category || "meeting"].icon}`}>
                        {categoryIcons[event.category || "meeting"]}
                      </div>
                      <h4 className="font-semibold text-(--text-primary) mb-2 line-clamp-2">{event.title}</h4>
                      <div className="space-y-2 text-sm text-(--text-muted)">
                        <div className="flex items-center gap-2">
                          <CalendarIcon size={14} />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          {event.time}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin size={14} />
                            <span className="line-clamp-1">{event.location}</span>
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

        {viewMode === "week" && (
          <div className="space-y-6">
            {/* Week View Header */}
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-(--text-primary)">
                    {weekStart.toLocaleDateString("en-US", { month: "long", day: "numeric" })} – {new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric" })}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCurrentDate(new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000))} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1f2a3d] rounded-lg">
                    <ChevronLeft size={18} />
                  </button>
                  <button onClick={() => setCurrentDate(new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000))} className="p-2 hover:bg-gray-100 dark:hover:bg-[#1f2a3d] rounded-lg">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Week Grid */}
              <div className="overflow-x-auto">
                <div className="grid grid-cols-8 gap-2 min-w-max">
                  <div className="w-20 pt-8"></div>
                  {weekDays.map((day, idx) => (
                    <div key={idx} className="w-32">
                      <div className="text-center">
                        <div className="text-sm font-medium text-(--text-muted) mb-1">{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
                        <div className={`text-2xl font-bold ${day.toDateString() === new Date().toDateString() ? "text-blue-600" : "text-(--text-primary)"}`}>{day.getDate()}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="mt-4 grid grid-cols-8 gap-2 min-w-max">
                  {timeSlots.map((slot, slotIdx) => (
                    <div key={slotIdx} className={slotIdx === 0 ? "w-20" : "w-32"}>
                      {slotIdx === 0 ? (
                        <div className="text-xs font-medium text-(--text-muted) h-12 flex items-end pb-2">{slot}</div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-xs text-(--text-muted) mb-2">{slot}</div>
                          {weekDays.map((day, dayIdx) => {
                            const dayEvents = getEventsForWeekDay(day).filter((e) => {
                              const eventHour = parseInt(e.time.split(":")[0]);
                              const slotHour = parseInt(slot.replace(/\s[AP]M/, ""));
                              return eventHour === slotHour || (slot === "All day" && eventHour < 9);
                            });

                            return (
                              <div key={dayIdx} className="h-12 bg-gray-50 dark:bg-[#0f172a] rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d] p-1">
                                {dayEvents.map((event) => (
                                  <div key={event.id} className={`text-[10px] font-medium p-1 rounded mb-1 ${categoryColors[event.category || "meeting"].bg} cursor-pointer truncate`}>
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
            {/* Upcoming Events List */}
            <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-(--text-primary) mb-4">Upcoming Events</h3>

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
                          <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#1f2a3d] border border-[#e2e8f0] dark:border-[#2d3748] rounded-lg shadow-lg z-50 w-40">
                            <button onClick={() => { handleOpenModal(event); setOpenMenuId(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-[#111827] text-(--text-primary) transition-colors">
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button onClick={() => handleDelete(event.id)} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors border-t border-[#e2e8f0] dark:border-[#2d3748]">
                              <Trash2 size={14} />
                              Delete
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

        {/* View Tabs */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-full p-1 shadow-lg">
          <Button
            variant={viewMode === "month" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("month")}
            className="rounded-full"
          >
            Month
          </Button>
          <Button
            variant={viewMode === "week" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("week")}
            className="rounded-full"
          >
            Week
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-full"
          >
            List
          </Button>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
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
            <label className="text-sm font-medium text-(--text-primary) block mb-2">
              Event Title
            </label>
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
              <label className="text-sm font-medium text-(--text-primary) block mb-2">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-(--text-primary) block mb-2">
                Time
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">
              Category
            </label>
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
            <label className="text-sm font-medium text-(--text-primary) block mb-2">
              Location (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Main Hall, Boardroom, Zoom"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">
              Description
            </label>
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
