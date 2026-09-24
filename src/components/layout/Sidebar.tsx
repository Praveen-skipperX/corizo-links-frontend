import {
  Activity,
  LayoutDashboard,
  LogOut,
  Settings2,
  Users,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getInitials } from "../../lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium",
      "transition-all duration-200 cursor-pointer select-none",
      isActive
        ? "bg-white/10 text-white shadow-sm"
        : "text-white/55 hover:bg-white/[0.06] hover:text-white/90",
    ].join(" ");

  return (
    <aside
      className={[
        "fixed top-0 left-0 h-full w-[260px] z-30",
        "bg-brand-sidebar flex flex-col",
        "transition-transform duration-300 ease-in-out shadow-sidebar lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
      ].join(" ")}
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <img
            src="https://corizo.in/wp-content/themes/techglobiz/images/hdr-logo.jpg"
            alt="Corizo"
            className="h-7 w-auto max-w-[100px] object-contain flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="text-white font-bold text-sm tracking-tight leading-tight">
              Corizo Links
            </p>
            <p className="text-white/35 text-[10px] font-medium tracking-wider uppercase mt-0.5">
              Internal Portal
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
        <SectionLabel>Workspace</SectionLabel>

        <NavLink to="/dashboard" end className={linkClass} onClick={onClose}>
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
              )}
              <LayoutDashboard
                size={17}
                strokeWidth={isActive ? 2.2 : 1.8}
                className={isActive ? "text-primary" : "text-white/40 group-hover:text-white/70"}
              />
              <span className="flex-1">Dashboard</span>
            </>
          )}
        </NavLink>

        {user?.role === "admin" && (
          <>
            <div className="pt-5" />
            <SectionLabel>Administration</SectionLabel>

            <NavLink
              to="/admin/activity"
              className={linkClass}
              onClick={onClose}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
                  )}
                  <Activity
                    size={17}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={
                      isActive
                        ? "text-primary"
                        : "text-white/40 group-hover:text-white/70"
                    }
                  />
                  <span className="flex-1">Activity Log</span>
                </>
              )}
            </NavLink>

            <NavLink to="/admin/users" className={linkClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
                  )}
                  <Users
                    size={17}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={
                      isActive
                        ? "text-primary"
                        : "text-white/40 group-hover:text-white/70"
                    }
                  />
                  <span className="flex-1">User Management</span>
                </>
              )}
            </NavLink>

            <NavLink to="/admin/links" className={linkClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
                  )}
                  <Settings2
                    size={17}
                    strokeWidth={isActive ? 2.2 : 1.8}
                    className={
                      isActive
                        ? "text-primary"
                        : "text-white/40 group-hover:text-white/70"
                    }
                  />
                  <span className="flex-1">Links Management</span>
                </>
              )}
            </NavLink>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 pt-2 space-y-2">
        <div className="mx-2 mb-3 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.06] border border-white/[0.06]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ring-2 ring-white/10">
            {getInitials(user?.name || "U")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-semibold text-white truncate leading-tight">
              {user?.name}
            </p>
            <span
              className={
                user?.role === "admin"
                  ? "badge-admin mt-1"
                  : "badge-author mt-1"
              }
            >
              {user?.role === "admin" ? "Admin" : "Author"}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-red-300/80 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[10px] font-bold text-white/25 uppercase tracking-[0.14em] px-3.5 pt-1 pb-2.5">
    {children}
  </p>
);

export default Sidebar;
