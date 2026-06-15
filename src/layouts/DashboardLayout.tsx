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
  ChevronDown,
  Clock,
  Calendar,
  CreditCard,
  TrendingUp,
  MapPin,
  FileText,
  ChevronLeft,
  CheckSquare,
} from "lucide-react";
import type { ReactNode } from "react";
import ThemeToggle from "../components/ThemeToggle";

interface NavItem {
  label: string;
  to?: string;
  icon: ReactNode;
  children?: { label: string; to: string; icon: ReactNode }[];
}

const managerNav: NavItem[] = [
  { label: "Dashboard", to: "/dashboard", icon: <LayoutDashboard size={18} /> },
  {
    label: "Attendance",
    to: "/attendance",
    icon: <Clock size={18} />,
  },
  {
    label: "Employee",
    icon: <Users size={18} />,
    children: [
      {
        label: "Position",
        to: "/employees/positions",
        icon: <MapPin size={15} />,
      },
      { label: "Employee List", to: "/employees", icon: <Users size={15} /> },
      {
        label: "Performance",
        to: "/employees/performance",
        icon: <TrendingUp size={15} />,
      },
    ],
  },
  {
    label: "Leave",
    icon: <Calendar size={18} />,
    children: [
      { label: "Leave Requests", to: "/leave", icon: <Calendar size={15} /> },
      {
        label: "Leave Types",
        to: "/leave/types",
        icon: <Calendar size={15} />,
      },
    ],
  },
  {
    label: "Payroll",
    icon: <CreditCard size={18} />,
    children: [
      {
        label: "Salary",
        to: "/payroll/salary",
        icon: <CreditCard size={15} />,
      },
    ],
  },
  {
    label: "Reports",
    to: "/reports",
    icon: <FileText size={18} />,
  },

  {
    label: "HRMS",
    icon: <Users size={18} />,
    children: [
      {
        label: "Notice Board",
        to: "/notice-board",
        icon: <LayoutDashboard size={15} />,
      },
      { label: "Events", to: "/event", icon: <Calendar size={15} /> },
      { label: "Designation", to: "/designation", icon: <Users size={15} /> },
      { label: "Department", to: "/department", icon: <MapPin size={15} /> },
    ],
  },
  { label: "My Profile", to: "/profile", icon: <UserCircle size={18} /> },
];

const employeeNav: NavItem[] = [
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Attendance",
    to: "/attendance/me",
    icon: <Clock size={18} />,
  },
  {
    label: "Leave",
    to: "/leave/me",
    icon: <Calendar size={18} />,
  },
  {
    label: "My Documents",
    to: "/documents",
    icon: <FileText size={18} />,
  },
  {
    label: "My Performance",
    to: "/employees/my-performance",
    icon: <TrendingUp size={18} />,
  },
  {
    label: "My Tasks",
    to: "/tasks",
    icon: <CheckSquare size={18} />,
  },
  {
    label: "Notice Board",
    to: "/notice-board",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Events",
    to: "/event",
    icon: <Calendar size={18} />,
  },
  {
    label: "My Profile",
    to: "/profile",
    icon: <UserCircle size={18} />,
  },
];

