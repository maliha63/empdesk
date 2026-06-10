import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBox from "../components/SearchBox";
import TableActionButtons from "../components/TableActionButtons";
import Modal from "../components/Modal";
import { Plus } from "lucide-react";
import { Badge } from "../components/Badge";
import { useTableState } from "../hooks/useTableState";

interface LeaveType {
  id: number;
  name: string;
  availableDays: number;
  status: "Active" | "Inactive";
  description?: string;
}

const MOCK_LEAVE_TYPES: LeaveType[] = [
  { id: 1, name: "Medical Leave", availableDays: 12, status: "Active", description: "For medical emergencies and health issues" },
  { id: 2, name: "Casual Leave", availableDays: 8, status: "Active", description: "For personal reasons and casual time off" },
  { id: 3, name: "Annual Leave", availableDays: 20, status: "Active", description: "Yearly paid vacation" },
  { id: 4, name: "Maternity Leave", availableDays: 90, status: "Active", description: "For expectant and new mothers" },
  { id: 5, name: "Paternity Leave", availableDays: 15, status: "Active", description: "For new fathers" },
  { id: 6, name: "Bereavement Leave", availableDays: 5, status: "Active", description: "For family emergencies" },
  { id: 7, name: "Study Leave", availableDays: 7, status: "Inactive", description: "For professional development" },
  { id: 8, name: "Special Leave", availableDays: 3, status: "Active", description: "For special occasions" },
];

export default function LeaveTypesPage() {
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>(MOCK_LEAVE_TYPES);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    availableDays: 0,
    status: "Active" as "Active" | "Inactive",
    description: "",
  });

  const tableState = useTableState(leaveTypes, 10, ["name", "description"]);

  const handleAddNew = () => {
    setEditingId(null);
    setFormData({
      name: "",
      availableDays: 0,
      status: "Active",
      description: "",
    });
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    const type = leaveTypes.find((t) => t.id === id);
    if (type) {
      setEditingId(id);
      setFormData({
        name: type.name,
        availableDays: type.availableDays,
        status: type.status,
        description: type.description || "",
      });
      setShowModal(true);
    }
  };

  const handleDelete = (id: number) => {
    setLeaveTypes(leaveTypes.filter((t) => t.id !== id));
  };

  const handleSave = () => {
    if (editingId) {
      setLeaveTypes(
        leaveTypes.map((t) =>
          t.id === editingId ? { ...t, ...formData } : t
        )
      );
    } else {
      setLeaveTypes([
        ...leaveTypes,
        {
          id: Math.max(...leaveTypes.map((t) => t.id), 0) + 1,
          ...formData,
        },
      ]);
    }
    setShowModal(false);
  };

  const columns = [
    {
      key: "id" as const,
      label: "S.L",
      width: "60px",
      render: (_: any, __: any, idx: number) => (
        <span className="text-(--text-muted)">{idx + 1}</span>
      ),
    },
    {
      key: "name" as const,
      label: "Leave Type",
      sortable: true,
      render: (value: string) => (
        <span className="font-semibold text-(--text-primary)">{value}</span>
      ),
    },
    {
      key: "availableDays" as const,
      label: "Available Days",
      sortable: true,
      render: (value: number) => {
        const days = isNaN(value) ? 0 : value;
        return (
          <span className="font-medium text-blue-600 dark:text-blue-400">
            {days} days
          </span>
        );
      },
    },
    {
      key: "status" as const,
      label: "Status",
      sortable: true,
      render: (value: string) => (
        <Badge
          variant={value === "Active" ? "green" : "slate"}
          dot
        >
          {value}
        </Badge>
      ),
    },
    {
      key: "id" as const,
      label: "Action",
      width: "100px",
      render: (id: number) => (
        <TableActionButtons
          onEdit={() => handleEdit(id)}
          onDelete={() => handleDelete(id)}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Types"
        description="Manage leave types and available days"
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Leave Types" },
        ]}
        action={
          <Button onClick={handleAddNew} icon={<Plus size={18} />}>
            Add Leave Type
          </Button>
        }
      />

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 flex items-center gap-4">
        <SearchBox
          value={tableState.searchTerm}
          onChange={tableState.setSearchTerm}
          placeholder="Search leave types..."
        />
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns as any}
        data={tableState.paginatedData}
        sortBy={tableState.sortBy}
        sortOrder={tableState.sortOrder}
        onSort={tableState.handleSort}
        emptyMessage="No leave types found"
      />

      {/* Pagination */}
      <Pagination
        currentPage={tableState.currentPage}
        totalPages={tableState.totalPages}
        totalItems={tableState.filteredData.length}
        itemsPerPage={10}
        onPageChange={tableState.setCurrentPage}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? "Edit Leave Type" : "Add New Leave Type"}
        size="md"
        footer={
          <>
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-sm font-medium text-(--text-primary) border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1f2a3d] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Save
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-2">
              Leave Type Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Medical Leave"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-2">
              Available Days <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.availableDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  availableDays: parseInt(e.target.value) || 0,
                })
              }
              className="w-full px-3 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as "Active" | "Inactive",
                })
              }
              className="w-full px-3 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-(--text-primary) mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Leave type description"
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
