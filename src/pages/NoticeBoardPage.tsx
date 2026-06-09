import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Edit2, Bell } from "lucide-react";

interface Notice {
  id: number;
  date: string;
  title: string;
  description: string;
  priority?: "high" | "medium" | "low";
}

const initialNotices: Notice[] = [
  { id: 1, date: "June 5, 2025", title: "Q2 Performance Reviews - Schedule Your Session", description: "All employees are required to complete their Q2 performance review by June 15. Sign up for 1-on-1 slots with your manager.", priority: "high" },
  { id: 2, date: "June 3, 2025", title: "Updated Remote Work Policy", description: "Effective immediately: Flexible remote work policy now allows up to 3 days WFH per week. Details in HR portal.", priority: "high" },
  { id: 3, date: "June 1, 2025", title: "Professional Development Fund Open", description: "Apply now for training courses, certifications, and conferences. Up to $2,000 per employee this fiscal year.", priority: "medium" },
  { id: 4, date: "May 28, 2025", title: "Annual Team Offsite - June 15-17", description: "Save the dates! Join us at Tahoe Resort for our annual team building event. Agenda and registration details coming soon.", priority: "medium" },
  { id: 5, date: "May 20, 2025", title: "New Health Insurance Plan", description: "Comprehensive medical, dental, and vision coverage now available. Review plan options in the benefits portal.", priority: "low" },
];

export default function NoticeBoardPage() {
  const [notices, setNotices] = useState(initialNotices);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeToDelete, setNoticeToDelete] = useState<Notice | null>(null);
  const [form, setForm] = useState({ title: "", description: "", priority: "medium" as const });

  const handleOpenModal = (notice?: Notice) => {
    if (notice) {
      setEditingNotice(notice);
      setForm({ title: notice.title, description: notice.description, priority: notice.priority || "medium" });
    } else {
      setEditingNotice(null);
      setForm({ title: "", description: "", priority: "medium" });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    if (editingNotice) {
      setNotices(notices.map(n => 
        n.id === editingNotice.id 
          ? { ...n, ...form, priority: form.priority as "high" | "medium" | "low" } 
          : n
      ));
      toast.success("Notice updated");
    } else {
      setNotices([
        { 
          id: Date.now(), 
          date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), 
          ...form,
          priority: form.priority as "high" | "medium" | "low"
        },
        ...notices
      ]);
      toast.success("Notice added");
    }

    setShowModal(false);
    setForm({ title: "", description: "", priority: "medium" });
    setEditingNotice(null);
  };

  const handleDeleteClick = (notice: Notice) => {
    setNoticeToDelete(notice);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (noticeToDelete) {
      setNotices(notices.filter(n => n.id !== noticeToDelete.id));
      toast.success("Notice deleted");
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800";
      case "medium":
        return "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800";
      default:
        return "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800";
    }
  };

  const getPriorityBadgeColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300";
      case "medium":
        return "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300";
      default:
        return "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300";
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Notice Board"
          description="Company announcements and HR updates"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Notice Board" },
          ]}
          action={<Button onClick={() => handleOpenModal()}>+ Add Notice</Button>}
        />

        {notices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#111827] border border-[var(--border)] rounded-2xl">
            <Bell size={48} className="text-[var(--text-muted)] mb-4 opacity-30" />
            <p className="text-[var(--text-primary)] font-medium mb-1">No notices yet</p>
            <p className="text-[var(--text-muted)] text-sm">Create your first notice to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className={`border-l-4 rounded-xl p-5 bg-white dark:bg-[#111827] border border-[var(--border)] hover:shadow-md transition-all ${getPriorityColor(notice.priority)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] break-words">{notice.title}</h3>
                    <p className="text-[11px] text-[var(--text-muted)] mt-1">{notice.date}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap ml-3 shrink-0 ${getPriorityBadgeColor(notice.priority)}`}>
                    {notice.priority || "Normal"}
                  </span>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-3">
                  {notice.description}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenModal(notice)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors text-sm font-medium"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(notice)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors text-sm font-medium"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingNotice ? "Edit Notice" : "Add Notice"}
        size="md"
        footer={
          <>
            <Button
              variant="primary"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1"
            >
              {editingNotice ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Title
            </label>
            <input
              type="text"
              placeholder="e.g., Q2 Performance Reviews Open"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Priority
            </label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as "high" | "medium" | "low" })}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Description
            </label>
            <textarea
              placeholder="Announcement details, deadlines, and important information..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Notice"
        message={`Are you sure you want to delete "${noticeToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
      />
    </>
  );
}
