import { AppRouter } from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { EmployeeProvider } from "./context/EmployeeContext";
import { LeaveProvider } from "./context/LeaveContext";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <LeaveProvider>
          <ThemeProvider>
            <AppRouter />
          </ThemeProvider>
        </LeaveProvider>
      </EmployeeProvider>
    </AuthProvider>
  );
}