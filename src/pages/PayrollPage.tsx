import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { Eye, DollarSign, TrendingUp } from "lucide-react";

interface PayrollRecord {
  name: string;
  department: string;
  salary: number;
  status: "Paid" | "Pending" | "Failed";
  baseSalary: number;
  overtime: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  paymentMethod: string;
  lastPaid: string;
}

const mockPayroll: PayrollRecord[] = [
  {
    name: "Khubaib Ahmed",
    department: "Engineering",
    salary: 125000,
    status: "Paid",
    baseSalary: 110000,
    overtime: 10000,
    bonuses: 8000,
    deductions: 3000,
    netSalary: 125000,
    paymentMethod: "Bank",
    lastPaid: "2025-06-01",
  },
  {
    name: "Katona Beatrix",
    department: "HR",
    salary: 98000,
    status: "Paid",
    baseSalary: 90000,
    overtime: 5000,
    bonuses: 5000,
    deductions: 2000,
    netSalary: 98000,
    paymentMethod: "Bank",
    lastPaid: "2025-06-01",
  },
  {
    name: "Török Melinda",
    department: "Marketing",
    salary: 87000,
    status: "Pending",
    baseSalary: 80000,
    overtime: 4000,
    bonuses: 5000,
    deductions: 2000,
    netSalary: 87000,
    paymentMethod: "Cash",
    lastPaid: "2025-05-01",
  },
  {
    name: "Sipos Veronika",
    department: "Finance",
    salary: 110000,
    status: "Paid",
    baseSalary: 100000,
    overtime: 7000,
    bonuses: 6000,
    deductions: 3000,
    netSalary: 110000,
    paymentMethod: "Cheque",
    lastPaid: "2025-06-01",
  },
];

export default function PayrollPage() {
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const total = mockPayroll.reduce((sum, item) => sum + item.salary, 0);
  const paidCount = mockPayroll.filter(p => p.status === "Paid").length;
  const pendingCount = mockPayroll.filter(p => p.status === "Pending").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300";
      case "Pending":
        return "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300";
      default:
        return "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300";
    }
  };

  return (
    <>
      <div className="space-y-6">
        <PageHeader
          title="Payroll"
          description="Manage employee salaries and payment records"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Payroll" },
          ]}
        />

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide">
                Total Payroll
              </p>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600">
                <DollarSign size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-(--text-primary)">
              ${(total / 1000).toFixed(0)}K
            </p>
            <p className="text-[11px] text-(--text-muted) mt-2">Monthly total for {mockPayroll.length} employees</p>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide">
                Paid This Month
              </p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <TrendingUp size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-emerald-600">{paidCount}</p>
            <p className="text-[11px] text-(--text-muted) mt-2">{Math.round((paidCount / mockPayroll.length) * 100)}% of workforce</p>
          </div>

          <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide">
                Pending
              </p>
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600">
                <Eye size={18} />
              </div>
            </div>
            <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
            <p className="text-[11px] text-(--text-muted) mt-2">Awaiting payment processing</p>
          </div>
        </div>

        {/* Payroll Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockPayroll.map((record) => (
            <div
              key={record.name}
              className="bg-white dark:bg-[#111827] border border-(--border) rounded-2xl p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-(--text-primary)">
                    {record.name}
                  </h3>
                  <p className="text-xs text-(--text-muted) mt-1">{record.department}</p>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusColor(
                    record.status
                  )}`}
                >
                  {record.status}
                </span>
              </div>

              <div className="space-y-3 mb-4 pb-4 border-b border-(--border)">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-(--text-muted)">Net Salary</span>
                  <span className="text-lg font-bold text-(--text-primary)">
                    ${record.netSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-(--text-muted)">Payment Method</span>
                  <span className="text-(--text-primary) font-medium">
                    {record.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-(--text-muted)">Last Paid</span>
                  <span className="text-(--text-primary) font-medium">
                    {new Date(record.lastPaid).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPayroll(record)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/30 transition-colors text-sm font-medium"
              >
                <Eye size={14} />
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Payroll Details Modal */}
      <Modal
        isOpen={!!selectedPayroll}
        onClose={() => setSelectedPayroll(null)}
        title={selectedPayroll?.name ? `Payroll Details - ${selectedPayroll.name}` : "Payroll Details"}
        size="md"
        footer={
          <Button onClick={() => setSelectedPayroll(null)} className="w-full">
            Close
          </Button>
        }
      >
        {selectedPayroll && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-[#0f172a] rounded-lg p-3">
                <p className="text-xs text-(--text-muted) mb-1">Department</p>
                <p className="text-sm font-semibold text-(--text-primary)">
                  {selectedPayroll.department}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-[#0f172a] rounded-lg p-3">
                <p className="text-xs text-(--text-muted) mb-1">Status</p>
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                    selectedPayroll.status
                  )}`}
                >
                  {selectedPayroll.status}
                </span>
              </div>
            </div>

            <div className="border-t border-(--border) pt-4">
              <h4 className="text-xs font-semibold text-(--text-muted) uppercase tracking-wide mb-3">
                Salary Breakdown
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-(--text-secondary)">Base Salary</span>
                  <span className="font-medium text-(--text-primary)">
                    ${selectedPayroll.baseSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-(--text-secondary)">Overtime</span>
                  <span className="font-medium text-emerald-600">
                    +${selectedPayroll.overtime.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-(--text-secondary)">Bonuses</span>
                  <span className="font-medium text-emerald-600">
                    +${selectedPayroll.bonuses.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-(--text-secondary)">Deductions</span>
                  <span className="font-medium text-red-600">
                    -${selectedPayroll.deductions.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-xs text-(--text-muted) mb-1">Net Salary</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ${selectedPayroll.netSalary.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-gray-50 dark:bg-[#0f172a] rounded-lg p-3">
                <p className="text-xs text-(--text-muted) mb-1">Payment Method</p>
                <p className="text-sm font-semibold text-(--text-primary)">
                  {selectedPayroll.paymentMethod}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-[#0f172a] rounded-lg p-3">
                <p className="text-xs text-(--text-muted) mb-1">Last Paid</p>
                <p className="text-sm font-semibold text-(--text-primary)">
                  {new Date(selectedPayroll.lastPaid).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
