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

async function attemptLogin(credentials: LoginCredentials): Promise<Response> {
  return fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: credentials.username,
      password: credentials.password,
      expiresInMins: 60,
    }),
  });
}

export async function loginUser(
  credentials: LoginCredentials,
): Promise<AuthUser> {
  let response = await attemptLogin(credentials);

  // Retry once after 1s if rate limited or server error
  if (!response.ok && response.status !== 400) {
    await new Promise((r) => setTimeout(r, 1000));
    response = await attemptLogin(credentials);
  }

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error("Invalid username or password.");
    }
    throw new Error("Login failed. Please try again.");
  }

  const data: DummyJsonAuthResponse = await response.json();
  const role = ROLE_MAP[data.username] ?? DEFAULT_ROLE;

  return {
    id: data.id,
    username: data.username,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    image: data.image,
    token: data.accessToken,
    role,
  };
}
