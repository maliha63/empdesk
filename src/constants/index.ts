import type { Role } from "../types";

export const API_BASE = "https://dummyjson.com";

export const ROLE_MAP: Record<string, Role> = {
  emilys:  "manager",
  sophiab: "employee",
};

export const DEFAULT_ROLE: Role = "employee";

export const DEPARTMENTS = [
  "All",
  "Engineering",
  "Marketing",
  "Sales",
  "Support",
  "HR",
  "Finance",
  "Legal",
];

export const ITEMS_PER_PAGE = 10;

export const ROUTES = {
  LOGIN:           "/login",
  DASHBOARD:       "/dashboard",
  EMPLOYEES:       "/employees",
  EMPLOYEE_DETAIL: "/employees/:id",
  ADD_EMPLOYEE:    "/employees/add",
  EDIT_EMPLOYEE:   "/employees/:id/edit",
  PROFILE:         "/profile",
  NOT_FOUND:       "*",
} as const;