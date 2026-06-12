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

      <div className="space-y-6">
        <PageHeader
          title="Employees"
          description={`${filtered.length} total employees`}
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Employees" },
          ]}
          action={
            user?.role === "manager" ? (
              <Button onClick={() => navigate("/employees/add")}>
                <Plus size={16} /> Add Employee
              </Button>
            ) : undefined
          }
        />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearch}
              className="w-full bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-700 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500"
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

        {/* Enhanced Table */}
        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d] bg-gray-50 dark:bg-[#0f172a]">
                  <th className="text-left pl-8 py-4 font-medium text-(--text-muted) w-16">S.L</th>
                  <th className="text-left px-6 py-4 font-medium text-(--text-muted) w-20">EMP ID</th>
                  <th
                    className="text-left px-6 py-4 font-medium text-(--text-muted) cursor-pointer min-w-48"
                    onClick={() => toggleSort("name")}
                  >
                    Name{" "}
                    {sortBy === "name" && (sortDir === "asc" ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />)}
                  </th>
                  <th
                    className="text-left px-6 py-4 font-medium text-(--text-muted) cursor-pointer min-w-40"
                    onClick={() => toggleSort("dept")}
                  >
                    Department{" "}
                    {sortBy === "dept" && (sortDir === "asc" ? <ChevronUp size={14} className="inline" /> : <ChevronDown size={14} className="inline" />)}
                  </th>
                  <th className="text-left px-6 py-4 font-medium text-(--text-muted) min-w-40 hidden md:table-cell">Job Title</th>
                  <th className="text-left px-6 py-4 font-medium text-(--text-muted) min-w-52 hidden lg:table-cell">Email</th>
                  <th className="text-left px-6 py-4 font-medium text-(--text-muted) min-w-40 hidden xl:table-cell">Phone</th>
                  <th className="text-center px-6 py-4 font-medium text-(--text-muted) min-w-24">Status</th>
                  <th className="text-right pr-8 py-4 font-medium text-(--text-muted) min-w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center py-16 text-(--text-muted)">
                      No employees found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((e, i) => {
                    const isActive = i % 3 !== 0;
                    return (
                      <motion.tr
                        key={e.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="hover:bg-gray-50 dark:hover:bg-[#0f172a] transition-colors"
                      >
                        <td className="pl-8 py-5 font-mono text-(--text-muted) text-center">
                          {String((page - 1) * ITEMS_PER_PAGE + i + 1).padStart(2, "0")}
                        </td>
                        <td className="px-6 py-5">
                          <span className="inline-block bg-(--bg-card2) px-3 py-1 text-xs font-mono rounded-lg border border-(--border) text-(--text-muted)">
                            {e.id}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <img
                              src={e.image}
                              alt={e.firstName}
                              className="w-9 h-9 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-700"
                            />
                            <div>
                              <p className="font-medium text-(--text-primary)">{e.firstName} {e.lastName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <Badge variant={
                            e.company?.department === "Engineering" ? "blue"
                            : e.company?.department === "Legal" ? "purple"
                            : e.company?.department === "Accounting" ? "amber"
                            : e.company?.department === "Human Resources" ? "indigo"
                            : "slate"
                          }>
                            {e.company?.department}
                          </Badge>
                        </td>
                        <td className="px-6 py-5 text-(--text-secondary) hidden md:table-cell">{e.company?.title}</td>
                        <td className="px-6 py-5 text-(--text-secondary) hidden lg:table-cell font-mono text-xs">{e.email}</td>
                        <td className="px-6 py-5 text-(--text-secondary) hidden xl:table-cell font-mono text-xs">{e.phone}</td>
                        <td className="px-6 py-5 text-center">
                          <Badge variant={isActive ? "green" : "red"} dot>
                            {isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-end gap-4">
                            <button
                              onClick={() => navigate(`/employees/${e.id}`)}
                              className="text-(--text-muted) hover:text-blue-600 transition-colors"
                            >
                              <Eye size={18} />
                            </button>
                            {user?.role === "manager" && (
                              <>
                                <button
                                  onClick={() => navigate(`/employees/${e.id}/edit`)}
                                  className="text-blue-600 hover:text-blue-700 transition-colors"
                                >
                                  <Pencil size={18} />
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(e.id)}
                                  className="text-red-500 hover:text-red-600 transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400 dark:text-[#4b5e7a]">
              Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} results
            </p>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d] text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                &larr; Prev
              </button>
              
              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
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
                        onClick={() => setPage(p as number)}
                        className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${
                          page === p
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
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[#e2e8f0] dark:border-[#1f2a3d] text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-64" />
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-16 border-b border-[#e2e8f0] dark:border-[#1f2a3d] px-6 flex items-center gap-4">
            <div className="skeleton w-9 h-9 rounded-full" />
            <div className="space-y-2 flex-1">
              <div className="skeleton h-4 w-48" />
              <div className="skeleton h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}