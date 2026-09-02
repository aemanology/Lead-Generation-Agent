import React from 'react';
import { Sparkles } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl p-10 sm:p-16 text-center space-y-6 max-w-2xl mx-auto my-8 shadow-sm transition-colors">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-500/10 via-indigo-500/15 to-purple-500/10 dark:from-blue-600/20 dark:via-indigo-600/20 dark:to-purple-600/20 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mx-auto shadow-sm dark:shadow-xl">
        <Sparkles className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-pulse" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Ready to Find High-Opportunity Business Leads?
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Enter a business type and location to find local businesses that need your services, along with tailored email pitches ready to send.
        </p>
      </div>
    </div>
  );
};
