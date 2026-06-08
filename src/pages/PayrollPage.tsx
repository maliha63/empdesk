import { PageHeader } from "../components/PageHeader";
import { Badge } from "../components/Badge";

const mockPayroll = [
  { name: "Khubaib Ahmed", department: "Engineering", salary: 125000, status: "Paid" },
  { name: "Katona Beatrix", department: "HR", salary: 98000, status: "Paid" },
  { name: "Török Melinda", department: "Marketing", salary: 87000, status: "Pending" },
  { name: "Sipos Veronika", department: "Finance", salary: 110000, status: "Paid" },
];

export default function PayrollPage() {
  const total = mockPayroll.reduce((sum, item) => sum + item.salary, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll"
        description={`Total Payroll: $${total.toLocaleString()}`}
        crumbs={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Payroll" },
        ]}
      />

      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50 dark:bg-[#0f172a]">
              <th className="text-left pl-8 py-4">EMPLOYEE</th>
              <th className="text-left py-4">DEPARTMENT</th>
              <th className="text-right py-4">MONTHLY SALARY</th>
              <th className="text-center py-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockPayroll.map((emp, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                <td className="pl-8 py-5 font-medium">{emp.name}</td>
                <td className="py-5">
                  <Badge variant="slate">{emp.department}</Badge>
                </td>
                <td className="py-5 text-right font-mono font-semibold">
                  ${emp.salary.toLocaleString()}
                </td>
                <td className="py-5 text-center">
                  <Badge variant={emp.status === "Paid" ? "green" : "amber"}>
                    {emp.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}