import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Edit2, Briefcase } from "lucide-react";

interface Designation {
  id: number;
  name: string;
  description: string;
}

const initialDesignations: Designation[] = [
  { id: 1, name: "Principal", description: "Head of the entire school/institution" },
  { id: 2, name: "Vice Principal", description: "Assists the principal and oversees daily operations" },
  { id: 3, name: "Head Teacher", description: "Leads a department or specific academic section" },
  { id: 4, name: "Senior Teacher", description: "Experienced teacher responsible for mentoring junior staff" },
];

export default function DesignationPage() {
  const [designations, setDesignations] = useState(initialDesignations);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingDesig, setEditingDesig] = useState<Designation | null>(null);
  const [desigToDelete, setDesigToDelete] = useState<Designation | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const handleOpenModal = (desig?: Designation) => {
    if (desig) {
      setEditingDesig(desig);
      setForm({ name: desig.name, description: desig.description });
    } else {
      setEditingDesig(null);
      setForm({ name: "", description: "" });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Name and description are required");
      return;
    }

    if (editingDesig) {
      setDesignations(
        designations.map((d) =>
          d.id === editingDesig.id ? { ...d, ...form } : d
        )
      );
      toast.success("Designation updated");
    } else {
      setDesignations([
        ...designations,
        { id: Date.now(), ...form },
      ]);
      toast.success("Designation added");
    }

    setShowModal(false);
    setForm({ name: "", description: "" });
    setEditingDesig(null);
  };

  const handleDeleteClick = (desig: Designation) => {
    setDesigToDelete(desig);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (desigToDelete) {
      setDesignations(designations.filter((d) => d.id !== desigToDelete.id));
      toast.success("Designation deleted");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Designations"
          description="Manage job roles and designations"
          crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Designations" }]}
          action={<Button onClick={() => handleOpenModal()}>+ Add Designation</Button>}
        />

        {designations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#111827] border border-[var(--border)] rounded-2xl">
            <Briefcase size={48} className="text-[var(--text-muted)] mb-4 opacity-30" />
            <p className="text-[var(--text-primary)] font-medium mb-1">No designations yet</p>
            <p className="text-[var(--text-muted)] text-sm">Create your first designation to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {designations.map((desig) => (
              <div
                key={desig.id}
                className="bg-white dark:bg-[#111827] border border-[var(--border)] border-l-4 border-l-purple-500 rounded-xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {desig.name}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                  {desig.description}
                </p>

                <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
                  <button
                    onClick={() => handleOpenModal(desig)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/30 transition-colors text-sm font-medium"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(desig)}
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
        title={editingDesig ? "Edit Designation" : "Add Designation"}
        size="md"
        footer={
          <>
            <Button variant="primary" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {editingDesig ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Designation Name
            </label>
            <input
              type="text"
              placeholder="e.g., Senior Manager"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Description
            </label>
            <textarea
              placeholder="Role responsibilities and requirements"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Designation"
        message={`Are you sure you want to delete "${desigToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
      />
    </>
  );
}
