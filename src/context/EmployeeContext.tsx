import {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { Employee, UploadedDocument } from "../types";
import { fetchAllEmployees } from "../services/employeeService";

interface EmployeeState {
  employees: Employee[];
  isLoading: boolean;
  error:     string | null;
}

type EmployeeAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Employee[] }
  | { type: "FETCH_ERROR";   payload: string }
  | { type: "ADD_EMPLOYEE";  payload: Employee }
  | { type: "UPDATE_EMPLOYEE"; payload: Employee }
  | { type: "DELETE_EMPLOYEE"; payload: number }
  | { type: "ADD_DOCUMENT"; payload: { employeeId: number; doc: UploadedDocument } };

const initialState: EmployeeState = {
  employees: [],
  isLoading: false,
  error:     null,
};

function employeeReducer(state: EmployeeState, action: EmployeeAction): EmployeeState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return { employees: action.payload, isLoading: false, error: null };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "ADD_EMPLOYEE":
      return { ...state, employees: [action.payload, ...state.employees] };
    case "UPDATE_EMPLOYEE":
      return {
        ...state,
        employees: state.employees.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case "DELETE_EMPLOYEE":
      return {
        ...state,
        employees: state.employees.filter((e) => e.id !== action.payload),
      };
    case "ADD_DOCUMENT":
      return {
        ...state,
        employees: state.employees.map((e) =>
          e.id === action.payload.employeeId
            ? { ...e, documents: [action.payload.doc, ...(e.documents ?? [])] }
            : e
        ),
      };
    default:
      return state;
  }
}

interface EmployeeContextValue extends EmployeeState {
  addEmployee:    (e: Employee) => void;
  updateEmployee: (e: Employee) => void;
  deleteEmployee: (id: number) => void;
  addDocument:    (employeeId: number, doc: UploadedDocument) => void;
  refetch:        () => void;
}

export const EmployeeContext = createContext<EmployeeContextValue | null>(null);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(employeeReducer, initialState);

  const loadEmployees = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await fetchAllEmployees();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to fetch.";
      dispatch({ type: "FETCH_ERROR", payload: msg });
    }
  }, []);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  const addEmployee    = useCallback((e: Employee) => dispatch({ type: "ADD_EMPLOYEE",    payload: e }),    []);
  const updateEmployee = useCallback((e: Employee) => dispatch({ type: "UPDATE_EMPLOYEE", payload: e }),    []);
  const deleteEmployee = useCallback((id: number)  => dispatch({ type: "DELETE_EMPLOYEE", payload: id }),   []);
  const addDocument    = useCallback((employeeId: number, doc: UploadedDocument) =>
    dispatch({ type: "ADD_DOCUMENT", payload: { employeeId, doc } }), []);

  return (
    <EmployeeContext.Provider value={{
      ...state,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      addDocument,
      refetch: loadEmployees,
    }}>
      {children}
    </EmployeeContext.Provider>
  );
}