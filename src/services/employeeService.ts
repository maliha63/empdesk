import { API_BASE } from "../constants";
import type { Employee, EmployeesResponse } from "../types";

export async function fetchAllEmployees(): Promise<Employee[]> {
  const res = await fetch(
    `${API_BASE}/users?limit=100&select=id,firstName,lastName,email,phone,image,age,gender,address,company,username`,
  );
  if (!res.ok) throw new Error("Failed to fetch employees.");
  const data: EmployeesResponse = await res.json();
  return data.users;
}

export async function fetchEmployeeById(id: number): Promise<Employee> {
  const res = await fetch(`${API_BASE}/users/${id}`);
  if (!res.ok) throw new Error("Employee not found.");
  return res.json();
}
