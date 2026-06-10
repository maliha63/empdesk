import { useState, useMemo } from "react";
import { useEmployees } from "../hooks/useEmployees";
import { PageHeader } from "../components/PageHeader";
import Pagination from "../components/Pagination";
import SearchBox from "../components/SearchBox";
import { useTableState } from "../hooks/useTableState";
import { Badge } from "../components/Badge";
import CustomSelect from "../components/CustomSelect";
import { Toaster } from "react-hot-toast";

type ReportType = "payroll" | "team" | "leave" | "contact" | "email" | "security" | "workfromhome";

export default function ReportsPage() {
  const { employees } = useEmployees();
  const [activeReport, setActiveReport] = useState<ReportType>("payroll");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Payroll Report Data
  const payrollData = useMemo(() => {
    return employees.map((emp, idx) => ({
      id: emp.id || idx,
      empId: (emp.id || idx).toString(),
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.company?.department || "N/A",
      designation: emp.company?.title || "N/A",
      salary: Math.floor(Math.random() * 200000) + 30000,
      status: Math.random() > 0.2 ? "Paid" : "Pending",
      lastPaid: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      paymentMethod: ["Bank", "Check", "Cash"][Math.floor(Math.random() * 3)],
    }));
  }, [employees]);

  // Team Report Data
  const teamData = useMemo(() => {
    return employees.map((emp) => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.company?.department || "N/A",
      designation: emp.company?.title || "N/A",
      email: emp.email,
      joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: "Active" as const,
    }));
  }, [employees]);

  // Leave Report Data
  const leaveData = useMemo(() => {
    return employees.map((emp) => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.company?.department || "N/A",
      leaveTaken: Math.floor(Math.random() * 15),
      leaveBalance: Math.floor(Math.random() * 10),
      leaveType: ["Medical", "Annual", "Casual"][Math.floor(Math.random() * 3)],
      status: Math.random() > 0.7 ? "On Leave" : "Present",
    }));
  }, [employees]);

  // Contact Report Data
  const contactData = useMemo(() => {
    return employees.map((emp) => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      email: emp.email,
      phone: emp.phone || "+1 (555) 000-0000",
      department: emp.company?.department || "N/A",
      city: ["New York", "London", "Tokyo"][Math.floor(Math.random() * 3)],
    }));
  }, [employees]);

  // Work From Home Report Data
  const wfhData = useMemo(() => {
    return employees.map((emp) => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.company?.department || "N/A",
      daysAllowed: 2,
      daysTaken: Math.floor(Math.random() * 3),
      lastWFH: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      status: Math.random() > 0.5 ? "Approved" : "Pending",
    }));
  }, [employees]);

  // Email Report Data
  const emailData = useMemo(() => {
    return employees.map((emp) => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      email: emp.email,
      department: emp.company?.department || "N/A",
      emailsSent: Math.floor(Math.random() * 500),
      emailsReceived: Math.floor(Math.random() * 800),
      lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    }));
  }, [employees]);

  // Security Report Data
  const securityData = useMemo(() => {
    return employees.map((emp) => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      department: emp.company?.department || "N/A",
      lastLogin: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toLocaleDateString(),
      accessLevel: ["Basic", "Advanced", "Admin"][Math.floor(Math.random() * 3)],
      mfaEnabled: Math.random() > 0.3,
      status: "Active",
    }));
  }, [employees]);

  const payrollTableState = useTableState(payrollData, rowsPerPage, ["name", "department", "empId"]);
  const teamTableState = useTableState(teamData, rowsPerPage, ["name", "department", "email"]);
  const leaveTableState = useTableState(leaveData, rowsPerPage, ["name", "department"]);
  const contactTableState = useTableState(contactData, rowsPerPage, ["name", "email", "department"]);
  const wfhTableState = useTableState(wfhData, rowsPerPage, ["name", "department"]);
  const emailTableState = useTableState(emailData, rowsPerPage, ["name", "email", "department"]);
  const securityTableState = useTableState(securityData, rowsPerPage, ["name", "department"]);

  const renderPayrollReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4">
          <p className="text-xs text-(--text-muted) mb-1">Total Payroll</p>
          <p className="text-2xl font-bold text-(--text-primary)">
            ${payrollData.reduce((sum, p) => sum + p.salary, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4">
          <p className="text-xs text-(--text-muted) mb-1">Paid</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {payrollData.filter(p => p.status === "Paid").length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4">
          <p className="text-xs text-(--text-muted) mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {payrollData.filter(p => p.status === "Pending").length}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 flex items-center gap-4 flex-wrap">
        <SearchBox
          value={payrollTableState.searchTerm}
          onChange={payrollTableState.setSearchTerm}
          placeholder="Search employee..."
        />
        <CustomSelect
          value={rowsPerPage}
          onChange={(value) => {
            setRowsPerPage(Number(value));
            payrollTableState.setCurrentPage(1);
          }}
          options={[
            { value: 5, label: "5 rows" },
            { value: 10, label: "10 rows" },
            { value: 20, label: "20 rows" },
            { value: 50, label: "50 rows" },
          ]}
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d] bg-gray-50 dark:bg-[#0f172a]">
              <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">S.L</th>
              <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Emp ID</th>
              <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Name</th>
              <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Department</th>
              <th className="text-right px-6 py-4 font-semibold text-(--text-muted)">Salary</th>
              <th className="text-center px-6 py-4 font-semibold text-(--text-muted)">Status</th>
              <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Payment Method</th>
              <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Last Paid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
            {payrollTableState.paginatedData.map((row, idx) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                <td className="px-6 py-4 text-(--text-muted)">
                  {(payrollTableState.currentPage - 1) * rowsPerPage + idx + 1}
                </td>
                <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">{row.empId}</td>
                <td className="px-6 py-4 font-medium text-(--text-primary)">{row.name}</td>
                <td className="px-6 py-4 text-(--text-muted)">{row.department}</td>
                <td className="px-6 py-4 text-right font-semibold text-(--text-primary)">
                  ${row.salary.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center">
                  <Badge variant={row.status === "Paid" ? "green" : "amber"}>
                    {row.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-(--text-muted)">{row.paymentMethod}</td>
                <td className="px-6 py-4 text-(--text-muted) text-xs">{row.lastPaid}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={payrollTableState.currentPage}
        totalPages={Math.ceil(payrollTableState.filteredData.length / rowsPerPage)}
        totalItems={payrollTableState.filteredData.length}
        itemsPerPage={rowsPerPage}
        onPageChange={payrollTableState.setCurrentPage}
      />
    </div>
  );

  const renderTeamReport = () => (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4">
          <p className="text-xs text-(--text-muted) mb-1">Total Employees</p>
          <p className="text-2xl font-bold text-(--text-primary)">{teamData.length}</p>
        </div>
        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4">
          <p className="text-xs text-(--text-muted) mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {teamData.filter(t => t.status === "Active").length}
          </p>
        </div>
        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4">
          <p className="text-xs text-(--text-muted) mb-1">Departments</p>
          <p className="text-2xl font-bold text-(--text-primary)">
            {new Set(teamData.map(t => t.department)).size}
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 flex items-center gap-4 flex-wrap">
        <SearchBox
          value={teamTableState.searchTerm}
          onChange={teamTableState.setSearchTerm}
          placeholder="Search employee..."
        />
        <select
          value={rowsPerPage}
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            teamTableState.setCurrentPage(1);
          }}
          className="px-3 py-2 text-sm border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-lg bg-white dark:bg-[#111827] text-(--text-primary)"
        >
          <option value="5">5 rows</option>
          <option value="10">10 rows</option>
          <option value="20">20 rows</option>
          <option value="50">50 rows</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d] bg-gray-50 dark:bg-[#0f172a]">
              <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">S.L</th>
              <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Name</th>
              <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Department</th>
              <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Designation</th>
              <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Email</th>
              <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Join Date</th>
              <th className="text-center px-6 py-4 font-semibold text-(--text-muted)">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
            {teamTableState.paginatedData.map((row, idx) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                <td className="px-6 py-4 text-(--text-muted)">
                  {(teamTableState.currentPage - 1) * rowsPerPage + idx + 1}
                </td>
                <td className="px-6 py-4 font-medium text-(--text-primary)">{row.name}</td>
                <td className="px-6 py-4 text-(--text-muted)">{row.department}</td>
                <td className="px-6 py-4 text-(--text-muted) text-xs">{row.designation}</td>
                <td className="px-6 py-4 text-blue-600 dark:text-blue-400 text-xs">{row.email}</td>
                <td className="px-6 py-4 text-(--text-muted) text-xs">{row.joinDate}</td>
                <td className="px-6 py-4 text-center">
                  <Badge variant="green">{row.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={teamTableState.currentPage}
        totalPages={Math.ceil(teamTableState.filteredData.length / rowsPerPage)}
        totalItems={teamTableState.filteredData.length}
        itemsPerPage={rowsPerPage}
        onPageChange={teamTableState.setCurrentPage}
      />
    </div>
  );

  const renderLeaveReport = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 flex items-center gap-4 flex-wrap">
        <SearchBox value={leaveTableState.searchTerm} onChange={leaveTableState.setSearchTerm} placeholder="Search employee..." />
        <CustomSelect value={rowsPerPage} onChange={(v) => { setRowsPerPage(Number(v)); leaveTableState.setCurrentPage(1); }} options={[{ value: 5, label: "5 rows" }, { value: 10, label: "10 rows" }, { value: 20, label: "20 rows" }]} />
      </div>
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d] bg-gray-50 dark:bg-[#0f172a]">
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Name</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Department</th>
            <th className="text-center px-6 py-4 font-semibold text-(--text-muted)">Taken</th>
            <th className="text-center px-6 py-4 font-semibold text-(--text-muted)">Balance</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Type</th>
            <th className="text-center px-6 py-4 font-semibold text-(--text-muted)">Status</th>
          </tr></thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
            {leaveTableState.paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                <td className="px-6 py-4 font-medium text-(--text-primary)">{row.name}</td>
                <td className="px-6 py-4 text-(--text-muted)">{row.department}</td>
                <td className="px-6 py-4 text-center font-medium">{row.leaveTaken}</td>
                <td className="px-6 py-4 text-center font-medium text-green-600">{row.leaveBalance}</td>
                <td className="px-6 py-4 text-(--text-muted)">{row.leaveType}</td>
                <td className="px-6 py-4 text-center"><Badge variant={row.status === "On Leave" ? "amber" : "green"}>{row.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={leaveTableState.currentPage} totalPages={Math.ceil(leaveTableState.filteredData.length / rowsPerPage)} totalItems={leaveTableState.filteredData.length} itemsPerPage={rowsPerPage} onPageChange={leaveTableState.setCurrentPage} />
    </div>
  );

  const renderContactReport = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 flex items-center gap-4 flex-wrap">
        <SearchBox value={contactTableState.searchTerm} onChange={contactTableState.setSearchTerm} placeholder="Search employee..." />
        <CustomSelect value={rowsPerPage} onChange={(v) => { setRowsPerPage(Number(v)); contactTableState.setCurrentPage(1); }} options={[{ value: 5, label: "5 rows" }, { value: 10, label: "10 rows" }, { value: 20, label: "20 rows" }]} />
      </div>
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d] bg-gray-50 dark:bg-[#0f172a]">
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Name</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Email</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Phone</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Department</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">City</th>
          </tr></thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
            {contactTableState.paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                <td className="px-6 py-4 font-medium text-(--text-primary)">{row.name}</td>
                <td className="px-6 py-4 text-blue-600 dark:text-blue-400 text-xs">{row.email}</td>
                <td className="px-6 py-4 text-(--text-muted) text-xs">{row.phone}</td>
                <td className="px-6 py-4 text-(--text-muted)">{row.department}</td>
                <td className="px-6 py-4 text-(--text-muted)">{row.city}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={contactTableState.currentPage} totalPages={Math.ceil(contactTableState.filteredData.length / rowsPerPage)} totalItems={contactTableState.filteredData.length} itemsPerPage={rowsPerPage} onPageChange={contactTableState.setCurrentPage} />
    </div>
  );

  const renderWFHReport = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 flex items-center gap-4 flex-wrap">
        <SearchBox value={wfhTableState.searchTerm} onChange={wfhTableState.setSearchTerm} placeholder="Search employee..." />
        <CustomSelect value={rowsPerPage} onChange={(v) => { setRowsPerPage(Number(v)); wfhTableState.setCurrentPage(1); }} options={[{ value: 5, label: "5 rows" }, { value: 10, label: "10 rows" }, { value: 20, label: "20 rows" }]} />
      </div>
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d] bg-gray-50 dark:bg-[#0f172a]">
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Name</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Department</th>
            <th className="text-center px-6 py-4 font-semibold text-(--text-muted)">Allowed</th>
            <th className="text-center px-6 py-4 font-semibold text-(--text-muted)">Taken</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Last WFH</th>
            <th className="text-center px-6 py-4 font-semibold text-(--text-muted)">Status</th>
          </tr></thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
            {wfhTableState.paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                <td className="px-6 py-4 font-medium text-(--text-primary)">{row.name}</td>
                <td className="px-6 py-4 text-(--text-muted)">{row.department}</td>
                <td className="px-6 py-4 text-center font-medium">{row.daysAllowed}</td>
                <td className="px-6 py-4 text-center font-medium">{row.daysTaken}</td>
                <td className="px-6 py-4 text-(--text-muted)">{row.lastWFH}</td>
                <td className="px-6 py-4 text-center"><Badge variant={row.status === "Approved" ? "green" : "amber"}>{row.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={wfhTableState.currentPage} totalPages={Math.ceil(wfhTableState.filteredData.length / rowsPerPage)} totalItems={wfhTableState.filteredData.length} itemsPerPage={rowsPerPage} onPageChange={wfhTableState.setCurrentPage} />
    </div>
  );

  const renderEmailReport = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 flex items-center gap-4 flex-wrap">
        <SearchBox value={emailTableState.searchTerm} onChange={emailTableState.setSearchTerm} placeholder="Search employee..." />
        <CustomSelect value={rowsPerPage} onChange={(v) => { setRowsPerPage(Number(v)); emailTableState.setCurrentPage(1); }} options={[{ value: 5, label: "5 rows" }, { value: 10, label: "10 rows" }, { value: 20, label: "20 rows" }]} />
      </div>
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d] bg-gray-50 dark:bg-[#0f172a]">
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Name</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Email</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Department</th>
            <th className="text-center px-6 py-4 font-semibold text-(--text-muted)">Sent</th>
            <th className="text-center px-6 py-4 font-semibold text-(--text-muted)">Received</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Last Active</th>
          </tr></thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
            {emailTableState.paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                <td className="px-6 py-4 font-medium text-(--text-primary)">{row.name}</td>
                <td className="px-6 py-4 text-blue-600 dark:text-blue-400 text-xs">{row.email}</td>
                <td className="px-6 py-4 text-(--text-muted)">{row.department}</td>
                <td className="px-6 py-4 text-center font-medium">{row.emailsSent}</td>
                <td className="px-6 py-4 text-center font-medium">{row.emailsReceived}</td>
                <td className="px-6 py-4 text-(--text-muted) text-xs">{row.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={emailTableState.currentPage} totalPages={Math.ceil(emailTableState.filteredData.length / rowsPerPage)} totalItems={emailTableState.filteredData.length} itemsPerPage={rowsPerPage} onPageChange={emailTableState.setCurrentPage} />
    </div>
  );

  const renderSecurityReport = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl p-4 flex items-center gap-4 flex-wrap">
        <SearchBox value={securityTableState.searchTerm} onChange={securityTableState.setSearchTerm} placeholder="Search employee..." />
        <CustomSelect value={rowsPerPage} onChange={(v) => { setRowsPerPage(Number(v)); securityTableState.setCurrentPage(1); }} options={[{ value: 5, label: "5 rows" }, { value: 10, label: "10 rows" }, { value: 20, label: "20 rows" }]} />
      </div>
      <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-[#e2e8f0] dark:border-[#1f2a3d] bg-gray-50 dark:bg-[#0f172a]">
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Name</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Department</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Last Login</th>
            <th className="text-left px-6 py-4 font-semibold text-(--text-muted)">Access Level</th>
            <th className="text-center px-6 py-4 font-semibold text-(--text-muted)">MFA</th>
            <th className="text-center px-6 py-4 font-semibold text-(--text-muted)">Status</th>
          </tr></thead>
          <tbody className="divide-y divide-[#e2e8f0] dark:divide-[#1f2a3d]">
            {securityTableState.paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#0f172a]">
                <td className="px-6 py-4 font-medium text-(--text-primary)">{row.name}</td>
                <td className="px-6 py-4 text-(--text-muted)">{row.department}</td>
                <td className="px-6 py-4 text-(--text-muted) text-xs">{row.lastLogin}</td>
                <td className="px-6 py-4 text-(--text-muted) capitalize">{row.accessLevel}</td>
                <td className="px-6 py-4 text-center"><Badge variant={row.mfaEnabled ? "green" : "amber"}>{row.mfaEnabled ? "Enabled" : "Disabled"}</Badge></td>
                <td className="px-6 py-4 text-center"><Badge variant="green">{row.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={securityTableState.currentPage} totalPages={Math.ceil(securityTableState.filteredData.length / rowsPerPage)} totalItems={securityTableState.filteredData.length} itemsPerPage={rowsPerPage} onPageChange={securityTableState.setCurrentPage} />
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        <PageHeader
          title="Reports"
          description="Comprehensive reports and analytics"
          crumbs={[
            { label: "Dashboard", to: "/dashboard" },
            { label: "Reports" },
          ]}
        />

        {/* Report Type Tabs */}
        <div className="bg-white dark:bg-[#111827] border border-[#e2e8f0] dark:border-[#1f2a3d] rounded-xl overflow-x-auto">
          <div className="flex items-center">
            {[
              { id: "payroll", label: "Payroll Report" },
              { id: "team", label: "Team Report" },
              { id: "leave", label: "Leave Report" },
              { id: "contact", label: "Contact Report" },
              { id: "email", label: "Email Report" },
              { id: "security", label: "Security Report" },
              { id: "workfromhome", label: "Work From Home Report" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveReport(tab.id as ReportType)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeReport === tab.id
                    ? "border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20"
                    : "border-transparent text-(--text-muted) hover:text-(--text-primary)"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        <div>
          {activeReport === "payroll" && renderPayrollReport()}
          {activeReport === "team" && renderTeamReport()}
          {activeReport === "leave" && renderLeaveReport()}
          {activeReport === "contact" && renderContactReport()}
          {activeReport === "email" && renderEmailReport()}
          {activeReport === "security" && renderSecurityReport()}
          {activeReport === "workfromhome" && renderWFHReport()}
        </div>
      </div>
    </>
  );
}
