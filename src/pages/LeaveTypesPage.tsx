import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Edit2, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { usePagination } from "../hooks/usePagination";

interface LeaveType {
  id: number;
  name: string;
  maxDays: number;
  description: string;
  status: "active" | "inactive";
}

const initialLeaveTypes: LeaveType[] = [
  { id: 1, name: "Medical Leave", maxDays: 10, description: "For illness or medical emergencies", status: "active" },
  { id: 2, name: "Casual Leave", maxDays: 12, description: "For personal reasons and casual absences", status: "active" },
  { id: 3, name: "Earned Leave", maxDays: 20, description: "Vacation and planned time off", status: "active" },
  { id: 4, name: "Special Leave", maxDays: 5, description: "For special circumstances", status: "inactive" },
  { id: 5, name: "Maternity Leave", maxDays: 90, description: "For expecting mothers", status: "active" },
  { id: 6, name: "Paternity Leave", maxDays: 15, description: "For new fathers", status: "active" },
  { id: 7, name: "Bereavement Leave", maxDays: 3, description: "For family emergencies", status: "active" },
  { id: 8, name: "Sick Leave", maxDays: 8, description: "For medical situations", status: "active" },
];

export default function LeaveTypesPage() {
  const [leaveTypes, setLeaveTypes] = useState(initialLeaveTypes);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingType, setEditingType] = useState<LeaveType | null>(null);
  const [typeToDelete, setTypeToDelete] = useState<LeaveType | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", maxDays: 0, description: "", status: "active" as const });

  const filteredTypes = leaveTypes.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { currentPage, totalPages, getCurrentItems, goToPage } = usePagination(filteredTypes, 10);
  const currentTypes = getCurrentItems();

  const handleOpenModal = (type?: LeaveType) => {
    if (type) {
      setEditingType(type);
      setForm({
        name: type.name,
        maxDays: type.maxDays,
        description: type.description,
        status: type.status,
      });
    } else {
      setEditingType(null);
      setForm({ name: "", maxDays: 0, description: "", status: "active" });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || form.maxDays <= 0) {
      toast.error("Name and max days are required");
      return;
    }

    if (editingType) {
      setLeaveTypes(leaveTypes.map(t =>
        t.id === editingType.id
          ? { ...t, ...form, status: form.status as "active" | "inactive" }
          : t
      ));
      toast.success("Leave type updated");
    } else {
      setLeaveTypes([
        { id: Date.now(), ...form, status: form.status as "active" | "inactive" },
        ...leaveTypes
      ]);
      toast.success("Leave type added");
    }

    setShowModal(false);
    setForm({ name: "", maxDays: 0, description: "", status: "active" });
    setEditingType(null);
  };

  const handleDeleteClick = (type: LeaveType) => {
    setTypeToDelete(type);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (typeToDelete) {
      setLeaveTypes(leaveTypes.filter(t => t.id !== typeToDelete.id));
      toast.success("Leave type deleted");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === "active"
      ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
      : "bg-gray-100 dark:bg-gray-950/40 text-gray-700 dark:text-gray-300";
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Leave Types"
          description="Manage leave types and policies"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Leave" },
            { label: "Types" },
          ]}
          action={<Button onClick={() => handleOpenModal()}>+ Add Leave Type</Button>}
        />

        <div className="bg-white dark:bg-[#111827] border border-[var(--border)] rounded-xl">
          <div className="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex-1 max-w-xs">
              <input
                type="text"
                placeholder="Search leave types..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  goToPage(1);
                }}
                className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg bg-[#f8fafc] dark:bg-[#0b0f1a] text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="text-sm text-[var(--text-muted)]">
              {filteredTypes.length} leave types
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f8fafc] dark:bg-[#0f172a] border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-primary)]">Leave Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-primary)]">Description</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--text-primary)]">Max Days</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--text-primary)]">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--text-primary)]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTypes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <p className="text-[var(--text-muted)]">No leave types found</p>
                    </td>
                  </tr>
                ) : (
                  currentTypes.map((type) => (
                    <tr key={type.id} className="border-b border-[var(--border)] hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{type.name}</td>
                      <td className="px-6 py-4 text-sm text-[var(--text-secondary)] max-w-xs truncate">{type.description}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">{type.maxDays}</span>
                        <span className="text-xs text-[var(--text-muted)] ml-1">days</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-semibold inline-block ${getStatusBadgeColor(type.status)}`}>
                          {type.status.charAt(0).toUpperCase() + type.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(type)}
                            className="p-2 text-[var(--text-muted)] hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(type)}
                            className="p-2 text-[var(--text-muted)] hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-[var(--border)] flex items-center justify-between">
              <div className="text-sm text-[var(--text-muted)]">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-primary)] hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingType ? "Edit Leave Type" : "Add Leave Type"}
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
              {editingType ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Leave Type Name
            </label>
            <input
              type="text"
              placeholder="e.g., Medical Leave, Earned Leave"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Max Days Allowed
            </label>
            <input
              type="number"
              placeholder="e.g., 10"
              value={form.maxDays}
              onChange={(e) => setForm({ ...form, maxDays: parseInt(e.target.value) || 0 })}
              min="1"
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" })}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Description
            </label>
            <textarea
              placeholder="Describe the leave type..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
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
        title="Delete Leave Type"
        message={`Are you sure you want to delete "${typeToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
      />
    </>
  );
}
