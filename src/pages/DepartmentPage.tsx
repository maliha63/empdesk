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
  { id: 1, name: "Engineering", description: "Builds and maintains our core platform, backend systems, and infrastructure. Led by VP Engineering" },
  { id: 2, name: "Product", description: "Defines product strategy, roadmap, and features. Collaborates with Design and Engineering teams" },
  { id: 3, name: "Design", description: "Creates user experiences, interfaces, and brand identity. Specializes in UX/UI and product design" },
  { id: 4, name: "Marketing", description: "Drives growth, brand awareness, and customer acquisition. Handles campaigns and market research" },
  { id: 5, name: "Sales", description: "Manages client relationships and business development. Owns pipeline and revenue targets" },
  { id: 6, name: "Finance", description: "Handles accounting, budgeting, financial planning, and payroll management" },
  { id: 7, name: "Human Resources", description: "Manages recruitment, employee development, benefits, and workplace culture" },
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
          description="Manage company departments and teams"
          crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Departments" }]}
          action={<Button onClick={() => handleOpenModal()}>+ Add Department</Button>}
        />

        <div className="bg-white dark:bg-[#111827] border divide-(--border) rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b divide-(--border) bg-[#f8fafc] dark:bg-[#0f172a]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary) whitespace-nowrap">S.L</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary)">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary)">Description</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-(--text-primary)">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border)">
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <Building2 size={48} className="text-(--text-muted) mx-auto mb-4 opacity-30" />
                    <p className="text-(--text-primary) font-medium mb-1">No departments yet</p>
                    <p className="text-(--text-muted) text-sm">Create your first department to get started</p>
                  </td>
                </tr>
              ) : (
                departments.map((dept, idx) => (
                  <tr key={dept.id} className="hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] transition-colors">
                    <td className="px-4 py-3 text-sm text-(--text-primary) font-medium">{String(idx + 1).padStart(2, '0')}</td>
                    <td className="px-4 py-3 text-sm text-(--text-primary) font-medium">{dept.name}</td>
                    <td className="px-4 py-3 text-sm text-(--text-primary)">{dept.description}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleOpenModal(dept)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-600 dark:text-blue-400 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(dept)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 dark:text-red-400 transition-colors ml-1"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingDept ? "Edit Department" : "Add Department"}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
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
            <label className="text-sm font-medium text-(--text-primary) block mb-2">
              Department Name
            </label>
            <input
              type="text"
              placeholder="e.g., Engineering, Marketing, Sales"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border divide-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">
              Description
            </label>
            <textarea
              placeholder="Department description and responsibilities"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full border divide-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
