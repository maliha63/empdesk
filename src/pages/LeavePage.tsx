import { useState } from "react";
import { useLeave } from "../hooks/useLeave";
import { useAuth } from "../hooks/useAuth";
import { PageHeader } from "../components/PageHeader";
import Button from "../components/Button";
import Modal from "../components/Modal";
import { DatePicker } from "../components/DatePicker";
import toast, { Toaster } from "react-hot-toast";
import { Calendar, CheckCircle2, Clock } from "lucide-react";

export default function LeavePage() {
  const { requests, applyLeave, approveLeave, rejectLeave } = useLeave();
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    from: "",
    to: "",
  });

  const myLeaves = requests.filter((r) => r.employeeId === user?.id);
  const displayedRequests = isManager ? requests : myLeaves;
  const approvedCount = displayedRequests.filter(
    (r) => r.status === "approved",
  ).length;
  const pendingCount = displayedRequests.filter(
    (r) => r.status === "pending",
  ).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason.trim() || !formData.from || !formData.to) {
      toast.error("Please fill all fields");
      return;
    }

    applyLeave({
      employeeId: user!.id,
      name: `${user!.firstName} ${user!.lastName}`,
      image: user!.image,
      designation: "Employee",
      reason: formData.reason,
      from: formData.from,
      to: formData.to,
    });

    toast.success("Leave request submitted successfully");
    setFormData({ reason: "", from: "", to: "" });
    setShowModal(false);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300";
      case "rejected":
        return "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300";
      default:
        return "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300";
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Leave Management"
          description={
            isManager
              ? "Review and manage leave requests"
              : "Your leave requests"
          }
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Leave" },
          ]}
          action={
            !isManager && (
              <Button onClick={() => setShowModal(true)}>+ Apply Leave</Button>
            )
          }
        />

        {/* Summary Stats */}
        {isManager && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide">
                  Total Requests
                </p>
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Calendar size={18} />
                </div>
              </div>
              <p className="text-3xl font-bold text-(--text-primary)">
                {displayedRequests.length}
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide">
                  Approved
                </p>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-600">
                {approvedCount}
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide">
                  Pending
                </p>
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Clock size={18} />
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-600">
                {pendingCount}
              </p>
            </div>
          </div>
        )}

        {/* Leave Requests Table */}
        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--border) bg-[#f8fafc] dark:bg-[#0f172a]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary) whitespace-nowrap">
                    S.L
                  </th>
                  {isManager && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary)">
                      Name
                    </th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary)">
                    Leave Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-primary)">
                    Date Range
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-(--text-primary)">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-(--text-primary)">
                    Status
                  </th>
                  {isManager && (
                    <th className="px-4 py-3 text-right text-xs font-semibold text-(--text-primary)">
                      Action
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border)">
                {displayedRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={isManager ? 7 : 5}
                      className="px-4 py-12 text-center"
                    >
                      <Calendar
                        size={48}
                        className="text-(--text-muted) mx-auto mb-4 opacity-30"
                      />
                      <p className="text-(--text-primary) font-medium mb-1">
                        No leave requests
                      </p>
                      <p className="text-(--text-muted) text-sm">
                        {isManager
                          ? "No leave requests yet"
                          : "You haven&apos;t applied for leave"}
                      </p>
                    </td>
                  </tr>
                ) : (
                  displayedRequests.map((req, idx) => (
                    <tr
                      key={req.id}
                      className="hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-(--text-primary)">
                        {String(idx + 1).padStart(2, "0")}
                      </td>
                      {isManager && (
                        <td className="px-4 py-3 text-sm font-medium text-(--text-primary)">
                          {req.name}
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm text-(--text-primary)">
                        {req.reason}
                      </td>
                      <td className="px-4 py-3 text-sm text-(--text-secondary)">
                        <div className="flex flex-col gap-1">
                          <span>{req.from}</span>
                          <span className="text-xs text-(--text-muted)">
                            to {req.to}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-(--text-primary) font-medium">
                        {Math.abs(
                          Math.ceil(
                            (new Date(req.to).getTime() -
                              new Date(req.from).getTime()) /
                              (1000 * 60 * 60 * 24),
                          ),
                        ) + 1}{" "}
                        days
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusBadgeColor(req.status)}`}
                        >
                          {req.status.charAt(0).toUpperCase() +
                            req.status.slice(1)}
                        </span>
                      </td>
                      {isManager && (
                        <td className="px-4 py-3 text-right">
                          {req.status === "pending" ? (
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => {
                                  approveLeave(req.id);
                                  toast.success("Leave approved");
                                }}
                                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-950/30 transition-colors"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  rejectLeave(req.id);
                                  toast.success("Leave rejected");
                                }}
                                className="px-3 py-1.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded text-xs font-medium hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors"
                              >
                                Reject
                              </button>
                            </div>
                          ) : req.status === "approved" ? (
                            <button
                              onClick={() => {
                                rejectLeave(req.id);
                                toast.success("Leave rejected");
                              }}
                              className="px-3 py-1.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded text-xs font-medium hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors"
                            >
                              Reject
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                approveLeave(req.id);
                                toast.success("Leave approved");
                              }}
                              className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-950/30 transition-colors"
                            >
                              Approve
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Apply for Leave"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button onClick={(e) => handleSubmit(e as any)}>
              Submit Request
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-(--text-primary) block mb-2">
              Reason for Leave
            </label>
            <input
              type="text"
              placeholder="e.g., Medical Leave, Vacation, Family Emergency"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="w-full border border-(--border) rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-(--text-primary) block mb-2">
                From Date
              </label>
              <DatePicker
                value={formData.from}
                onChange={(val) => setFormData({ ...formData, from: val })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-(--text-primary) block mb-2">
                To Date
              </label>
              <DatePicker
                value={formData.to}
                onChange={(val) => setFormData({ ...formData, to: val })}
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
