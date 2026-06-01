import {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

export type LeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRequest {
  id:         string;
  employeeId: number;
  name:       string;
  image:      string;
  reason:     string;
  from:       string;
  to:         string;
  status:     LeaveStatus;
  appliedAt:  string;
}

interface LeaveState {
  requests: LeaveRequest[];
}

type LeaveAction =
  | { type: "APPLY";   payload: LeaveRequest }
  | { type: "APPROVE"; payload: string }
  | { type: "REJECT";  payload: string }
  | { type: "HYDRATE"; payload: LeaveRequest[] };

const STORAGE_KEY = "emp_leave_requests";

function leaveReducer(state: LeaveState, action: LeaveAction): LeaveState {
  switch (action.type) {
    case "HYDRATE":
      return { requests: action.payload };
    case "APPLY":
      return { requests: [action.payload, ...state.requests] };
    case "APPROVE":
      return {
        requests: state.requests.map((r) =>
          r.id === action.payload ? { ...r, status: "approved" } : r
        ),
      };
    case "REJECT":
      return {
        requests: state.requests.map((r) =>
          r.id === action.payload ? { ...r, status: "rejected" } : r
        ),
      };
    default:
      return state;
  }
}

interface LeaveContextValue extends LeaveState {
  applyLeave:   (req: Omit<LeaveRequest, "id" | "status" | "appliedAt">) => void;
  approveLeave: (id: string) => void;
  rejectLeave:  (id: string) => void;
}

export const LeaveContext = createContext<LeaveContextValue | null>(null);

export function LeaveProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(leaveReducer, { requests: [] });

  // Rehydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "HYDRATE", payload: JSON.parse(raw) });
    } catch { /* ignore */ }
  }, []);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.requests));
  }, [state.requests]);

  const applyLeave = useCallback(
    (req: Omit<LeaveRequest, "id" | "status" | "appliedAt">) => {
      dispatch({
        type: "APPLY",
        payload: {
          ...req,
          id:        crypto.randomUUID(),
          status:    "pending",
          appliedAt: new Date().toISOString().split("T")[0],
        },
      });
    }, []
  );

  const approveLeave = useCallback((id: string) => {
    dispatch({ type: "APPROVE", payload: id });
  }, []);

  const rejectLeave = useCallback((id: string) => {
    dispatch({ type: "REJECT", payload: id });
  }, []);

  return (
    <LeaveContext.Provider value={{ ...state, applyLeave, approveLeave, rejectLeave }}>
      {children}
    </LeaveContext.Provider>
  );
}