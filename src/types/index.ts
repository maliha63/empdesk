// ─── Roles ────────────────────────────────────────────────────────────────────
export type Role = "manager" | "employee";

// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  token: string;
  role: Role;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: AuthUser }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" };

// ─── Employee ─────────────────────────────────────────────────────────────────
export interface Address {
  address: string;
  city: string;
  state: string;
  country: string;
}

export interface Company {
  name: string;
  department: string;
  title: string;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
  age: number;
  gender: string;
  address: Address;
  company: Company;
  username: string;
  documents?: UploadedDocument[];
}

export interface EmployeesResponse {
  users: Employee[];
  total: number;
  skip: number;
  limit: number;
}

// ─── Documents ────────────────────────────────────────────────────────────────
export interface UploadedDocument {
  id:         string;
  name:       string;
  type:       string;
  size:       string;
  uploadedAt: string;
  dataUrl:    string; // base64 for preview/download
}

// ─── Mock Data Types ──────────────────────────────────────────────────────────
export type AttendanceStatus = "Present" | "Absent" | "Late" | "Leave";

export interface AttendanceRecord {
  date:     string;
  status:   AttendanceStatus;
  checkIn:  string;
  checkOut: string;
}

export interface Document {
  id:         string;
  name:       string;
  type:       string;
  uploadedAt: string;
  size:       string;
}

export interface PerformanceRecord {
  month:          string;
  score:          number;
  tasksCompleted: number;
  rating:         "Excellent" | "Good" | "Average" | "Poor";
}

export interface SelectOption {
  label: string;
  value: string;
}