import { API_BASE, ROLE_MAP, DEFAULT_ROLE } from "../constants";
import type { AuthUser } from "../types";

interface LoginCredentials {
  username: string;
  password: string;
}

interface DummyJsonAuthResponse {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthUser> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username:      credentials.username,
      password:      credentials.password,
      expiresInMins: 60,
    }),
  });

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Invalid username or password.");
    }
    throw new Error("Login failed. Please try again.");
  }

  const data: DummyJsonAuthResponse = await response.json();
  const role = ROLE_MAP[data.username] ?? DEFAULT_ROLE;

  return {
    id:        data.id,
    username:  data.username,
    firstName: data.firstName,
    lastName:  data.lastName,
    email:     data.email,
    image:     data.image,
    token:     data.accessToken,
    role,
  };
}