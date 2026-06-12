import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import Modal from "../components/Modal";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import SearchBox from "../components/SearchBox";
import CustomSelect from "../components/CustomSelect";
import TableActionButtons from "../components/TableActionButtons";
import { useTableState } from "../hooks/useTableState";
import { useAuth } from "../hooks/useAuth";
import { Badge } from "../components/Badge";
import toast, { Toaster } from "react-hot-toast";
import { Plus } from "lucide-react";

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
  const { user } = useAuth();
  const isManager = user?.role === "manager";
  const [notices, setNotices] = useState(initialNotices);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [form, setForm] = useState<{ title: string; description: string; priority: "high" | "medium" | "low" }>({ title: "", description: "", priority: "medium" });
  const [filterPriority, setFilterPriority] = useState<string>("");

  const filteredNotices = filterPriority 
    ? notices.filter(n => n.priority === filterPriority)
    : notices;

  const tableState = useTableState(filteredNotices, 10, ["title", "description"]);

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

  const handleDelete = (id: number) => {
    setNotices(notices.filter(n => n.id !== id));
    toast.success("Notice deleted");
  };

  const getPriorityBadgeVariant = (priority?: string) => {
    switch (priority) {
      case "high":
        return "red" as const;
      case "medium":
        return "amber" as const;
      default:
        return "blue" as const;
    }
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
      key: "title" as const,
      label: "Title",
      sortable: true,
      render: (value: string) => (
        <span className="font-semibold text-(--text-primary)">{value}</span>
      ),
    },
    {
      key: "date" as const,
      label: "Date",
      sortable: true,
      render: (value: string) => (
        <span className="text-(--text-muted) text-sm">{value}</span>
      ),
    },
    {
      key: "priority" as const,
      label: "Priority",
      sortable: true,
      render: (value: string) => (
        <Badge variant={getPriorityBadgeVariant(value)} dot>
          {value?.charAt(0).toUpperCase() + value?.slice(1) || "Low"}
        </Badge>
      ),
    },
    {
      key: "description" as const,
      label: "Description",
      render: (value: string) => (
        <p className="text-(--text-muted) text-sm truncate max-w-xs">
          {value}
        </p>
      ),
    },
    // Only managers can edit/delete notices
    ...(isManager
      ? [
          {
            key: "id" as const,
            label: "Action",
            width: "100px",
            render: (id: number) => {
              const notice = notices.find((n) => n.id === id);
              return (
                <TableActionButtons
                  onEdit={() => handleOpenModal(notice)}
                  onDelete={() => handleDelete(id)}
                />
              );
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Notice Board"
          description="Important announcements and updates"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Notice Board" },
          ]}
          action={
            isManager && (
              <Button onClick={() => handleOpenModal()} icon={<Plus size={18} />}>
                Add Notice
              </Button>
            )
          }
        />

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 flex items-center gap-4 flex-wrap">
          <SearchBox
            value={tableState.searchTerm}
            onChange={tableState.setSearchTerm}
            placeholder="Search notices..."
          />
          <CustomSelect
            value={filterPriority}
            onChange={(value) => setFilterPriority(String(value))}
            options={[
              { value: "", label: "All Priorities" },
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]}
          />
        </div>

        {/* Data Table */}
        <DataTable
          columns={columns as any}
          data={tableState.paginatedData}
          sortBy={tableState.sortBy}
          sortOrder={tableState.sortOrder}
          onSort={tableState.handleSort}
          emptyMessage="No notices found"
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
          title={editingNotice ? "Edit Notice" : "Add New Notice"}
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingNotice ? "Update" : "Save"}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-(--text-primary) mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notice title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text-primary) mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Notice description"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text-primary) mb-2">
                Priority
              </label>
              <CustomSelect
                value={form.priority}
                onChange={(value) =>
                  setForm({
                    ...form,
                    priority: value as "high" | "medium" | "low",
                  })
                }
                className="w-full"
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
              />
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}
