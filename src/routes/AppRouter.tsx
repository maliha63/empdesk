import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleGuard } from "./RoleGuard";
import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ErrorBoundary } from "../components/ErrorBoundary";

// Lazy-loaded pages
const LoginPage = lazy(() => import("../pages/LoginPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const EmployeesPage = lazy(() => import("../pages/EmployeesPage"));
const EmployeePage = lazy(() => import("../pages/EmployeePage"));
const AddEmployeePage = lazy(() => import("../pages/AddEmployeePage"));
const EditEmployeePage = lazy(() => import("../pages/EditEmployeePage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const AttendancePage = lazy(() => import("../pages/AttendancePage"));
const LeavePage = lazy(() => import("../pages/LeavePage"));
const LeaveTypesPage = lazy(() => import("../pages/LeaveTypesPage"));
const PerformancePage = lazy(() => import("../pages/PerformancePage"));
const MyPerformancePage = lazy(() => import("../pages/MyPerformancePage"));
const PositionsPage = lazy(() => import("../pages/PositionsPage"));
const PayrollPage = lazy(() => import("../pages/PayrollPage"));
const TasksPage = lazy(() => import("../pages/TasksPage"));
const DocumentsPage = lazy(() => import("../pages/DocumentsPage"));
const NoticeBoardPage = lazy(() => import("../pages/NoticeBoardPage"));
const EventPage = lazy(() => import("../pages/EventPage"));
const DesignationPage = lazy(() => import("../pages/DesignationPage"));
const DepartmentPage = lazy(() => import("../pages/DepartmentPage"));
const ReportsPage = lazy(() => import("../pages/ReportsPage"));

function PageLoader() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f1a] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ErrorBoundary>
                    <Routes>
                      <Route
                        index
                        element={<Navigate to="/dashboard" replace />}
                      />
                      <Route path="dashboard" element={<DashboardPage />} />

                      {/* Employee Routes */}
                      <Route path="employees" element={<EmployeesPage />} />
                      <Route path="employees/:id" element={<EmployeePage />} />
                      <Route
                        path="employees/add"
                        element={
                          <RoleGuard allowedRoles={["manager"]}>
                            <AddEmployeePage />
                          </RoleGuard>
                        }
                      />
                      <Route
                        path="employees/:id/edit"
                        element={
                          <RoleGuard allowedRoles={["manager"]}>
                            <EditEmployeePage />
                          </RoleGuard>
                        }
                      />
                      <Route
                        path="employees/positions"
                        element={<PositionsPage />}
                      />
                      <Route
                        path="employees/my-performance"
                        element={<MyPerformancePage />}
                      />

                      {/* Attendance & Leave */}
                      <Route path="attendance" element={<AttendancePage />} />
                      <Route
                        path="attendance/me"
                        element={<AttendancePage />}
                      />
                      <Route path="leave" element={<LeavePage />} />
                      <Route path="leave/me" element={<LeavePage />} />
                      <Route path="leave/types" element={<LeaveTypesPage />} />

                      {/* Performance, Tasks, Documents */}
                      <Route path="performance" element={<PerformancePage />} />
                      <Route path="tasks" element={<TasksPage />} />
                      <Route path="documents" element={<DocumentsPage />} />

                      {/* Payroll & Reports */}
                      <Route
                        path="payroll/salary"
                        element={
                          <RoleGuard allowedRoles={["manager"]}>
                            <PayrollPage />
                          </RoleGuard>
                        }
                      />
                      <Route
                        path="reports"
                        element={
                          <RoleGuard allowedRoles={["manager"]}>
                            <ReportsPage />
                          </RoleGuard>
                        }
                      />

                      {/* HRMS & Profile */}
                      <Route
                        path="notice-board"
                        element={<NoticeBoardPage />}
                      />
                      <Route path="event" element={<EventPage />} />
                      <Route path="designation" element={<DesignationPage />} />
                      <Route path="department" element={<DepartmentPage />} />
                      <Route path="profile" element={<ProfilePage />} />

                      {/* 404 */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </ErrorBoundary>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Root Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
