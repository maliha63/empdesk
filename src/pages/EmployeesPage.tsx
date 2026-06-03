import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import toast, { Toaster } from "react-hot-toast";
import { useEmployees } from "../hooks/useEmployees";
import { useDebounce } from "../hooks/useDebounce";
import { usePagination } from "../hooks/usePagination";
import { useAuth } from "../hooks/useAuth";
import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/Badge";
import { ConfirmModal } from "../components/ConfirmModal";
import { Dropdown } from "../components/Dropdown";
import { DEPARTMENTS, ITEMS_PER_PAGE } from "../constants";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import Button from "../components/Button";

export default function EmployeesPage() {
  const { employees, isLoading, deleteEmployee } = useEmployees();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [dept, setDept] = useState("All");
  const [sortBy, setSortBy] = useState<"name" | "dept">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const debouncedSearch = useDebounce(search, 400);

  const filtered = useMemo(() => {
    return employees
      .filter((e) => {
        const name = `${e.firstName} ${e.lastName}`.toLowerCase();
        const matchSearch =
          name.includes(debouncedSearch.toLowerCase()) ||
          e.email.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchDept = dept === "All" || e.company?.department === dept;
        return matchSearch && matchDept;
      })
      .sort((a, b) => {
        const valA =
          sortBy === "name"
            ? `${a.firstName} ${a.lastName}`
            : (a.company?.department ?? "");
        const valB =
          sortBy === "name"
            ? `${b.firstName} ${b.lastName}`
            : (b.company?.department ?? "");
        return sortDir === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
  }, [employees, debouncedSearch, dept, sortBy, sortDir]);

  const { page, setPage, totalPages, paginated, reset } = usePagination(
    filtered,
    ITEMS_PER_PAGE,
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      reset();
    },
    [reset],
  );

  const toggleSort = useCallback(
    (field: "name" | "dept") => {
      if (sortBy === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      else {
        setSortBy(field);
        setSortDir("asc");
      }
    },
    [sortBy],
  );

  function handleDeleteClick(id: number) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }
  function handleConfirmDelete() {
    if (pendingDeleteId === null) return;
    deleteEmployee(pendingDeleteId);
    setConfirmOpen(false);
    setPendingDeleteId(null);
    toast.success("Employee deleted.");
  }

  const deptOptions = DEPARTMENTS.map((d) => ({ label: d, value: d }));

  if (isLoading) return <TableSkeleton />;

  return (
    <>
      <Toaster position="top-right" />
      <ConfirmModal
        isOpen={confirmOpen}
        title="Delete Employee"
        message="This action cannot be undone. The employee will be permanently removed."
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
      />

      <div className="space-y-5">
        <PageHeader
          title="Employees"
          description={`${filtered.length} records`}
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Employees" },
          ]}
          action={
            user?.role === "manager" ? (
              <Button
                onClick={() => navigate("/employees/add")}
                // className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
              >
                <Plus size={16} /> Add Employee
              </Button>
            ) : undefined
          }
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearch}
              className="w-full bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-3 
                 text-sm text-gray-900 dark:text-white 
                 placeholder:text-gray-400 dark:placeholder:text-gray-500
                 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <Dropdown
            options={deptOptions}
            value={dept}
            onChange={(val) => {
              setDept(val);
              reset();
            }}
            className="min-w-40"
          />
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 w-12"></th>
                <th
                  className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer"
                  onClick={() => toggleSort("name")}
                >
                  Name{" "}
                  {sortBy === "name" &&
                    (sortDir === "asc" ? (
                      <ChevronUp size={12} className="inline" />
                    ) : (
                      <ChevronDown size={12} className="inline" />
                    ))}
                </th>
                <th
                  className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 cursor-pointer"
                  onClick={() => toggleSort("dept")}
                >
                  Department{" "}
                  {sortBy === "dept" &&
                    (sortDir === "asc" ? (
                      <ChevronUp size={12} className="inline" />
                    ) : (
                      <ChevronDown size={12} className="inline" />
                    ))}
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                  Email
                </th>
                <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                  Title
                </th>
                <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-12 text-gray-500 dark:text-gray-400"
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                paginated.map((e, i) => (
                  <motion.tr
                    key={e.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <img
                        src={e.image}
                        alt={e.firstName}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      {e.firstName} {e.lastName}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="blue">{e.company?.department}</Badge>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                      {e.email}
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 hidden lg:table-cell">
                      {e.company?.title}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-4">
                        <button
                          onClick={() => navigate(`/employees/${e.id}`)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <Eye size={16} />
                        </button>
                        {user?.role === "manager" && (
                          <>
                            <button
                              onClick={() =>
                                navigate(`/employees/${e.id}/edit`)
                              }
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(e.id)}
                              className="text-red-500 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {paginated.map((e, i) => (
            <MobileCard
              key={e.id}
              employee={e}
              index={i}
              isManager={user?.role === "manager"}
              onView={() => navigate(`/employees/${e.id}`)}
              onEdit={() => navigate(`/employees/${e.id}/edit`)}
              onDelete={() => handleDeleteClick(e.id)}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-[#4b5e7a]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d]
                  text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white
                  disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
                )
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`e-${i}`}
                      className="px-2 py-1.5 text-xs text-gray-400 dark:text-[#4b5e7a]"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        page === p
                          ? "bg-brand-500 border-brand-500 text-white"
                          : "border-[#e2e8f0] dark:border-[#1f2a3d] text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d]
                  text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white
                  disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Mobile Card Component
function MobileCard({
  employee: e,
  index,
  isManager,
  onView,
  onEdit,
  onDelete,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-2xl p-4 flex items-center gap-4"
    >
      <img
        src={e.image}
        alt={e.firstName}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 dark:text-white">
          {e.firstName} {e.lastName}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {e.company?.title}
        </p>
        <div className="mt-1">
          <Badge variant="blue">{e.company?.department}</Badge>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          onClick={onView}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <Eye size={18} />
        </button>
        {isManager && (
          <>
            <button
              onClick={onEdit}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-5">
      <div className="skeleton h-8 w-40" />
      <div className="skeleton h-10 rounded-lg" />
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-14 border-b border-[#e2e8f0] dark:border-[#1f2a3d] px-4 flex items-center gap-3"
          >
            <div className="skeleton w-8 h-8 rounded-full" />
            <div className="skeleton h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
