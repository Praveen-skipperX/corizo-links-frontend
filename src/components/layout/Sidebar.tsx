import { Activity, LayoutDashboard, LogOut, Link2, ShieldCheck, Users, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../lib/utils';
import Brand from '../Brand';
interface SidebarProps { isOpen: boolean; onClose: () => void }
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const navClass = ({ isActive }: { isActive: boolean }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-blue-100 text-blue-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`;
  return <aside aria-label="Main navigation" className={`fixed top-0 left-0 h-full w-[260px] z-30 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
    <div className="px-6 h-20 flex items-center justify-between"><Brand compact /><button aria-label="Close navigation" className="lg:hidden p-2" onClick={onClose}><X size={18}/></button></div>
    <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1"><p className="px-4 pb-3 text-[11px] uppercase tracking-widest text-slate-400 font-semibold">Workspace</p><NavLink to="/dashboard" className={navClass} onClick={onClose}><LayoutDashboard size={18}/>Shared links</NavLink>
    {user?.role === 'admin' && <><p className="px-4 pt-7 pb-3 text-[11px] uppercase tracking-widest text-slate-400 font-semibold">Administration</p><NavLink to="/admin/links" className={navClass} onClick={onClose}><Link2 size={18}/>Manage links</NavLink><NavLink to="/admin/users" className={navClass} onClick={onClose}><Users size={18}/>People & roles</NavLink><NavLink to="/admin/activity" className={navClass} onClick={onClose}><Activity size={18}/>Activity log</NavLink></>}
    <p className="px-4 pt-7 pb-3 text-[11px] uppercase tracking-widest text-slate-400 font-semibold">Account</p><NavLink to="/security" className={navClass} onClick={onClose}><ShieldCheck size={18}/>Security settings</NavLink></nav>
    <div className="p-4 border-t border-slate-100"><div className="flex items-center gap-3 px-3 py-3"><div className="rounded-full bg-blue-100 text-blue-700 w-9 h-9 flex items-center justify-center text-xs font-bold">{getInitials(user?.name || 'U')}</div><div className="min-w-0"><p className="text-sm font-semibold truncate">{user?.name}</p><p className="text-xs text-slate-500 truncate">{user?.email}</p></div></div><button className="flex items-center gap-3 px-3 py-3 text-sm text-slate-600 hover:bg-slate-100 rounded-lg w-full" onClick={async () => { await logout(); navigate('/login', { replace: true }); }}><LogOut size={17}/>Sign out</button></div>
  </aside>;
}
