import { useMemo, useState } from "react";
import { useEmployees } from "../hooks/useEmployees";
import { PageHeader } from "../components/PageHeader";
import DataTable from "../components/DataTable";
import SearchBox from "../components/SearchBox";
import TableActionButtons from "../components/TableActionButtons";
import { useTableState } from "../hooks/useTableState";
import Modal from "../components/Modal";
import { Badge } from "../components/Badge";
import { getDepartmentBadgeVariant } from "../utils/departmentColors";
import toast, { Toaster } from "react-hot-toast";

interface PositionData {
  id: string;
  department: string;
  title: string;
  count: number;
}

interface EditForm {
  title: string;
  department: string;
}

export default function PositionsPage() {
  const { employees } = useEmployees();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<EditForm>({ title: "", department: "" });

  const positionData = useMemo(() => {
    const map = new Map<string, PositionData>();

    employees.forEach((emp) => {
      const dept = emp.company?.department || "Other";
      const title = emp.company?.title || "Staff";
      const key = `${dept}-${title}`;

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          department: dept,
          title,
          count: 0,
        });
      }
      map.get(key)!.count++;
    });

    return Array.from(map.values());
  }, [employees]);

  const tableState = useTableState(positionData, 10, ["department", "title"]);

  const handleEdit = (id: string) => {
    const position = positionData.find(p => p.id === id);
    if (position) {
      setFormData({ title: position.title, department: position.department });
      setShowModal(true);
    }
  };

  const handleDelete = (_: string) => {
    toast.success("Position archived");
  };

  const handleSave = () => {
    if (formData.title.trim() && formData.department.trim()) {
      toast.success("Position updated successfully");
      setShowModal(false);
      setFormData({ title: "", department: "" });
    } else {
      toast.error("Please fill all fields");
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
      label: "Position",
      sortable: true,
      render: (value: string) => (
        <span className="font-semibold text-(--text-primary)">{value}</span>
      ),
    },
    {
      key: "department" as const,
      label: "Department",
      sortable: true,
      render: (value: string) => (
        <Badge variant={getDepartmentBadgeVariant(value) as any}>
          {value}
        </Badge>
      ),
    },
    {
      key: "count" as const,
      label: "Employee Count",
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-blue-600 dark:text-blue-400 text-lg">
          {value}
        </span>
      ),
    },
    {
      key: "id" as const,
      label: "Action",
      width: "120px",
      render: (id: string) => (
        <TableActionButtons
          onEdit={() => handleEdit(id)}
          onDelete={() => handleDelete(id)}
        />
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Positions"
          description="Job roles and department distribution"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Employee" },
            { label: "Position" },
          ]}
        />

        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 flex items-center gap-4">
          <SearchBox
            value={tableState.searchTerm}
            onChange={tableState.setSearchTerm}
            placeholder="Search positions..."
          />
        </div>

        <DataTable
          columns={columns as any}
          data={tableState.paginatedData}
          sortBy={tableState.sortBy}
          sortOrder={tableState.sortOrder}
          onSort={tableState.handleSort}
          emptyMessage="No positions found"
        />

        {/* Updated Pagination Block */}
        {tableState.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-[#4b5e7a]">
              Showing {((tableState.currentPage - 1) * 10) + 1} to {Math.min(tableState.currentPage * 10, tableState.filteredData.length)} of {tableState.filteredData.length} results
            </p>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => tableState.setCurrentPage(Math.max(1, tableState.currentPage - 1))}
                disabled={tableState.currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d] text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                &larr; Prev
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: tableState.totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === tableState.totalPages || Math.abs(p - tableState.currentPage) <= 1)
                  .reduce<(number | "...")[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span key={`ellipse-${i}`} className="px-2 py-1.5 text-xs text-gray-400 dark:text-[#4b5e7a]">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => tableState.setCurrentPage(p as number)}
                        className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                          tableState.currentPage === p
                            ? "bg-gray-900 dark:bg-white border-gray-900 dark:border-white text-white dark:text-gray-900"
                            : "border-[#e2e8f0] dark:border-[#1f2a3d] text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button
                onClick={() => tableState.setCurrentPage(Math.min(tableState.totalPages, tableState.currentPage + 1))}
                disabled={tableState.currentPage === tableState.totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d] text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Edit Position"
          size="md"
          footer={
            <>
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-2 text-sm font-medium text-(--text-primary) border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg hover:bg-gray-50 dark:hover:bg-[#1f2a3d] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                Save
              </button>
            </>
          }
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-(--text-primary) mb-2">
                Position Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Senior Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-(--text-primary) mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Engineering"
              />
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}