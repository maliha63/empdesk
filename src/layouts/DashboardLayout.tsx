import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  LogOut,
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
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const navItems         = user?.role === "manager" ? managerNav : employeeNav;

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className="w-60 bg-surface-card border-r border-surface-border flex flex-col shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-surface-border">
          <span className="text-brand-500 font-bold text-lg tracking-tight font-mono">
            emp<span className="text-white">desk</span>
          </span>
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
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}