function NavGroup({
  item,
  collapsed,
  onExpandRequest,
}: {
  item: NavItem;
  collapsed: boolean;
  onExpandRequest?: () => void;
}) {
  const location = useLocation();
  const isChildActive = item.children?.some((c) => location.pathname === c.to);
  const [open, setOpen] = useState(isChildActive);

  useEffect(() => {
    if (isChildActive) setOpen(true);
  }, [isChildActive]);

  const handleClick = () => {
    setOpen((v) => !v);
    // When collapsed and clicking a parent module with children, request sidebar expansion
    if (collapsed && onExpandRequest) {
      onExpandRequest();
    }
  };

  if (collapsed) {
    return (
      <div title={item.label} className="flex justify-center">
        <button
          onClick={handleClick}
          className={`p-2.5 rounded-lg transition-all ${
            isChildActive
              ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              : "text-(--text-secondary) hover:bg-(--bg-card2) hover:text-(--text-primary)"
          }`}
        >
          {item.icon}
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all
          ${
            isChildActive
              ? "font-bold text-(--text-primary)"
              : "font-medium text-(--text-secondary) hover:bg-(--bg-card2) hover:text-(--text-primary)"
          }`}
      >
        <span className="shrink-0">{item.icon}</span>
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && item.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden ml-4 mt-0.5"
          >
            <div className="border-l border-(--border) pl-3 space-y-0.5 py-1">
              {item.children.map((child) => {
                const isActive = location.pathname === child.to;
                return (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                      ${
                        isActive
                          ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                          : "text-(--text-secondary) hover:bg-(--bg-card2) hover:text-(--text-primary)"
                      }`}
                    // isActive is implicitly tracked by NavLink's inner matching logic
                  >
                    {child.icon}
                    {child.label}
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = user?.role === "manager" ? managerNav : employeeNav;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-(--bg-base) flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-(--border) bg-(--bg-card) transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"}`}
      >
        <div className="px-6 py-5 border-b border-(--border) flex items-center justify-between">
          {!sidebarCollapsed && (
            <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
              emp<span className="text-(--text-primary)">desk</span>
            </span>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-(--bg-card2) rounded-lg transition-colors ml-auto"
            title={sidebarCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft
              size={20}
              className={`text-(--text-secondary) transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) =>
            item.children ? (
              <NavGroup
                key={item.label}
                item={item}
                collapsed={sidebarCollapsed}
                onExpandRequest={() => setSidebarCollapsed(false)}
              />
            ) : (
              <NavLink
                key={item.to}
                to={item.to!}
                title={sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "text-(--text-secondary) hover:bg-(--bg-card2) hover:text-(--text-primary)"
                  } ${sidebarCollapsed ? "justify-center" : ""}`
                }
              >
                {item.icon}
                {!sidebarCollapsed && item.label}
              </NavLink>
            ),
          )}
        </nav>

        <div className="p-3 border-t border-(--border) mt-auto">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3 mb-4 px-1">
              <img
                src={user?.image || "https://dummyjson.com/icon/user/128"}
                alt={user?.firstName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-(--border)"
              />
              <div className="min-w-0">
                <p className="font-medium text-(--text-primary) text-sm truncate">
                  {user?.firstName}
                </p>
                <p className="text-xs text-(--text-muted) capitalize truncate">
                  {user?.role}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? "Sign out" : undefined}
            className={`flex items-center gap-2 w-full text-sm text-(--text-secondary) hover:text-red-500 transition-colors py-2 px-1 ${sidebarCollapsed ? "justify-center" : ""}`}
          >
            <LogOut size={16} />
            {!sidebarCollapsed && "Sign out"}
          </button>
        </div>
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
              className="fixed inset-y-0 left-0 z-50 w-64 bg-(--bg-card) border-r border-(--border) flex flex-col md:hidden"
            >
              <div className="md:hidden flex justify-end p-4">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-(--text-secondary)"
                >
                  <X size={26} />
                </button>
              </div>

              <div className="px-6 py-5 border-b border-(--border)">
                <span className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-500">
                  emp<span className="text-(--text-primary)">desk</span>
                </span>
              </div>

              <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                {navItems.map((item) =>
                  item.children ? (
                    <NavGroup
                      key={item.label}
                      item={item}
                      collapsed={false}
                      onExpandRequest={() => setSidebarOpen(false)}
                    />
                  ) : (
                    <NavLink
                      key={item.to}
                      to={item.to!}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                          isActive
                            ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                            : "text-(--text-secondary) hover:bg-(--bg-card2) hover:text-(--text-primary)"
                        }`
                      }
                    >
                      {item.icon}
                      {item.label}
                    </NavLink>
                  ),
                )}
              </nav>

              <div className="p-4 border-t border-(--border) mt-auto">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={user?.image || "https://dummyjson.com/icon/user/128"}
                    alt={user?.firstName}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-(--border)"
                  />
                  <div>
                    <p className="font-medium text-(--text-primary)">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-(--text-muted) capitalize">
                      {user?.role}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-sm text-(--text-secondary) hover:text-red-500 transition-colors py-2"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-18 border-b border-(--border) bg-(--bg-card) px-5 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-(--text-secondary)"
          >
            <svg
              aria-hidden="true"
              className="pointer-events-none size-4.5 fill-current"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] translate-x-1.75 -translate-y-1.25"
                y="7"
                width="9"
                height="2"
                rx="1"
              ></rect>
              <rect
                className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] rotate-0 opacity-100"
                y="7"
                width="16"
                height="2"
                rx="1"
              ></rect>
              <rect
                className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] translate-y-1.25"
                y="7"
                width="9"
                height="2"
                rx="1"
              ></rect>
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-8 bg-(--bg-base)">
          {children}
        </main>
      </div>
    </div>
  );
}
