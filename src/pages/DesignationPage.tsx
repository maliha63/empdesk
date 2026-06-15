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
  {
    id: 1,
    name: "Senior Software Engineer",
    description:
      "Designs and develops core platform features. Mentors junior engineers and leads technical initiatives",
  },
  {
    id: 2,
    name: "DevOps Engineer",
    description:
      "Manages cloud infrastructure, CI/CD pipelines, and system reliability. Ensures 99.9% uptime",
  },
  {
    id: 3,
    name: "QA Engineer",
    description:
      "Develops test strategies, automation frameworks, and ensures product quality across releases",
  },
  {
    id: 4,
    name: "Product Manager",
    description:
      "Defines product strategy, manages roadmap, and drives feature prioritization across teams",
  },
  {
    id: 5,
    name: "Product Designer",
    description:
      "Leads UX/UI design, user research, and designs customer-facing experiences",
  },
  {
    id: 6,
    name: "Marketing Manager",
    description:
      "Develops marketing strategy, manages campaigns, and drives customer acquisition",
  },
  {
    id: 7,
    name: "Sales Manager",
    description:
      "Manages sales team, owns revenue targets, and manages key client relationships",
  },
  {
    id: 8,
    name: "Finance Manager",
    description:
      "Handles budgeting, financial planning, and manages company accounting operations",
  },
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
          d.id === editingDesig.id ? { ...d, ...form } : d,
        ),
      );
      toast.success("Designation updated");
    } else {
      setDesignations([...designations, { id: Date.now(), ...form }]);
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
          description="Manage job titles and roles"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Designations" },
          ]}
          action={
            <Button onClick={() => handleOpenModal()}>+ Add Designation</Button>
          }
        />

        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-(--border) bg-[#f8fafc] dark:bg-[#0f172a]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary) whitespace-nowrap">
                  S.L
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary)">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary)">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-(--text-primary)">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border)">
              {designations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center">
                    <Briefcase
                      size={48}
                      className="text-(--text-muted) mx-auto mb-4 opacity-30"
                    />
                    <p className="text-(--text-primary) font-medium mb-1">
                      No designations yet
                    </p>
                    <p className="text-(--text-muted) text-sm">
                      Create your first designation to get started
                    </p>
                  </td>
                </tr>
              ) : (
                designations.map((desig, idx) => (
                  <tr
                    key={desig.id}
                    className="hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-(--text-primary) font-medium">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3 text-sm text-(--text-primary) font-medium">
                      {desig.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-(--text-muted)">
                      {desig.description}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleOpenModal(desig)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/20 text-purple-600 dark:text-purple-400 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(desig)}
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
        title={editingDesig ? "Edit Designation" : "Add Designation"}
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingDesig ? "Update" : "Create"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">
              Designation Name
            </label>
            <input
              type="text"
              placeholder="e.g., Senior Software Engineer"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">
              Description
            </label>
            <textarea
              placeholder="Role responsibilities and requirements"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
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
