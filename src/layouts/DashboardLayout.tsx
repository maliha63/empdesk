import { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

interface NavItem {
  label: string;
  to:    string;
  icon:  ReactNode;
}

const managerNav: NavItem[] = [
  { label: "Dashboard",  to: "/dashboard", icon: <LayoutDashboard size={16} /> },
  { label: "Employees",  to: "/employees", icon: <Users size={16} />           },
  { label: "My Profile", to: "/profile",   icon: <UserCircle size={16} />      },
];

const employeeNav: NavItem[] = [
  { label: "My Profile", to: "/profile",   icon: <UserCircle size={16} />      },
  { label: "Employees",  to: "/employees", icon: <Users size={16} />           },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const location          = useLocation();
  const navItems          = user?.role === "manager" ? managerNav : employeeNav;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-surface-card">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-surface-border flex items-center justify-between">
        <span className="text-brand-500 font-bold text-lg tracking-tight font-mono">
          emp<span className="text-white">desk</span>
        </span>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-500/15 text-brand-500"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t border-surface-border">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={user?.image}
            alt={user?.firstName}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-border"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full text-left text-xs text-slate-500 hover:text-red-400 transition-colors px-1"
        >
          <LogOut size={12} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface flex">

      {/* Desktop sidebar - Original styling */}
      <aside className="hidden md:flex w-60 bg-surface-card border-r border-surface-border flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/80 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Mobile Drawer - Force solid background only on mobile */}
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed inset-y-0 left-0 z-50 w-60 bg-[#0f1620] border-r border-[#232a3a] flex flex-col md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile topbar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-surface-card border-b border-surface-border shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
          <span className="text-brand-500 font-bold text-base tracking-tight font-mono">
            emp<span className="text-white">desk</span>
          </span>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}