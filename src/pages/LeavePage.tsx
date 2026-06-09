import { useState } from "react";
import { useLeave } from "../hooks/useLeave";
import { useAuth } from "../hooks/useAuth";
import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/Badge";
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
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [formData, setFormData] = useState({
    reason: "",
    from: "",
    to: "",
  });

  const myLeaves = requests.filter((r) => r.employeeId === user?.id);
  const displayedRequests = isManager ? requests : myLeaves;
  const approvedCount = displayedRequests.filter((r) => r.status === "approved").length;
  const pendingCount = displayedRequests.filter((r) => r.status === "pending").length;

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 dark:bg-emerald-950/20 border-l-emerald-500";
      case "rejected":
        return "bg-red-50 dark:bg-red-950/20 border-l-red-500";
      default:
        return "bg-amber-50 dark:bg-amber-950/20 border-l-amber-500";
    }
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
          description={isManager ? "Review and manage leave requests" : "Your leave requests"}
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
            <div className="bg-white dark:bg-[#111827] border border-[var(--border)] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                  Total Requests
                </p>
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Calendar size={18} />
                </div>
              </div>
              <p className="text-3xl font-bold text-[var(--text-primary)]">
                {displayedRequests.length}
              </p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-[var(--border)] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                  Approved
                </p>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 size={18} />
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-600">{approvedCount}</p>
            </div>

            <div className="bg-white dark:bg-[#111827] border border-[var(--border)] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide">
                  Pending
                </p>
                <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Clock size={18} />
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
            </div>
          </div>
        )}

        {/* Leave Requests List */}
        {displayedRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-[#111827] border border-[var(--border)] rounded-2xl">
            <Calendar size={48} className="text-[var(--text-muted)] mb-4 opacity-30" />
            <p className="text-[var(--text-primary)] font-medium mb-1">No leave requests</p>
            <p className="text-[var(--text-muted)] text-sm">
              {isManager ? "No leave requests yet" : "You haven&apos;t applied for leave"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedRequests.map((req) => (
              <div
                key={req.id}
                className={`border-l-4 rounded-lg p-5 bg-white dark:bg-[#111827] border border-[var(--border)] hover:shadow-md transition-all ${getStatusColor(req.status)}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                      {isManager ? req.name : "My Leave Request"}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{req.reason}</p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap ${getStatusBadgeColor(req.status)}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 pb-3 border-b border-current border-opacity-20">
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide font-medium mb-1">
                      From
                    </p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{req.from}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide font-medium mb-1">
                      To
                    </p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{req.to}</p>
                  </div>
                </div>

                {isManager && req.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        approveLeave(req.id);
                        toast.success("Leave approved");
                      }}
                      className="flex-1 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950/30 transition-colors text-sm font-medium"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        rejectLeave(req.id);
                        toast.success("Leave rejected");
                      }}
                      className="flex-1 py-2 px-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors text-sm font-medium"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Apply for Leave"
        size="md"
        footer={
          <>
            <Button variant="primary" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={(e) => handleSubmit(e as any)} className="flex-1">
              Submit Request
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
              Reason for Leave
            </label>
            <input
              type="text"
              placeholder="e.g., Medical Leave, Vacation, Family Emergency"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2.5 bg-white dark:bg-[#0f172a] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
                From Date
              </label>
              <DatePicker
                value={formData.from}
                onChange={(val) => setFormData({ ...formData, from: val })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-[var(--text-primary)] block mb-2">
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
