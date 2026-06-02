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
import type { Employee } from "../types";

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
            : a.company?.department ?? "";
        const valB =
          sortBy === "name"
            ? `${b.firstName} ${b.lastName}`
            : b.company?.department ?? "";
        return sortDir === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
  }, [employees, debouncedSearch, dept, sortBy, sortDir]);

  const { page, setPage, totalPages, paginated, reset } = usePagination(
    filtered,
    ITEMS_PER_PAGE
  );

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
      reset();
    },
    [reset]
  );

  const toggleSort = useCallback(
    (field: "name" | "dept") => {
      if (sortBy === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortBy(field);
        setSortDir("asc");
      }
    },
    [sortBy]
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
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#171c27",
            color: "#e2e8f0",
            border: "1px solid #232a3a",
            fontSize: "13px",
          },
        }}
      />
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
              <button
                onClick={() => navigate("/employees/add")}
                className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={15} /> Add Employee
              </button>
            ) : undefined
          }
        />

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={handleSearch}
              className="w-full bg-surface-card border border-surface-border rounded-lg pl-9 pr-4 py-2.5
                text-sm text-white placeholder-slate-600 outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <Dropdown
            options={deptOptions}
            value={dept}
            onChange={(val) => {
              setDept(val);
              reset();
            }}
            className="min-w-[160px]"
          />
        </div>

        {/* Desktop table */}
        <div className="hidden md:block bg-surface-card border border-surface-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <TableHeader
              sortBy={sortBy}
              sortDir={sortDir}
              onSort={toggleSort}
            />

            <tbody className="divide-y divide-surface-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 text-sm">
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
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={e.image}
                        alt={e.firstName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 text-white font-medium">
                      {e.firstName} {e.lastName}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="blue">{e.company?.department}</Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">
                      {e.email}
                    </td>
                    <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">
                      {e.company?.title}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => navigate(`/employees/${e.id}`)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                        {user?.role === "manager" && (
                          <>
                            <button
                              onClick={() => navigate(`/employees/${e.id}/edit`)}
                              className="text-brand-500 hover:text-brand-600 transition-colors"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(e.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 size={14} />
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

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {paginated.length === 0 ? (
            <p className="text-center py-10 text-slate-500 text-sm">
              No employees found.
            </p>
          ) : (
            paginated.map((e, i) => (
              <MobileCard
                key={e.id}
                employee={e}
                index={i}
                isManager={user?.role === "manager"}
                onView={() => navigate(`/employees/${e.id}`)}
                onEdit={() => navigate(`/employees/${e.id}/edit`)}
                onDelete={() => handleDeleteClick(e.id)}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs rounded-lg border border-surface-border text-slate-400
                  hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - page) <= 1
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
                      className="px-2 py-1.5 text-xs text-slate-500"
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
                          : "border-surface-border text-slate-400 hover:text-white"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-xs rounded-lg border border-surface-border text-slate-400
                  hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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

/* ==================== Table Header Component ==================== */

interface TableHeaderProps {
  sortBy: "name" | "dept";
  sortDir: "asc" | "desc";
  onSort: (field: "name" | "dept") => void;
}

function TableHeader({ sortBy, sortDir, onSort }: TableHeaderProps) {
  const SortIcon = ({ field }: { field: "name" | "dept" }) => {
    if (sortBy !== field) return <ChevronUp size={12} className="opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp size={12} />
    ) : (
      <ChevronDown size={12} />
    );
  };

  return (
    <thead>
      <tr className="border-b border-surface-border">
        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 w-12"></th>
        <th
          className="text-left px-4 py-3 text-xs font-medium text-slate-400 cursor-pointer select-none hover:text-white"
          onClick={() => onSort("name")}
        >
          <span className="flex items-center gap-1">
            Name <SortIcon field="name" />
          </span>
        </th>
        <th
          className="text-left px-4 py-3 text-xs font-medium text-slate-400 cursor-pointer select-none hover:text-white"
          onClick={() => onSort("dept")}
        >
          <span className="flex items-center gap-1">
            Department <SortIcon field="dept" />
          </span>
        </th>
        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 hidden lg:table-cell">
          Email
        </th>
        <th className="text-left px-4 py-3 text-xs font-medium text-slate-400 hidden lg:table-cell">
          Title
        </th>
        <th className="text-right px-4 py-3 text-xs font-medium text-slate-400">
          Actions
        </th>
      </tr>
    </thead>
  );
}

/* ==================== Mobile Card ==================== */

interface MobileCardProps {
  employee: Employee;
  index: number;
  isManager: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function MobileCard({
  employee: e,
  index,
  isManager,
  onView,
  onEdit,
  onDelete,
}: MobileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-surface-card border border-surface-border rounded-xl p-4 flex items-center gap-4"
    >
      <img
        src={e.image}
        alt={e.firstName}
        className="w-10 h-10 rounded-full object-cover shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">
          {e.firstName} {e.lastName}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{e.company?.title}</p>
        <div className="mt-1.5">
          <Badge variant="blue">{e.company?.department}</Badge>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <button
          onClick={onView}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <Eye size={14} />
        </button>
        {isManager && (
          <>
            <button
              onClick={onEdit}
              className="text-brand-500 hover:text-brand-600 transition-colors"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={onDelete}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ==================== Skeleton ==================== */

function TableSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="h-8 w-40 bg-surface-card rounded" />
      <div className="h-10 bg-surface-card rounded-lg border border-surface-border" />
      <div className="bg-surface-card border border-surface-border rounded-xl overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-14 border-b border-surface-border px-4 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-surface-border" />
            <div className="h-4 w-32 bg-surface-border rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}