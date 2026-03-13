import {
  Activity,
  ChevronRight,
  LayoutDashboard,
  Link2,
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
      "group flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium",
      "transition-all duration-200 cursor-pointer select-none",
      isActive
        ? "bg-primary text-white shadow-md shadow-primary/30"
        : "text-gray-600 hover:bg-brand-light-bg hover:text-primary",
    ].join(" ");

  return (
    <aside
      className={[
        "fixed top-0 left-0 h-full w-[268px] z-30 bg-white border-r border-gray-100/80",
        "flex flex-col transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
      ].join(" ")}
    >
      {/* Brand */}
      <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
        <div className="flex flex-col items-center">
          {/* <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-md shadow-primary/30 flex-shrink-0">
            <Zap size={20} className="text-white" />
          </div> */}
          <img
            src="https://corizo.in/wp-content/themes/techglobiz/images/hdr-logo.jpg"
            alt="Corizo Links"
            className="mx-auto h-10 w-auto"
          />
          <div>
            <h3 className="font-extrabold text-accent text-[15px] leading-tight tracking-tight">
              Links
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={17} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <SectionLabel>Main</SectionLabel>

        <NavLink to="/dashboard" end className={linkClass} onClick={onClose}>
          {({ isActive }) => (
            <>
              <LayoutDashboard
                size={18}
                className={
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-primary"
                }
              />
              <span className="flex-1">Dashboard</span>
              {isActive && <ChevronRight size={13} className="text-white/70" />}
            </>
          )}
        </NavLink>

        <NavLink to="/dashboard" end className={linkClass} onClick={onClose}>
          {({ isActive }) => (
            <>
              <Link2
                size={18}
                className={
                  isActive
                    ? "text-white"
                    : "text-gray-400 group-hover:text-primary"
                }
              />
              <span className="flex-1">All Links</span>
              {isActive && <ChevronRight size={13} className="text-white/70" />}
            </>
          )}
        </NavLink>

        {user?.role === "admin" && (
          <>
            <div className="pt-4" />
            <SectionLabel>Analytics</SectionLabel>

            <NavLink
              to="/admin/activity"
              className={linkClass}
              onClick={onClose}
            >
              {({ isActive }) => (
                <>
                  <Activity
                    size={18}
                    className={
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-primary"
                    }
                  />
                  <span className="flex-1">Activity Log</span>
                  {isActive && (
                    <ChevronRight size={13} className="text-white/70" />
                  )}
                </>
              )}
            </NavLink>

            <div className="pt-4" />
            <SectionLabel>Admin Settings</SectionLabel>

            <NavLink to="/admin/users" className={linkClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  <Users
                    size={18}
                    className={
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-primary"
                    }
                  />
                  <span className="flex-1">User Management</span>
                  {isActive && (
                    <ChevronRight size={13} className="text-white/70" />
                  )}
                </>
              )}
            </NavLink>

            <NavLink to="/admin/links" className={linkClass} onClick={onClose}>
              {({ isActive }) => (
                <>
                  <Settings2
                    size={18}
                    className={
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-hover:text-primary"
                    }
                  />
                  <span className="flex-1">Links Management</span>
                  {isActive && (
                    <ChevronRight size={13} className="text-white/70" />
                  )}
                </>
              )}
            </NavLink>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-brand-light-bg">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
            {getInitials(user?.name || "U")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-accent truncate leading-tight">
              {user?.name}
            </p>
            <span
              className={
                user?.role === "admin"
                  ? "badge-admin text-[10px] py-0"
                  : "badge-author text-[10px] py-0"
              }
            >
              {user?.role === "admin" ? "Admin" : "Author"}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-1 pb-2">
    {children}
  </p>
);

export default Sidebar;
