import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import toast, { Toaster } from "react-hot-toast";
import { Trash2, Edit2, Building2 } from "lucide-react";

interface Department {
  id: number;
  name: string;
  description: string;
}

const initialDepartments: Department[] = [
  { id: 1, name: "English Department", description: "Head of the entire school/institution" },
  { id: 2, name: "Mathematics Department", description: "Assists the principal in academic/admin" },
  { id: 3, name: "Science Department", description: "Leads a department or specific academic section" },
  { id: 4, name: "Social Studies Department", description: "Experienced teacher with leadership duties" },
];

export default function DepartmentPage() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const handleOpenModal = (dept?: Department) => {
    if (dept) {
      setEditingDept(dept);
      setForm({ name: dept.name, description: dept.description });
    } else {
      setEditingDept(null);
      setForm({ name: "", description: "" });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Name and description are required");
      return;
    }

    if (editingDept) {
      setDepartments(
        departments.map((d) =>
          d.id === editingDept.id ? { ...d, ...form } : d
        )
      );
      toast.success("Department updated");
    } else {
      setDepartments([
        ...departments,
        { id: Date.now(), ...form },
      ]);
      toast.success("Department added");
    }

    setShowModal(false);
    setForm({ name: "", description: "" });
    setEditingDept(null);
  };

  const handleDeleteClick = (dept: Department) => {
    setDeptToDelete(dept);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (deptToDelete) {
      setDepartments(departments.filter((d) => d.id !== deptToDelete.id));
      toast.success("Department deleted");
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Departments"
          description="Manage school departments and sections"
          crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Departments" }]}
          action={<Button onClick={() => handleOpenModal()}>+ Add Department</Button>}
        />

        {departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#111827] border border-[var(--border)] rounded-2xl">
            <Building2 size={48} className="text-[var(--text-muted)] mb-4 opacity-30" />
            <p className="text-[var(--text-primary)] font-medium mb-1">No departments yet</p>
            <p className="text-[var(--text-muted)] text-sm">Create your first department to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="bg-white dark:bg-[#111827] border border-[var(--border)] border-l-4 border-l-blue-500 rounded-xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {dept.name}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
                  {dept.description}
                </p>

                <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
                  <button
                    onClick={() => handleOpenModal(dept)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors text-sm font-medium"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(dept)}
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
        title={editingDept ? "Edit Department" : "Add Department"}
        size="md"
        footer={
          <>
            <Button variant="primary" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {editingDept ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Department Name
            </label>
            <input
              type="text"
              placeholder="e.g., Engineering Department"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Description
            </label>
            <textarea
              placeholder="Department description and responsibilities"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
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
        title="Delete Department"
        message={`Are you sure you want to delete "${deptToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
      />
    </>
  );
}
