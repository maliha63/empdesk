import { useState } from "react";
import { useLeave } from "../hooks/useLeave";
import { useAuth } from "../hooks/useAuth";
import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/Badge";
import Button from "../components/Button";
import { DatePicker } from "../components/DatePicker";
import toast, { Toaster } from "react-hot-toast";

export default function LeavePage() {
  const { requests, applyLeave, approveLeave, rejectLeave } = useLeave();
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    reason: "",
    from: "",
    to: "",
  });

  const myLeaves = requests.filter(r => r.employeeId === user?.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason || !formData.from || !formData.to) {
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
    setShowForm(false);
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
              <Button onClick={() => setShowForm(true)}>
                + Apply Leave
              </Button>
            )
          }
        />

        {/* Apply Leave Form - Bigger & Better */}
        {showForm && (
          <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl p-8 max-w-lg">
            <h3 className="text-lg font-semibold mb-6">New Leave Request</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Reason</label>
                <input
                  type="text"
                  placeholder="Medical leave, vacation, etc."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl px-4 py-3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">From</label>
                  <DatePicker
                    value={formData.from}
                    onChange={(val) => setFormData({ ...formData, from: val })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">To</label>
                  <DatePicker
                    value={formData.to}
                    onChange={(val) => setFormData({ ...formData, to: val })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="danger" onClick={() => setShowForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">Submit Request</Button>
              </div>
            </form>
          </div>
        )}

        {/* Leave Requests Table */}
        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50 dark:bg-[#0f172a]">
                <th className="text-left pl-8 py-4">EMPLOYEE</th>
                <th className="text-left py-4">REASON</th>
                <th className="text-left py-4">FROM - TO</th>
                <th className="text-center py-4">STATUS</th>
                {isManager && <th className="text-right pr-8 py-4">ACTIONS</th>}
              </tr>
            </thead>
            <tbody className="divide-y">
              {(isManager ? requests : myLeaves).map((req) => (
                <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                  <td className="pl-8 py-5">{req.name}</td>
                  <td className="py-5">{req.reason}</td>
                  <td className="py-5 font-mono text-sm">{req.from} — {req.to}</td>
                  <td className="py-5 text-center">
                    <Badge variant={req.status === "approved" ? "green" : req.status === "rejected" ? "red" : "amber"}>
                      {req.status}
                    </Badge>
                  </td>
                  {isManager && req.status === "pending" && (
                    <td className="pr-8 py-5 text-right space-x-3">
                      <button onClick={() => approveLeave(req.id)} className="text-emerald-600 hover:underline">Approve</button>
                      <button onClick={() => rejectLeave(req.id)} className="text-red-600 hover:underline">Reject</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}