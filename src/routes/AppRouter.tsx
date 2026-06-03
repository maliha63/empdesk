import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleGuard } from "./RoleGuard";
import { AuthLayout } from "../layouts/AuthLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ErrorBoundary } from "../components/ErrorBoundary";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const EmployeesPage = lazy(() => import("../pages/EmployeesPage"));
const EmployeePage = lazy(() => import("../pages/EmployeePage"));
const AddEmployeePage = lazy(() => import("../pages/AddEmployeePage"));
const EditEmployeePage = lazy(() => import("../pages/EditEmployeePage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

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
          {/* Public */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            }
          />

          {/* Protected */}
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
                      <Route path="employees" element={<EmployeesPage />} />
                      <Route path="employees/:id" element={<EmployeePage />} />
                      <Route path="profile" element={<ProfilePage />} />

                      {/* Manager only */}
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
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </ErrorBoundary>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
