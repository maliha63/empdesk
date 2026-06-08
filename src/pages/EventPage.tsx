import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import toast, { Toaster } from "react-hot-toast";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  description: string;
}

const initialEvents: Event[] = [
  { id: 1, title: "Design Conference", date: "Today", time: "10:30 PM", description: "Annual design summit" },
];

export default function EventPage() {
  const [events, setEvents] = useState(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", description: "" });

  const handleSave = () => {
    setEvents([...events, { id: Date.now(), ...form }]);
    toast.success("Event added");
    setShowModal(false);
    setForm({ title: "", date: "", time: "", description: "" });
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Event"
          description="Upcoming school events and activities"
          crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Event" }]}
          action={<Button onClick={() => setShowModal(true)}>+ Add Event</Button>}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Event List */}
          <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6">
            <h3 className="font-semibold mb-4">Upcoming Events</h3>
            {events.map(event => (
              <div key={event.id} className="border-b last:border-0 py-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-(--text-muted)">{event.date} • {event.time}</p>
                  </div>
                </div>
                <p className="text-sm text-(--text-secondary) mt-2">{event.description}</p>
              </div>
            ))}
          </div>

          {/* Calendar Placeholder */}
          <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6 text-center">
            <p className="text-6xl mb-4">📅</p>
            <p className="font-medium">June 2026 Calendar</p>
            <p className="text-(--text-muted) mt-2">Interactive calendar coming soon</p>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#111827] rounded-2xl w-full max-w-md p-8">
            <h3 className="text-xl font-semibold mb-6">Add New Event</h3>
            {/* Simple form - you can enhance with DatePicker later */}
            <input type="text" placeholder="Event Title" className="w-full border rounded-xl px-4 py-3 mb-4" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
            <input type="date" className="w-full border rounded-xl px-4 py-3 mb-4" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} />
            <input type="text" placeholder="Time" className="w-full border rounded-xl px-4 py-3 mb-6" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} />
            <textarea placeholder="Description" className="w-full border rounded-xl px-4 py-3" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} />
            <div className="flex gap-3 mt-6">
              <Button variant="danger" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} className="flex-1">Save Event</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}