import { useState } from "react";
import { PageHeader } from "../components/PageHeader";
import Modal from "../components/Modal";
import Button from "../components/Button";
import { Badge } from "../components/Badge";
import { Eye, DollarSign, TrendingUp, Clock } from "lucide-react";

interface PayrollRecord {
  id: string;
  name: string;
  department: string;
  designation: string;
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
    id: "EMP1024",
    name: "Khubaib Ahmed",
    department: "Engineering",
    designation: "Senior Software Engineer",
    salary: 125000,
    status: "Paid",
    baseSalary: 110000,
    overtime: 10000,
    bonuses: 8000,
    deductions: 3000,
    netSalary: 125000,
    paymentMethod: "Bank Transfer",
    lastPaid: "2025-06-01",
  },
  {
    id: "EMP1025",
    name: "Katona Beatrix",
    department: "Human Resources",
    designation: "HR Manager",
    salary: 98000,
    status: "Paid",
    baseSalary: 90000,
    overtime: 5000,
    bonuses: 5000,
    deductions: 2000,
    netSalary: 98000,
    paymentMethod: "Bank Transfer",
    lastPaid: "2025-06-01",
  },
  {
    id: "EMP1026",
    name: "Török Melinda",
    department: "Marketing",
    designation: "Marketing Specialist",
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
    id: "EMP1027",
    name: "Sipos Veronika",
    department: "Finance",
    designation: "Finance Manager",
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
  {
    id: "EMP1028",
    name: "James Davis",
    department: "Support",
    designation: "Support Lead",
    salary: 76000,
    status: "Pending",
    baseSalary: 70000,
    overtime: 3000,
    bonuses: 4000,
    deductions: 1000,
    netSalary: 76000,
    paymentMethod: "Bank Transfer",
    lastPaid: "2025-05-01",
  },
  {
    id: "EMP1029",
    name: "Olivia Wilson",
    department: "Product",
    designation: "Product Manager",
    salary: 118000,
    status: "Failed",
    baseSalary: 108000,
    overtime: 6000,
    bonuses: 7000,
    deductions: 3000,
    netSalary: 118000,
    paymentMethod: "Bank Transfer",
    lastPaid: "2025-05-01",
  },
];

export default function PayrollPage() {
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const total = mockPayroll.reduce((sum, item) => sum + item.salary, 0);
  const paidCount = mockPayroll.filter((p) => p.status === "Paid").length;
  const pendingCount = mockPayroll.filter((p) => p.status === "Pending").length;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Paid":
        return "green" as const;
      case "Pending":
        return "amber" as const;
      default:
        return "red" as const;
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
            <p className="text-[11px] text-(--text-muted) mt-2">
              Monthly total for {mockPayroll.length} employees
            </p>
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
            <p className="text-[11px] text-(--text-muted) mt-2">
              {Math.round((paidCount / mockPayroll.length) * 100)}% of workforce
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
            <p className="text-3xl font-bold text-amber-600">{pendingCount}</p>
            <p className="text-[11px] text-(--text-muted) mt-2">Awaiting payment processing</p>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white dark:bg-[#111827] border border-(--border) rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-(--border) bg-[#f8fafc] dark:bg-[#0f172a]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-muted) whitespace-nowrap">S.L</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-muted)">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-muted)">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-muted)">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-muted)">Designation</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-(--text-muted)">Payment Method</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-(--text-muted)">Net Salary</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-(--text-muted)">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-(--text-muted)">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--border)">
                {mockPayroll.map((record, idx) => (
                  <tr
                    key={record.id}
                    className="hover:bg-[#f8fafc] dark:hover:bg-[#0f172a] transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-(--text-muted)">
                      {String(idx + 1).padStart(2, "0")}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-blue-600 dark:text-blue-400">
                      {record.id}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-(--text-primary) whitespace-nowrap">
                      {record.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-(--text-secondary)">
                      {record.department}
                    </td>
                    <td className="px-4 py-3 text-sm text-(--text-secondary) whitespace-nowrap">
                      {record.designation}
                    </td>
                    <td className="px-4 py-3 text-sm text-(--text-secondary)">
                      {record.paymentMethod}
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-(--text-primary) text-right whitespace-nowrap">
                      ${record.netSalary.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={getStatusVariant(record.status)} dot>
                        {record.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedPayroll(record)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-(--border) text-(--text-primary) rounded-lg hover:bg-(--bg-card2) transition-colors whitespace-nowrap"
                      >
                        <Eye size={13} />
                        View Payslip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payroll Details Modal */}
      <Modal
        isOpen={!!selectedPayroll}
        onClose={() => setSelectedPayroll(null)}
        title={selectedPayroll?.name ? `Payslip - ${selectedPayroll.name}` : "Payslip"}
        size="md"
        footer={
          <Button onClick={() => setSelectedPayroll(null)}>Close</Button>
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
                <Badge variant={getStatusVariant(selectedPayroll.status)} dot>
                  {selectedPayroll.status}
                </Badge>
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
