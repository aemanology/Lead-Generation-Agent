import React from 'react';
import { Menu, LogIn, LogOut, Moon, Sun } from 'lucide-react';
import { UserProfile } from '../types';

interface TopNavProps {
  activeTab: 'dashboard' | 'saved' | 'history' | 'settings';
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenMobileMenu: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  user,
  onLogin,
  onLogout,
  darkMode,
  setDarkMode,
  onOpenMobileMenu,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'Find Business Leads',
          subtitle: 'Search targeted prospects and generate personalized outreach pitches.',
        };
      case 'saved':
        return {
          title: 'Saved Leads Directory',
          subtitle: 'Manage your high-value saved prospects and export outreach lists.',
        };
      case 'history':
        return {
          title: 'Search History',
          subtitle: 'Review past client queries and re-run lead extraction anytime.',
        };
      case 'settings':
        return {
          title: 'Account Settings',
          subtitle: 'Configure dark theme preferences, API keys, and account authentication.',
        };
    }
  };

  const { title, subtitle } = getTabTitle();

  return (
    <header className="sticky top-0 z-30 bg-white/85 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 py-4 flex items-center justify-between transition-colors duration-200">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            {title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/80 transition-all flex items-center gap-1.5 text-xs font-semibold shadow-xs"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline text-slate-300">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline text-slate-700">Dark</span>
            </>
          )}
        </button>

        {/* User Auth Action */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'User'}
                className="w-8 h-8 rounded-full ring-2 ring-indigo-500/50 object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                {user.displayName?.charAt(0) || 'U'}
              </div>
            )}
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200 hidden md:block max-w-[120px] truncate">
              {user.displayName || 'Freelance Pro'}
            </span>
            <button
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-900/30 transition-all"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
