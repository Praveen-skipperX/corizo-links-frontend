import { Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { getInitials } from '../../lib/utils';

interface NavbarProps {
  onMenuClick: () => void;
}

const pageTitles: Record<string, { title: string; sub: string }> = {
  '/dashboard': { title: 'Dashboard', sub: 'Overview of all shared links' },
  '/admin/links': { title: 'Links Management', sub: 'Create, edit and manage links' },
  '/admin/users': { title: 'User Management', sub: 'Manage portal users and roles' },
  '/admin/activity': { title: 'Activity Log', sub: 'Full audit trail of portal activity' },
};

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const page = pageTitles[location.pathname] ?? { title: 'Dashboard', sub: 'Corizo Links Portal' };

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-primary p-2 rounded-lg hover:bg-primary/10 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-base font-bold text-accent leading-tight">{page.title}</h2>
          <p className="text-xs text-gray-400 hidden sm:block">{page.sub}</p>
        </div>
      </div>

      {/* Right – user info */}
      <div className="flex items-center gap-2.5">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-accent leading-tight">{user?.name}</p>
          <span
            className={
              user?.role === 'admin'
                ? 'badge-admin text-[10px] py-0'
                : 'badge-author text-[10px] py-0'
            }
          >
            {user?.role === 'admin' ? 'Admin' : 'Author'}
          </span>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/60 to-primary flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
          {getInitials(user?.name || 'U')}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
