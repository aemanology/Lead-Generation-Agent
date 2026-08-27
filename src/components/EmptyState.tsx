import React from 'react';
import { Search, Sparkles, Building2, ShieldCheck, Mail, Cpu, Filter } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 border-dashed rounded-3xl p-10 sm:p-16 text-center space-y-6 max-w-2xl mx-auto my-8">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-xl">
        <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Ready to Find High-Opportunity Business Leads?
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Enter your target business niche, city, and freelancer service.
          We search candidate businesses via SERP, audit their digital presence, filter out strong websites, and generate tailored Gemini outreach.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
            <Search className="w-4 h-4 text-indigo-400" />
            <span>1. SERP Discovery</span>
          </div>
          <p className="text-[11px] text-slate-400">Pulls candidate businesses and public web search listings.</p>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>2. Digital Audit &amp; Filter</span>
          </div>
          <p className="text-[11px] text-slate-400">Verifies web presence &amp; filters out businesses with strong modern sites.</p>
        </div>

        <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>3. Evidence-Driven Pitch</span>
          </div>
          <p className="text-[11px] text-slate-400">Gemini generates cold emails &amp; offers strictly using verified facts.</p>
        </div>
      </div>
    </div>
  );
};
