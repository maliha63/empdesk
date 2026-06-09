import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import toast, { Toaster } from "react-hot-toast";

interface Notice {
  id: number;
  date: string;
  title: string;
  description: string;
}

const initialNotices: Notice[] = [
  { id: 1, date: "01 Feb 2025", title: "General Notice", description: "School-wide updates, reminders, and holiday schedules." },
  { id: 2, date: "12 Mar 2025", title: "Annual Sports Day", description: "Details regarding sports competitions and event schedule." },
];

export default function NoticeBoardPage() {
  const [notices, setNotices] = useState(initialNotices);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });

  const handleSave = () => {
    if (!form.title || !form.description) {
      toast.error("Title and description are required");
      return;
    }

    if (editingNotice) {
      setNotices(notices.map(n => n.id === editingNotice.id ? { ...n, ...form } : n));
      toast.success("Notice updated");
    } else {
      setNotices([...notices, { id: Date.now(), date: new Date().toLocaleDateString(), ...form }]);
      toast.success("Notice added");
    }

    setShowModal(false);
    setForm({ title: "", description: "" });
    setEditingNotice(null);
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Notice Board"
          description="School announcements and important updates"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Notice Board" },
          ]}
          action={<Button onClick={() => { setEditingNotice(null); setForm({ title: "", description: "" }); setShowModal(true); }}>+ Add Notice</Button>}
        />

        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-[#0f172a]">
                <th className="text-left pl-8 py-4">S.L</th>
                <th className="text-left py-4">Date</th>
                <th className="text-left py-4">Title</th>
                <th className="text-left py-4">Description</th>
                <th className="text-right pr-8 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {notices.map((notice, i) => (
                <tr key={notice.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                  <td className="pl-8 py-5">{String(i + 1).padStart(2, '0')}</td>
                  <td className="py-5">{notice.date}</td>
                  <td className="py-5 font-medium">{notice.title}</td>
                  <td className="py-5 text-(--text-secondary) line-clamp-2">{notice.description}</td>
                  <td className="pr-8 py-5 text-right space-x-3">
                    <button onClick={() => { setEditingNotice(notice); setForm({ title: notice.title, description: notice.description }); setShowModal(true); }} className="text-blue-600 hover:underline">Edit</button>
                    <button onClick={() => { setNotices(notices.filter(n => n.id !== notice.id)); toast.success("Notice deleted"); }} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#111827] rounded-2xl w-full max-w-lg p-8">
            <h3 className="text-xl font-semibold mb-6">{editingNotice ? "Edit Notice" : "Add New Notice"}</h3>
            <input
              type="text"
              placeholder="Enter title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border rounded-xl px-4 py-3 mb-4"
            />
            <textarea
              placeholder="Enter description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              className="w-full border rounded-xl px-4 py-3 mb-6"
            />
            <div className="flex gap-3">
              <Button variant="danger" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} className="flex-1">{editingNotice ? "Update" : "Save"}</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}