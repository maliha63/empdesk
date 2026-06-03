import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  LogOut,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import ThemeToggle from "../components/ThemeToggle";

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
}

const managerNav: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Employees", to: "/employees", icon: <Users size={18} /> },
  { label: "My Profile", to: "/profile", icon: <UserCircle size={18} /> },
];

const employeeNav: NavItem[] = [
  { label: "My Profile", to: "/profile", icon: <UserCircle size={18} /> },
  { label: "Employees", to: "/employees", icon: <Users size={18} /> },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = user?.role === "manager" ? managerNav : employeeNav;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-[#161b24]">
      {/* Mobile Close Button */}
      <div className="md:hidden flex justify-end p-4">
        <button
          onClick={() => setSidebarOpen(false)}
          className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <X size={26} />
        </button>
      </div>

      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
          emp<span className="text-gray-900 dark:text-white">desk</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-[0_2px_8px_rgb(59_130_246/0.35)] hover:shadow-[0_4px_12px_rgb(59_130_246/0.4)] hover:-translate-y-px"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 hover:my-3 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={user?.image || "/default-avatar.png"}
            alt={user?.firstName}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-sm text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors py-2"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col shrink-0 border-r border-gray-200 dark:border-gray-800">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#161b24] border-r border-gray-200 dark:border-gray-800 flex flex-col md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161b24] px-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-gray-700 dark:text-gray-300"
            >
              {/*  Hamburger */}
              <svg 
                aria-hidden="true" 
                className="pointer-events-none size-6 fill-current" 
                viewBox="0 0 16 16" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] translate-x-1.75 -translate-y-1.25" y="7" width="9" height="2" rx="1"/>
                <rect className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] rotate-0 opacity-100" y="7" width="16" height="2" rx="1"/>
                <rect className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] translate-y-1.25" y="7" width="9" height="2" rx="1"/>
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50 dark:bg-[#0f1117]">
          {children}
        </main>
      </div>
    </div>
  );
}