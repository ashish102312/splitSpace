import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  BarChart3, 
  UserCircle, 
  LogOut,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Group Spaces', path: '/groups', icon: Users },
    { name: 'Personal Expenses', path: '/expenses', icon: Receipt },
    { name: 'Financial Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Account Profile', path: '/profile', icon: UserCircle },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    if (path === '/groups') return location.pathname.startsWith('/groups');
    return location.pathname === path;
  };

  return (
    <aside className="w-68 bg-white border-r border-slate-200/80 hidden md:flex flex-col flex-shrink-0 z-20 shadow-[1px_0_12px_rgba(15,23,42,0.02)]">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <span className="font-bold text-lg tracking-tight">S</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Split<span className="text-blue-600">Space</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="System Online"></span>
            </div>
            <p className="text-[11px] font-medium text-slate-600 uppercase tracking-wider">Expense Matrix</p>
          </div>
        </Link>
      </div>

      {/* Navigation Items */}
      <div className="px-3 py-4 flex-1 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-1">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Workspace
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-blue-50/90 text-blue-700 font-semibold shadow-xs border border-blue-100/80'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    active 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.name}</span>
                </div>
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Pro Banner / Clean badge */}
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-100/80">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Smart Debt Minimizer</span>
          </div>
          <p className="text-[12px] text-slate-600 leading-relaxed">
            Automatic multi-party balance settlement active for all shared spaces.
          </p>
        </div>
      </div>

      {/* User info & Logout */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/60 mb-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase flex-shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-800 truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-slate-600 truncate">{user?.email || 'Active Member'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors border border-transparent hover:border-red-100"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
