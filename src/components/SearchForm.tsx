import React, { useState } from 'react';
import { Search, Building2, MapPin, Briefcase, Hash, Sparkles, RefreshCw, Cpu, CheckCircle } from 'lucide-react';

interface SearchFormProps {
  onSearch: (params: {
    businessType: string;
    location: string;
    freelancerService: string;
    numberOfLeads: number;
  }) => void;
  isLoading: boolean;
}

const FREELANCER_SERVICES = [
  'Web Development',
  'Website Redesign',
  'E-commerce',
  'AI Automation',
  'Business Automation',
  'Mobile App Development',
  'Digital Products',
];

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [businessType, setBusinessType] = useState('Restaurant');
  const [location, setLocation] = useState('New York');
  const [freelancerService, setFreelancerService] = useState('Web Development');
  const [numberOfLeads, setNumberOfLeads] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessType.trim() || !location.trim() || !freelancerService.trim()) return;

    onSearch({
      businessType: businessType.trim(),
      location: location.trim(),
      freelancerService: freelancerService.trim(),
      numberOfLeads: Number(numberOfLeads) || 10,
    });
  };

  const setPreset = (bType: string, loc: string, service: string) => {
    setBusinessType(bType);
    setLocation(loc);
    setFreelancerService(service);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Accent Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-400" />
            SERP Lead Discovery & Qualification
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Searches candidate businesses via SERP, verifies web presence, filters out strong sites, and qualifies high-opportunity leads.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Presets:
          </span>
          <button
            type="button"
            onClick={() => setPreset('Restaurant', 'New York', 'Web Development')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors border border-slate-700/60"
          >
            NYC Restaurants (Web Dev)
          </button>
          <button
            type="button"
            onClick={() => setPreset('Dental Clinic', 'Austin', 'Website Redesign')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors border border-slate-700/60"
          >
            Austin Dental (Redesign)
          </button>
          <button
            type="button"
            onClick={() => setPreset('Boutique Store', 'Chicago', 'E-commerce')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors border border-slate-700/60"
          >
            Chicago Store (E-com)
          </button>
          <button
            type="button"
            onClick={() => setPreset('Real Estate Agency', 'Miami', 'AI Automation')}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 transition-colors border border-slate-700/60"
          >
            Miami Real Estate (AI Auto)
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Business Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              Business Type
            </label>
            <input
              type="text"
              required
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="e.g. Restaurant, Dental Clinic"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New York, Austin, Chicago"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Freelancer Service */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              Freelancer Service
            </label>
            <select
              value={freelancerService}
              onChange={(e) => setFreelancerService(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-100 outline-none transition-all"
            >
              {FREELANCER_SERVICES.map((srv) => (
                <option key={srv} value={srv}>
                  {srv}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Leads */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-400" />
              Target Qualified Leads
            </label>
            <select
              value={numberOfLeads}
              onChange={(e) => setNumberOfLeads(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-100 outline-none transition-all"
            >
              <option value={5}>5 Qualified Leads</option>
              <option value={10}>10 Qualified Leads</option>
              <option value={15}>15 Qualified Leads</option>
              <option value={20}>20 Qualified Leads</option>
            </select>
          </div>
        </div>

        {/* Pipeline Information Pill */}
        <div className="p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              Pipeline:
            </span>
            <span className="bg-slate-900 px-2 py-0.5 rounded text-indigo-300 border border-slate-800">1. SERP Search</span>
            <span>→</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded text-indigo-300 border border-slate-800">2. Website Verification</span>
            <span>→</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded text-amber-300 border border-slate-800">3. Opportunity Qualification</span>
            <span>→</span>
            <span className="bg-slate-900 px-2 py-0.5 rounded text-emerald-300 border border-slate-800">4. Gemini Outreach</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Quality-First (Irrelevant businesses filtered)</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running SERP Discovery & AI Qualification...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Discover & Qualify Leads with SERP + Gemini</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
