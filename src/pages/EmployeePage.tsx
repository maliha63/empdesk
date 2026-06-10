import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import toast, { Toaster } from "react-hot-toast";
import { fetchEmployeeById } from "../services/employeeService";
import { getMockAttendance, getMockPerformance } from "../utils/mockData";
import { useAuth } from "../hooks/useAuth";
import { useEmployees } from "../hooks/useEmployees";
import { Badge } from "../components/Badge";
import { PageHeader } from "../components/PageHeader";
import { Dropdown } from "../components/Dropdown";
import type {
  Employee,
  AttendanceRecord,
  PerformanceRecord,
  UploadedDocument,
  AttendanceStatus,
} from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Upload,
  X,
  FileText,
  Image,
  File,
  Download,
  Pencil,
} from "lucide-react";
import Button from "../components/Button";

const ATTENDANCE_OPTIONS = [
  { label: "Present", value: "Present" },
  { label: "Absent", value: "Absent" },
  { label: "Late", value: "Late" },
  { label: "Leave", value: "Leave" },
];

export default function EmployeePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employees, addDocument } = useEmployees();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "attendance" | "documents" | "performance"
  >("attendance");
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [previewDoc, setPreviewDoc] = useState<UploadedDocument | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    fetchEmployeeById(Number(id))
      .then((data) => {
        const ctx = employees.find((e) => e.id === data.id);
        setEmployee({ ...data, documents: ctx?.documents ?? [] });
        setAttendance(getMockAttendance(data.id));
      })
      .catch((e) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [id, employees]);

  useEffect(() => {
    if (!employee) return;
    const ctx = employees.find((e) => e.id === employee.id);
    if (ctx)
      setEmployee((prev) =>
        prev ? { ...prev, documents: ctx.documents ?? [] } : prev,
      );
  }, [employees]);

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !employee) return;
      const reader = new FileReader();
      reader.onload = () => {
        const doc: UploadedDocument = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type.includes("pdf")
            ? "PDF"
            : file.type.includes("image")
              ? "IMG"
              : "FILE",
          size: `${(file.size / 1024).toFixed(0)} KB`,
          uploadedAt: new Date().toISOString().split("T")[0],
          dataUrl: reader.result as string,
        };
        addDocument(employee.id, doc);
        toast.success(`${file.name} uploaded.`);
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [employee, addDocument],
  );

  function handleAttendanceEdit(date: string, status: AttendanceStatus) {
    if (user?.role !== "manager") return;
    setAttendance((prev) =>
      prev.map((a) => (a.date === date ? { ...a, status } : a)),
    );
    toast.success("Attendance updated.");
  }

  if (isLoading) return <DetailSkeleton />;
  if (error || !employee)
    return (
      <div className="text-center py-20 text-gray-400 dark:text-[#4b5e7a]">
        <p className="text-4xl mb-3">⚠</p>
        <p>{error ?? "Employee not found."}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-brand-500 text-sm hover:underline"
        >
          ← Back
        </button>
      </div>
    );

  const performance = getMockPerformance(employee.id);

  const statusColor: Record<string, string> = {
    Present:
      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-400/10",
    Absent:
      "text-red-600    dark:text-red-400    bg-red-50    dark:bg-red-400/10",
    Late: "text-amber-600  dark:text-amber-400  bg-amber-50  dark:bg-amber-400/10",
    Leave:
      "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-400/10",
  };

  const docIcon = (type: string) => {
    if (type === "PDF") return <FileText size={16} />;
    if (type === "IMG") return <Image size={16} />;
    return <File size={16} />;
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#ffffff",
            color: "#0f172a",
            border: "1px solid #e2e8f0",
            fontSize: "13px",
            borderRadius: "12px",
          },
        }}
      />

      {/* Document preview modal */}
      {previewDoc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setPreviewDoc(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e8f0] dark:border-[#1f2a3d]">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {previewDoc.name}
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={previewDoc.dataUrl}
                  download={previewDoc.name}
                  className="text-brand-500 hover:text-brand-600 transition-colors"
                >
                  <Download size={15} />
                </a>
                <button
                  onClick={() => setPreviewDoc(null)}
                  className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
              {previewDoc.dataUrl.startsWith("data:image") ? (
                <img
                  src={previewDoc.dataUrl}
                  alt={previewDoc.name}
                  className="max-w-full max-h-full rounded-lg"
                />
              ) : previewDoc.dataUrl.startsWith("data:application/pdf") ? (
                <iframe
                  src={previewDoc.dataUrl}
                  className="w-full h-[60vh]"
                  title={previewDoc.name}
                />
              ) : (
                <div className="text-center text-gray-400 dark:text-[#4b5e7a] space-y-3">
                  <File size={40} className="mx-auto opacity-40" />
                  <p className="text-sm">Preview not available.</p>
                  <a
                    href={previewDoc.dataUrl}
                    download={previewDoc.name}
                    className="text-brand-500 text-sm hover:underline"
                  >
                    Download file
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      <div className="space-y-6">
        <PageHeader
          title={`${employee.firstName} ${employee.lastName}`}
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Employees", to: "/employees" },
            { label: `${employee.firstName} ${employee.lastName}` },
          ]}
        />

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-6 shadow-[0_1px_3px_rgb(0,0,0,0.06)] dark:shadow-[0_1px_3px_rgb(0,0,0,0.4)]"
        >
          <div className="flex items-start gap-5">
            <img
              src={employee.image}
              alt={employee.firstName}
              className="w-16 h-16 rounded-xl object-cover ring-2 ring-[#e2e8f0] dark:ring-[#1f2a3d]"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {employee.firstName} {employee.lastName}
                  </h1>
                  <p className="text-gray-500 dark:text-[#4b5e7a] text-sm mt-0.5">
                    {employee.company?.title}
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge variant="blue">{employee.company?.department}</Badge>
                    <Badge
                      variant={
                        employee.gender === "female" ? "purple" : "amber"
                      }
                    >
                      {employee.gender}
                    </Badge>
                  </div>
                </div>
                {user?.role === "manager" && (
                  <Button
                    onClick={() => navigate(`/employees/${employee.id}/edit`)}
                    icon={<Pencil size={16} />}
                  >
                    Edit Employee
                  </Button>
                )}
              </div>
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
                {[
                  { label: "Email", value: employee.email },
                  { label: "Phone", value: employee.phone },
                  { label: "Company", value: employee.company?.name },
                  {
                    label: "Location",
                    value: `${employee.address?.city}, ${employee.address?.country}`,
                  },
                  { label: "Age", value: String(employee.age) },
                  { label: "Gender", value: employee.gender },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-[11px] font-medium text-gray-400 dark:text-[#4b5e7a] uppercase tracking-wide">
                      {f.label}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 mt-0.5 truncate text-[13px]">
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-1 w-fit shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
          {(["attendance", "documents", "performance"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-brand-500 text-white shadow-[0_1px_4px_rgb(59_130_246/0.3)]"
                  : "text-gray-500 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Attendance */}
        {activeTab === "attendance" && (
          <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl overflow-hidden shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d]">
                  {["Date", "Status", "Check In", "Check Out"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-medium text-gray-400 dark:text-[#4b5e7a]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
                {attendance.map((a: AttendanceRecord) => (
                  <tr
                    key={a.date}
                    className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-600 dark:text-slate-300 font-mono text-xs">
                      {a.date}
                    </td>
                    <td className="px-4 py-2">
                      {user?.role === "manager" ? (
                        <Dropdown
                          variant="pill"
                          options={ATTENDANCE_OPTIONS}
                          value={a.status}
                          onChange={(val) =>
                            handleAttendanceEdit(
                              a.date,
                              val as AttendanceStatus,
                            )
                          }
                          pillColorClass={statusColor[a.status]}
                        />
                      ) : (
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[a.status]}`}
                        >
                          {a.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-[#4b5e7a] font-mono text-xs">
                      {a.checkIn}
                    </td>
                    <td className="px-4 py-3 text-gray-500 dark:text-[#4b5e7a] font-mono text-xs">
                      {a.checkOut}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Documents */}
        {activeTab === "documents" && (
          <div className="space-y-4">
            {user?.role === "manager" && (
              <label className="flex items-center gap-3 w-fit bg-white dark:bg-[#111827] border border-dashed border-[#e2e8f0] dark:border-[#1f2a3d] hover:border-brand-500 dark:hover:border-brand-500 rounded-xl px-5 py-3 transition-colors group cursor-pointer">
                <Upload
                  size={16}
                  className="text-gray-400 dark:text-[#4b5e7a] group-hover:text-brand-500 transition-colors"
                />
                <span className="text-sm text-gray-500 dark:text-[#4b5e7a] group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  Upload document
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.xlsx"
                  onChange={handleFileUpload}
                />
              </label>
            )}
            {!employee.documents || employee.documents.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-[#4b5e7a] text-sm bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl">
                No documents uploaded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {employee.documents.map((doc: UploadedDocument) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-brand-500/50 transition-colors"
                    onClick={() => setPreviewDoc(doc)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-500">
                      {docIcon(doc.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-[#4b5e7a] mt-0.5">
                        {doc.size} · {doc.uploadedAt}
                      </p>
                    </div>
                    <Download
                      size={14}
                      className="text-gray-400 dark:text-[#4b5e7a] hover:text-gray-900 dark:hover:text-white transition-colors shrink-0"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Performance */}
        {activeTab === "performance" && (
          <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-5 shadow-[0_1px_3px_rgb(0,0,0,0.04)]">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Monthly Performance Score
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={performance} barSize={24}>
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "#fff",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                  }}
                  labelStyle={{ color: "#0f172a" }}
                  itemStyle={{ color: "#64748b" }}
                  cursor={{ fill: "rgba(0,0,0,0.03)" }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {performance.map((p: PerformanceRecord, i: number) => (
                    <Cell
                      key={i}
                      fill={
                        p.score >= 90
                          ? "#10b981"
                          : p.score >= 75
                            ? "#3b82f6"
                            : p.score >= 60
                              ? "#f59e0b"
                              : "#ef4444"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {performance.slice(-4).map((p: PerformanceRecord) => (
                <div
                  key={p.month}
                  className="bg-[#f8fafc] dark:bg-[#0b0f1a] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg p-3"
                >
                  <p className="text-xs text-gray-400 dark:text-[#4b5e7a]">
                    {p.month}
                  </p>
                  <p className="text-lg font-bold font-mono text-gray-900 dark:text-white mt-0.5">
                    {p.score}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-[#4b5e7a]">
                    {p.tasksCompleted} tasks
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-4 w-16 rounded" />
      <div className="skeleton h-40 rounded-xl" />
      <div className="skeleton h-10 w-72 rounded-lg" />
      <div className="skeleton h-64 rounded-xl" />
    </div>
  );
}
