import React from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Bookmark,
  History,
  Settings as SettingsIcon,
  LogOut,
  LogIn,
  Moon,
  Sun,
  X,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProps {
  activeTab: 'dashboard' | 'saved' | 'history' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'saved' | 'history' | 'settings') => void;
  savedCount: number;
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  user,
  onLogin,
  onLogout,
  darkMode,
  setDarkMode,
  mobileOpen,
  setMobileOpen,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Find Leads',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'saved',
      label: 'Saved Leads',
      icon: Bookmark,
      badge: savedCount > 0 ? savedCount : null,
    },
    {
      id: 'history',
      label: 'Search History',
      icon: History,
      badge: null,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingsIcon,
      badge: null,
    },
  ] as const;

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 w-64 select-none">
      {/* App Header / Brand */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 shadow-md shadow-indigo-500/20 text-white">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              AI Lead Finder
            </h1>
            <p className="text-xs text-indigo-400 font-medium">Smart Client Acquisition</p>
          </div>
        </div>

        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white lg:hidden rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-900/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-950 text-indigo-300 border border-indigo-800/50'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Theme Toggle & User Footer */}
      <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-900/50">
        {/* Dark/Light Quick Switch */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/80 transition-colors border border-slate-800"
        >
          <div className="flex items-center gap-2">
            {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            <span>{darkMode ? 'Dark Theme' : 'Light Theme'}</span>
          </div>
          <span className="text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-800 rounded">
            Toggle
          </span>
        </button>

        {/* User Profile Card */}
        {user ? (
          <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl space-y-2">
            <div className="flex items-center gap-2.5">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full ring-2 ring-indigo-500/50 object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-100 truncate">
                  {user.displayName || 'Freelance User'}
                </p>
                <p className="text-[10px] text-slate-400 truncate">{user.email || 'Google Account'}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-2 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-300 text-slate-300 rounded-lg text-xs font-medium transition-colors border border-slate-700/50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-900/30 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign in with Google</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative z-10 h-full">{content}</div>
        </div>
      )}
    </>
  );
};
