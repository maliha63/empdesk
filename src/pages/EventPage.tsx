import { useState, useMemo } from "react";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import Modal from "../components/Modal";
import Calendar from "../components/Calendar";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Edit2, Clock, MapPin, Users } from "lucide-react";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
  location?: string;
  category?: "meeting" | "deadline" | "social" | "training";
}

const categoryColors = {
  meeting: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800",
  deadline: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800",
  social: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800",
  training: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800",
};

const initialEvents: Event[] = [
  {
    id: 1,
    title: "All-Hands Meeting",
    date: "2026-06-10",
    time: "14:00",
    description: "Quarterly company update, product roadmap review, and Q&A with leadership",
    location: "Main Hall / Zoom",
    category: "meeting",
  },
  {
    id: 2,
    title: "Q2 Performance Review Deadline",
    date: "2026-06-15",
    time: "23:59",
    description: "All managers must complete Q2 performance reviews by end of day",
    category: "deadline",
  },
  {
    id: 3,
    title: "Product Launch Celebration",
    date: "2026-06-15",
    time: "16:00",
    description: "Celebrate the launch of our new AI features. Light refreshments provided",
    location: "Office Terrace",
    category: "social",
  },
  {
    id: 4,
    title: "Engineering Team Lunch",
    date: "2026-06-18",
    time: "12:00",
    description: "Team bonding lunch to discuss current projects and technical challenges",
    location: "Downtown Restaurant",
    category: "social",
  },
  {
    id: 5,
    title: "Professional Development Workshop",
    date: "2026-06-20",
    time: "10:00",
    description: "Training session on advanced React patterns and best practices",
    location: "Conference Room B",
    category: "training",
  },
  {
    id: 6,
    title: "Quarterly Business Review",
    date: "2026-06-25",
    time: "10:00",
    description: "Executive presentation on company performance, metrics, and upcoming initiatives",
    location: "Boardroom",
    category: "meeting",
  },
];

export default function EventPage() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    description: "",
    location: "",
    category: "meeting" as const,
  });

  const eventsByDate = useMemo(() => {
    const map: Record<string, number> = {};
    events.forEach((event) => {
      map[event.date] = (map[event.date] || 0) + 1;
    });
    return map;
  }, [events]);

  const selectedDateEvents = useMemo(() => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    return events.filter((e) => e.date === dateStr).sort((a, b) => a.time.localeCompare(b.time));
  }, [events, selectedDate]);

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
  };

  const getCategoryBadge = (category?: string) => {
    const colors: Record<string, string> = {
      meeting: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300",
      deadline: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300",
      social: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300",
      training: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
    };
    return colors[category || "meeting"] || colors.meeting;
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Events"
          description="Manage company events and meetings"
          crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Events" }]}
          action={<Button onClick={() => handleOpenModal()}>+ Add Event</Button>}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-1">
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              events={eventsByDate}
            />
          </div>

          {/* Events List */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#111827] border border-[var(--border)] rounded-2xl p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {selectedDateEvents.length}{" "}
                  {selectedDateEvents.length === 1 ? "event" : "events"} scheduled
                </p>
              </div>

              {selectedDateEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Calendar size={48} className="text-[var(--text-muted)] mb-4 opacity-30" />
                  <p className="text-[var(--text-muted)] mb-4">No events on this date</p>
                  <Button onClick={() => handleOpenModal()}>+ Add Event</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className={`border-l-4 rounded-lg p-4 transition-all hover:shadow-md ${categoryColors[event.category || "meeting"]}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-[var(--text-primary)]">
                            {event.title}
                          </h4>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                              <Clock size={14} />
                              {event.time}
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                                <MapPin size={14} />
                                {event.location}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap ml-3 ${getCategoryBadge(event.category)}`}>
                          {event.category || "Meeting"}
                        </span>
                      </div>

                      {event.description && (
                        <p className="text-sm text-[var(--text-secondary)] mt-2 mb-3">
                          {event.description}
                        </p>
                      )}

                      <div className="flex gap-2 pt-3 border-t border-current border-opacity-20">
                        <button
                          onClick={() => handleOpenModal(event)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded hover:opacity-75 transition-opacity"
                        >
                          <Edit2 size={13} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded hover:opacity-75 transition-opacity"
                        >
                          <Trash2 size={13} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
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
            <Button variant="primary" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {editingEvent ? "Update" : "Create"} Event
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Event Title
            </label>
            <input
              type="text"
              placeholder="e.g., Q3 Planning Meeting, Team Lunch"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
                Time
              </label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as "meeting" | "deadline" | "social" | "training" })}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="social">Social Event</option>
              <option value="training">Training</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Location (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Main Hall, Boardroom, Zoom"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Description
            </label>
            <textarea
              placeholder="Event details, agenda, and attendee information..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
