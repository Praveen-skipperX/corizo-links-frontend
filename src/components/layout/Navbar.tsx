import { Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { getInitials } from "../../lib/utils";

interface NavbarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, { title: string; sub: string }> = {
  "/dashboard": {
    title: "Dashboard",
    sub: "Browse and open shared resource links",
  },
  "/admin/links": {
    title: "Links Management",
    sub: "Create, edit and manage portal links",
  },
  "/admin/users": {
    title: "User Management",
    sub: "Manage portal users and roles",
  },
  "/admin/activity": {
    title: "Activity Log",
    sub: "Full audit trail of portal activity",
  },
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const page = pageTitles[location.pathname] ?? {
    title: "Dashboard",
    sub: "Corizo Links Portal",
  };

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-100/80 px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-primary p-2 rounded-xl hover:bg-primary/8 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0">
          <h2 className="text-[15px] font-bold text-accent leading-tight tracking-tight truncate">
            {page.title}
          </h2>
          <p className="text-[11px] text-gray-400 hidden sm:block mt-0.5 truncate">
            {page.sub}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-[13px] font-semibold text-accent leading-tight">
            {user?.name}
          </p>
          <span
            className={
              user?.role === "admin" ? "badge-admin" : "badge-author"
            }
          >
            {user?.role === "admin" ? "Admin" : "Author"}
          </span>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-soft ring-2 ring-primary/10">
          {getInitials(user?.name || "U")}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
