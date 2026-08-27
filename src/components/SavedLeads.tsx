import React, { useState } from 'react';
import {
  Bookmark,
  Search,
  Trash2,
  Copy,
  Check,
  Download,
  Mail,
  MapPin,
  Globe,
  Phone,
  Sparkles,
  Filter,
  FileSpreadsheet,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';
import { SavedLeadItem } from '../types';

interface SavedLeadsProps {
  savedLeads: SavedLeadItem[];
  onDeleteSavedLead: (leadId: string) => void;
  onCopyEmail: (subject: string, body: string) => void;
}

export const SavedLeads: React.FC<SavedLeadsProps> = ({
  savedLeads,
  onDeleteSavedLead,
  onCopyEmail,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [minScore, setMinScore] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Categories list
  const categories = Array.from(
    new Set(savedLeads.map((item) => item.business.category))
  );

  // Filtered saved leads
  const filteredLeads = savedLeads.filter((item) => {
    const matchesSearch =
      item.business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.business.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.business.address || item.business.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.freelancerService.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.business.whyFoundReason || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || item.business.category === categoryFilter;

    const matchesScore =
      (item.analysis?.opportunityScore || 0) >= minScore;

    return matchesSearch && matchesCategory && matchesScore;
  });

  const handleCopy = (id: string, subject: string, body: string) => {
    onCopyEmail(subject, body);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // CSV Export helper
  const exportToCSV = () => {
    if (savedLeads.length === 0) return;

    const headers = [
      'Business Name',
      'Category',
      'Location',
      'Website',
      'Phone',
      'Email',
      'Why Found Reason',
      'Opportunity Score',
      'Lead Classification',
      'Why This Is An Opportunity',
      'Identified Problems',
      'Recommended Service',
      'Recommended Offer',
      'Email Subject',
      'Cold Email',
      'Saved Date',
    ];

    const rows = filteredLeads.map((lead) => [
      `"${(lead.business.name || '').replace(/"/g, '""')}"`,
      `"${(lead.business.category || '').replace(/"/g, '""')}"`,
      `"${(lead.business.address || lead.business.location || '').replace(/"/g, '""')}"`,
      `"${lead.business.website || ''}"`,
      `"${lead.business.phone || ''}"`,
      `"${lead.business.email || ''}"`,
      `"${(lead.business.whyFoundReason || '').replace(/"/g, '""')}"`,
      lead.analysis?.opportunityScore || '',
      `"${(lead.analysis?.leadClassification || lead.business.preQualification || '').replace(/"/g, '""')}"`,
      `"${(lead.analysis?.whyOpportunity || lead.analysis?.whyGoodLead || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(lead.analysis?.identifiedProblems) ? lead.analysis.identifiedProblems.join(', ') : lead.analysis?.identifiedProblems || '').replace(/"/g, '""')}"`,
      `"${(lead.analysis?.recommendedService || '').replace(/"/g, '""')}"`,
      `"${(lead.analysis?.recommendedOffer || '').replace(/"/g, '""')}"`,
      `"${(lead.analysis?.emailSubject || '').replace(/"/g, '""')}"`,
      `"${(lead.analysis?.coldEmail || '').replace(/"/g, '""')}"`,
      lead.savedAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `qualified_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved leads..."
              className="w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-100 placeholder-slate-500 outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-200 outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Score Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-200 outline-none"
            >
              <option value={0}>All Opportunity Scores</option>
              <option value={8}>Score 8+ Strong Only</option>
              <option value={5}>Score 5+ Possible+</option>
            </select>
          </div>
        </div>

        {/* Export CSV Button */}
        <button
          onClick={exportToCSV}
          disabled={savedLeads.length === 0}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Export {filteredLeads.length} Leads to CSV</span>
        </button>
      </div>

      {/* Saved Leads Cards Grid */}
      {filteredLeads.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Saved Leads Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {savedLeads.length === 0
                ? "You haven't saved any business leads yet. Discover qualified prospects on the Dashboard and click 'Save Lead'."
                : 'No leads match your active filters. Try clearing your search query.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredLeads.map((item) => {
            const isCopied = copiedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {item.business.category}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          Target Service: {item.freelancerService}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mt-1">
                        {item.business.name}
                      </h3>
                    </div>

                    {item.analysis && (
                      <div className="px-2.5 py-1 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold shrink-0">
                        Score: {item.analysis.opportunityScore}/10
                      </div>
                    )}
                  </div>

                  {/* Why Found Badge */}
                  {item.business.whyFoundReason && (
                    <div className="p-2 rounded-lg bg-indigo-950/70 border border-indigo-800/60 text-[11px] text-indigo-300 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="font-bold">Flagged:</span>
                      <span className="truncate">{item.business.whyFoundReason}</span>
                    </div>
                  )}

                  {/* Business Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.business.address || item.business.location}</span>
                    </div>

                    {item.business.website ? (
                      <div className="flex items-center gap-1.5 truncate">
                        <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <a
                          href={item.business.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-400 hover:underline truncate"
                        >
                          {item.business.website.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 truncate text-amber-400/90 font-medium">
                        <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>No website</span>
                      </div>
                    )}

                    {item.business.email && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-[11px] text-slate-300">{item.business.email}</span>
                      </div>
                    )}

                    {item.business.phone && (
                      <div className="flex items-center gap-1.5 truncate">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.business.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* AI Pitch Snapshot */}
                  {item.analysis && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-indigo-300">Subject: {item.analysis.emailSubject}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-3 font-mono leading-relaxed">
                        {item.analysis.coldEmail}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Saved {new Date(item.savedAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {item.analysis && (
                      <button
                        onClick={() =>
                          handleCopy(item.id, item.analysis.emailSubject, item.analysis.coldEmail)
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy Email'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteSavedLead(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Delete Saved Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
