import React, { useState } from 'react';
import { Search, Building2, MapPin, Briefcase, Hash, Sparkles, RefreshCw } from 'lucide-react';
import { DiscoverySourceFilter } from '../types';

interface SearchFormProps {
  onSearch: (params: {
    businessType: string;
    location: string;
    freelancerService: string;
    numberOfLeads: number;
    discoverySource: DiscoverySourceFilter;
  }) => void;
  isLoading: boolean;
}

const FREELANCER_SERVICES = [
  'Web Development',
  'Website Redesign',
  'E-commerce',
  'AI Automation',
  'Business Automation',
  'Graphic Design & Branding',
  'Social Media Marketing',
  'SEO & Organic Search',
  'Mobile App Development',
];

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [businessType, setBusinessType] = useState('Bakery');
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
      discoverySource: 'all',
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-md dark:shadow-xl relative overflow-hidden transition-colors duration-200">
      {/* Accent Top Gradient Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500" />

      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          Find High-Opportunity Business Leads
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Find local businesses that need your services, assess opportunities, and generate tailored client pitches.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Business Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Business Type
            </label>
            <input
              type="text"
              required
              value={businessType}
              onChange={(e) => setBusinessType(e.target.value)}
              placeholder="e.g. Bakery, Boutique, Studio"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Location
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New York, Austin, London"
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Freelancer Service */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Freelancer Service
            </label>
            <select
              value={freelancerService}
              onChange={(e) => setFreelancerService(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none transition-all"
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
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Target Qualified Leads
            </label>
            <select
              value={numberOfLeads}
              onChange={(e) => setNumberOfLeads(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-900 dark:text-slate-100 outline-none transition-all"
            >
              <option value={5}>5 Qualified Leads</option>
              <option value={10}>10 Qualified Leads</option>
              <option value={15}>15 Qualified Leads</option>
              <option value={20}>20 Qualified Leads</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-600 hover:from-blue-500 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Searching &amp; Qualifying Leads...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Find Qualified Leads</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
