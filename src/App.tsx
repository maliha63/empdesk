import { AppRouter }        from "./routes/AppRouter";
import { AuthProvider }     from "./context/AuthContext";
import { EmployeeProvider } from "./context/EmployeeContext";
import { LeaveProvider }    from "./context/LeaveContext";

export default function App() {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <LeaveProvider>
          <AppRouter />
        </LeaveProvider>
      </EmployeeProvider>
    </AuthProvider>
  );
}