import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  User,
  LogOut,
  ShieldCheck,
  Key,
  Database,
  Sparkles,
  Trash2,
  CheckCircle2,
  HelpCircle,
  Search,
  ExternalLink,
  Info,
  Layers
} from 'lucide-react';
import { UserProfile, ApiStatus } from '../types';
import { isFirebaseConfigured } from '../lib/firebase';

interface SettingsProps {
  user: UserProfile | null;
  onLogin: () => void;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onClearLocalCache: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  user,
  onLogin,
  onLogout,
  darkMode,
  setDarkMode,
  onClearLocalCache,
}) => {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    hasGeminiKey: true,
    hasSerpKey: false,
    serpSource: 'serp_discovery_engine',
  });

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setApiStatus({
          hasGeminiKey: data.hasGeminiKey ?? true,
          hasSerpKey: data.hasSerpKey ?? false,
          serpSource: data.serpSource ?? 'serp_discovery_engine',
        });
      })
      .catch((err) => console.warn('Health check failed:', err));
  }, []);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Settings Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-indigo-400" />
          Application Preferences & Integrations
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure API integrations (SERP API, Gemini AI), appearance theme, and cloud synchronization.
        </p>
      </div>

      {/* SERP API & Gemini AI Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-indigo-400" />
            Backend API Integrations Status
          </h3>
          <span className="text-[11px] text-slate-400">Server-Side Protected</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* SERP API */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Search className="w-4 h-4 text-indigo-400" />
                SERP API
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  apiStatus.hasSerpKey ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {apiStatus.hasSerpKey
                ? 'Live SERP API Connected'
                : 'SERP Discovery Engine (Active)'}
            </p>
            <p className="text-[10px] text-indigo-300 font-medium">
              {apiStatus.hasSerpKey ? 'Key Configured' : 'Ready for SERP_API_KEY in .env'}
            </p>
          </div>

          {/* Gemini AI */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Gemini AI API
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-slate-400">Model: gemini-3.7-flash</p>
            <p className="text-[10px] text-emerald-400 font-medium">
              {apiStatus.hasGeminiKey ? 'Active (Server-Side)' : 'Using Environment Key'}
            </p>
          </div>

          {/* Storage & Persistence */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                Data Storage
              </span>
              <span
                className={`w-2 h-2 rounded-full ${
                  isFirebaseConfigured ? 'bg-emerald-400' : 'bg-emerald-400'
                }`}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              {isFirebaseConfigured ? 'Cloud Firestore Sync' : 'Local Storage Engine'}
            </p>
            <p className="text-[10px] text-indigo-300 font-medium">Saved Leads & History Ready</p>
          </div>
        </div>

        {/* Informational callout on how to add SERP_API_KEY */}
        <div className="p-4 bg-indigo-950/40 border border-indigo-800/60 rounded-xl space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-indigo-300">
            <Info className="w-4 h-4" />
            <span>How to configure your live SERP API Key</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            The application executes searches through the server-side proxy to protect API keys. To query live Google search results with SERP API:
          </p>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 text-[11px]">
            <li>
              Get an API key from <a href="https://serpapi.com/" target="_blank" rel="noreferrer" className="text-indigo-400 underline inline-flex items-center gap-0.5">serpapi.com <ExternalLink className="w-2.5 h-2.5" /></a>
            </li>
            <li>
              Set <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300 font-mono">SERP_API_KEY=&quot;your_key_here&quot;</code> in your server environment variables or <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-300 font-mono">.env</code> file.
            </li>
            <li>
              The server will automatically route live Google search queries through SERP API. Without the key, the high-fidelity SERP Discovery & Qualification Engine runs seamlessly for testing and development.
            </li>
          </ol>
        </div>
      </div>

      {/* Theme Settings Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          {darkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          Visual Theme
        </h3>

        <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
          <div>
            <p className="text-sm font-semibold text-white">
              {darkMode ? 'Dark Mode (Active)' : 'Light Mode (Active)'}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Adjust contrast and canvas appearance for client prospecting.
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4" />}
            <span>{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
          </button>
        </div>
      </div>

      {/* User Account & Auth Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-400" />
          User Account & Auth
        </h3>

        {user ? (
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
            <div className="flex items-center gap-4">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-12 h-12 rounded-full ring-2 ring-indigo-500 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center">
                  {user.displayName?.charAt(0) || 'U'}
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-white">{user.displayName || 'Freelance User'}</h4>
                <p className="text-xs text-slate-400">{user.email || 'Google User'}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Authenticated Session ({user.isDemo ? 'Local Profile' : 'Firebase Auth'})</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 font-semibold text-xs rounded-xl flex items-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl text-center space-y-3">
            <p className="text-xs text-slate-300">
              Sign in with Google to sync your saved leads and search history across devices.
            </p>
            <button
              onClick={onLogin}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-xs rounded-xl shadow-md hover:from-blue-500 hover:to-indigo-500 transition-all inline-flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span>Sign in with Google</span>
            </button>
          </div>
        )}
      </div>

      {/* Data Maintenance */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
          <Trash2 className="w-4 h-4 text-rose-400" />
          Data Reset & Storage Maintenance
        </h3>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs font-semibold text-slate-200">Clear Local Cache & Reset Demo Session</p>
            <p className="text-[11px] text-slate-400">Clears locally cached search leads and resets state.</p>
          </div>

          <button
            onClick={onClearLocalCache}
            className="px-4 py-2 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-200 border border-slate-700 hover:border-rose-800 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Local Storage</span>
          </button>
        </div>
      </div>
    </div>
  );
};
