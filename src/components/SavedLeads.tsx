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
  AlertTriangle,
  Instagram,
  Share2,
  ExternalLink
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
  const [sourceFilter, setSourceFilter] = useState('all');
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
      (item.business.instagramUsername || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.business.whyFoundReason || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || item.business.category === categoryFilter;

    const matchesSource =
      sourceFilter === 'all' ||
      (sourceFilter === 'serp' && (item.business.source === 'serp_api' || !item.business.source)) ||
      (sourceFilter === 'instagram' && item.business.source === 'instagram') ||
      (sourceFilter === 'both' && item.business.source === 'both');

    const matchesScore =
      (item.analysis?.opportunityScore || 0) >= minScore;

    return matchesSearch && matchesCategory && matchesSource && matchesScore;
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
      'Instagram Handle',
      'Instagram URL',
      'Shoutout Source',
      'Phone',
      'Email',
      'Discovery Source',
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
      `"${lead.business.instagramUsername || ''}"`,
      `"${lead.business.instagramUrl || ''}"`,
      `"${lead.business.shoutoutSourceAccount || ''}"`,
      `"${lead.business.phone || ''}"`,
      `"${lead.business.email || ''}"`,
      `"${lead.business.source || 'serp_api'}"`,
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm dark:shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 flex-wrap">
          {/* Search Input */}
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search saved leads..."
              className="w-full pl-10 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors"
            />
          </div>

          {/* Presence Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none transition-colors"
            >
              <option value="all">All Presence Types</option>
              <option value="serp">Web &amp; Local Listings</option>
              <option value="instagram">Instagram Presence</option>
              <option value="both">Multi-Channel</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none transition-colors"
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
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-slate-800 dark:text-slate-200 outline-none transition-colors"
            >
              <option value={0}>All Scores</option>
              <option value={8}>Score 8+ Strong Only</option>
              <option value={5}>Score 5+ Possible+</option>
            </select>
          </div>
        </div>

        {/* Export CSV Button */}
        <button
          onClick={exportToCSV}
          disabled={savedLeads.length === 0}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Export {filteredLeads.length} Leads to CSV</span>
        </button>
      </div>

      {/* Saved Leads Cards Grid */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Saved Leads Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
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
            const score = item.analysis?.opportunityScore || 8;
            return (
              <div
                key={item.id}
                id={`saved-lead-${item.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden"
              >
                {/* 1. Header: Name, Category, Score */}
                <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                        {item.business.name}
                      </h3>

                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shrink-0">
                        {item.business.category}
                      </span>

                      {item.business.source === 'instagram' && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-pink-50 dark:bg-pink-950 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800 flex items-center gap-1 shrink-0">
                          <Instagram className="w-2.5 h-2.5 text-pink-500" />
                          Instagram
                        </span>
                      )}

                      {item.business.source === 'both' && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shrink-0">
                          Web + Social
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{item.business.address || item.business.location}</span>
                    </div>
                  </div>

                  {item.analysis && (
                    <div className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shrink-0">
                      Score: {score}/10
                    </div>
                  )}
                </div>

                {/* 2. Main Body Content */}
                <div className="p-5 space-y-4 flex-1">
                  {/* Why This Is a Lead */}
                  {item.business.whyFoundReason && (
                    <div className="bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Why This Is a Lead
                        </span>
                        <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed mt-0.5">
                          {item.business.whyFoundReason}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Presence & Contact Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800 truncate">
                      <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {item.business.website ? (
                        <a
                          href={item.business.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 dark:text-indigo-400 hover:underline truncate font-medium"
                        >
                          {item.business.website.replace(/^https?:\/\//, '')}
                        </a>
                      ) : (
                        <span className="text-amber-700 dark:text-amber-400 font-medium">No dedicated website</span>
                      )}
                    </div>

                    {item.business.instagramUsername ? (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800 truncate">
                        <Instagram className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                        <a
                          href={item.business.instagramUrl || `https://instagram.com/${item.business.instagramUsername.replace(/^@/, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-pink-600 dark:text-pink-400 hover:underline font-mono text-[11px] truncate"
                        >
                          @{item.business.instagramUsername.replace(/^@/, '')}
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800 text-slate-400">
                        <Instagram className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                        <span>No Instagram</span>
                      </div>
                    )}

                    {item.business.email && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate">{item.business.email}</span>
                      </div>
                    )}

                    {item.business.phone && (
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800 truncate">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 truncate">{item.business.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Opportunity & Service Offer */}
                  {item.analysis && (
                    <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/50 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold text-[11px] uppercase tracking-wider">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Recommended Service: {item.analysis.recommendedService}</span>
                      </div>
                      {item.analysis.recommendedOffer && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.analysis.recommendedOffer}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Cold Email Snippet */}
                  {item.analysis && (
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Outreach Email: {item.analysis.emailSubject}
                      </span>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                        {item.analysis.coldEmail}
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Footer Controls */}
                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/70 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">
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
                            : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs'
                        }`}
                      >
                        {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{isCopied ? 'Copied' : 'Copy Pitch'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteSavedLead(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
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
