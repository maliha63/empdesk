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
  Menu,
} from "lucide-react";
import type { ReactNode } from "react";
import ThemeToggle from "../components/ThemeToggle";

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
}

const managerNav: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { label: "Employees", to: "/employees", icon: <Users size={16} /> },
  { label: "My Profile", to: "/profile", icon: <UserCircle size={16} /> },
];
const employeeNav: NavItem[] = [
  { label: "My Profile", to: "/profile", icon: <UserCircle size={16} /> },
  { label: "Employees", to: "/employees", icon: <Users size={16} /> },
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
  function handleLogout() {
    logout();
    navigate("/login");
  }

  function SidebarContent() {
    return (
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="h-[60px] px-4 flex items-center justify-between border-b border-gray-100 dark:border-[#1f2a3d] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center shadow-[0_0_12px_rgb(59_130_246/0.4)] shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="5"
                  height="5"
                  rx="1.5"
                  fill="white"
                  fillOpacity="0.9"
                />
                <rect
                  x="8"
                  y="1"
                  width="5"
                  height="5"
                  rx="1.5"
                  fill="white"
                  fillOpacity="0.6"
                />
                <rect
                  x="1"
                  y="8"
                  width="5"
                  height="5"
                  rx="1.5"
                  fill="white"
                  fillOpacity="0.6"
                />
                <rect
                  x="8"
                  y="8"
                  width="5"
                  height="5"
                  rx="1.5"
                  fill="white"
                  fillOpacity="0.9"
                />
              </svg>
            </div>
            <span className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white font-mono">
              emp<span className="text-brand-500">desk</span>
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors p-1 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pt-5 pb-3 overflow-y-auto">
          <p className="text-[10px] font-semibold text-gray-300 dark:text-[#2a3a54] uppercase tracking-widest px-2 mb-3">
            Navigation
          </p>
          <div className="space-y-0.5">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-brand-500 text-white shadow-[0_2px_8px_rgb(59_130_246/0.3)]"
                      : "text-gray-500 dark:text-[#4b5e7a] hover:bg-gray-100 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={
                        isActive
                          ? "text-white"
                          : "text-gray-400 dark:text-[#4b5e7a] group-hover:text-gray-600 dark:group-hover:text-white transition-colors"
                      }
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User footer — only in sidebar, NOT in topbar */}
        <div className="px-3 py-4 border-t border-gray-100 dark:border-[#1f2a3d] shrink-0">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="relative shrink-0">
              <img
                src={user?.image}
                alt={user?.firstName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100 dark:ring-[#1f2a3d]"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-[#111827]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-gray-900 dark:text-white truncate leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[11px] text-gray-400 dark:text-[#4b5e7a] capitalize">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-[12px] font-medium
              text-gray-400 dark:text-[#4b5e7a]
              hover:text-red-500 dark:hover:text-red-400
              transition-colors rounded-xl
              hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-[#0b0f1a] flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col shrink-0 bg-white dark:bg-[#111827] border-r border-gray-100 dark:border-[#1f2a3d]">
        <SidebarContent />
      </aside>

      {/* Mobile overlay + drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -224 }}
              animate={{ x: 0 }}
              exit={{ x: -224 }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 w-56 bg-white dark:bg-[#111827] border-r border-gray-100 dark:border-[#1f2a3d] flex flex-col md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar — ThemeToggle only, NO duplicate user */}
        <header className="h-[60px] shrink-0 bg-white dark:bg-[#111827] border-b border-gray-100 dark:border-[#1f2a3d] px-4 md:px-6 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-gray-500 dark:text-gray-400 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <Menu size={18} />
          </button>
          {/* Empty left side on desktop */}
          <div className="hidden md:block" />
          {/* Right side: only ThemeToggle */}
          <ThemeToggle />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 md:p-7 page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}
