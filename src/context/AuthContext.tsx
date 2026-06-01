import {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AuthState, AuthAction, AuthUser } from "../types";
import { loginUser } from "../services/authService";

const initialState: AuthState = {
  user:            null,
  isAuthenticated: false,
  isLoading:       false,
  error:           null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true, error: null };
    case "LOGIN_SUCCESS":
      return {
        user:            action.payload,
        isAuthenticated: true,
        isLoading:       false,
        error:           null,
      };
    case "LOGIN_FAILURE":
      return {
        user:            null,
        isAuthenticated: false,
        isLoading:       false,
        error:           action.payload,
      };
    case "LOGOUT":
      return { ...initialState };
    default:
      return state;
  }
}

interface AuthContextValue extends AuthState {
  login:  (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "emp_auth_user";

function persistUser(user: AuthUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const saved = loadUser();
    if (saved) {
      dispatch({ type: "LOGIN_SUCCESS", payload: saved });
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const user = await loginUser({ username, password });
      persistUser(user);
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed.";
      dispatch({ type: "LOGIN_FAILURE", payload: message });
    }
  }, []);

  const logout = useCallback(() => {
    clearUser();
    dispatch({ type: "LOGOUT" });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}