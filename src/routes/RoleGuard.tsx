import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";
import type { Role } from "../types";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
  fallback?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback = "/dashboard",
}: RoleGuardProps) {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={fallback} replace />;
  }

  return <>{children}</>;
}
