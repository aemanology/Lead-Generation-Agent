import React, { useState } from 'react';
import {
  MapPin,
  Globe,
  Phone,
  Mail,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Trash2,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  FileText,
  ChevronDown,
  ChevronUp,
  Instagram,
  ExternalLink,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { CombinedLead } from '../types';

interface LeadCardProps {
  lead: CombinedLead;
  onCopyEmail: (subject: string, email: string) => void;
  onSaveLead: (lead: CombinedLead) => void;
  onDeleteLead: (leadId: string) => void;
  onReanalyzeLead: (lead: CombinedLead) => void;
  savedIdsSet: Set<string>;
}

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onCopyEmail,
  onSaveLead,
  onDeleteLead,
  onReanalyzeLead,
  savedIdsSet,
}) => {
  const [copied, setCopied] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showObservations, setShowObservations] = useState(false);

  const { business, analysis, isAnalyzing, analysisError } = lead;
  const isSaved = savedIdsSet.has(business.id) || lead.isSaved;

  const handleCopy = () => {
    if (!analysis) return;
    onCopyEmail(analysis.emailSubject, analysis.coldEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getScoreColor = (score: number = 8) => {
    if (score >= 8) {
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
        dot: 'bg-emerald-500',
        label: 'Strong Fit',
      };
    } else if (score >= 5) {
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
        dot: 'bg-amber-500',
        label: 'Moderate Fit',
      };
    }
    return {
      bg: 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-400',
      label: 'Lower Fit',
    };
  };

  const scoreInfo = analysis ? getScoreColor(analysis.opportunityScore) : getScoreColor(8);

  return (
    <div
      id={`lead-card-${business.id}`}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
    >
      {/* 1. Header: Business Name, Location, Category & Lead Score */}
      <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Business Name */}
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight truncate">
              {business.name}
            </h3>

            {/* Category Tag */}
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/50 shrink-0">
              {business.category}
            </span>

            {/* Source Tag if Instagram */}
            {business.source === 'instagram' && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200/80 dark:border-pink-800/50 flex items-center gap-1 shrink-0">
                <Instagram className="w-3 h-3 text-pink-500" />
                Instagram
              </span>
            )}
            {business.source === 'both' && (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/50 flex items-center gap-1 shrink-0">
                <Globe className="w-3 h-3 text-purple-500" />
                Web + Social
              </span>
            )}
          </div>

          {/* Location Subline */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{business.address || business.location}</span>
          </div>
        </div>

        {/* Lead Score Pill */}
        {analysis && (
          <div
            className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold shrink-0 ${scoreInfo.bg}`}
          >
            <span className={`w-2 h-2 rounded-full ${scoreInfo.dot}`} />
            <span>Score: {analysis.opportunityScore}/10</span>
          </div>
        )}
      </div>

      {/* Main Content Body */}
      <div className="p-5 sm:p-6 space-y-5 flex-1">
        {/* 2. Why This Is a Lead */}
        <div className="bg-slate-50/80 dark:bg-slate-950/50 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-3.5 flex items-start gap-3">
          <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/60 rounded-lg text-indigo-700 dark:text-indigo-300 shrink-0 mt-0.5">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div className="space-y-0.5 flex-1 min-w-0">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Why This Is a Lead
            </span>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
              {business.whyFoundReason || 'Identified with actionable digital improvement opportunities.'}
            </p>
          </div>
        </div>

        {/* 3. Online Presence & Contact Channels */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Online Presence &amp; Contact
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* Website Status */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800 truncate">
              <Globe className="w-4 h-4 text-slate-400 shrink-0" />
              {business.website ? (
                <a
                  href={business.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium truncate flex items-center gap-1"
                >
                  <span className="truncate">{business.website.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                </a>
              ) : (
                <span className="text-amber-700 dark:text-amber-400 font-medium">No dedicated website</span>
              )}
            </div>

            {/* Instagram Profile */}
            {(business.instagramUsername || business.instagramUrl) ? (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800 truncate">
                <div className="flex items-center gap-2 truncate">
                  <Instagram className="w-4 h-4 text-pink-500 shrink-0" />
                  <a
                    href={business.instagramUrl || `https://instagram.com/${business.instagramUsername?.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-600 dark:text-pink-400 hover:underline font-semibold font-mono text-[11px] truncate flex items-center gap-1"
                  >
                    <span>{business.instagramUsername || `@${business.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`}</span>
                    <ExternalLink className="w-3 h-3 opacity-60 shrink-0" />
                  </a>
                </div>
                {business.instagramPostUrl && (
                  <a
                    href={business.instagramPostUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-slate-400 hover:text-pink-600 underline shrink-0 ml-1.5"
                  >
                    Post
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800 truncate text-slate-400">
                <Instagram className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                <span>No Instagram linked</span>
              </div>
            )}

            {/* Email */}
            {business.email && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800 truncate">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px] truncate">{business.email}</span>
              </div>
            )}

            {/* Phone */}
            {business.phone && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200/70 dark:border-slate-800 truncate">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-700 dark:text-slate-300 truncate">{business.phone}</span>
              </div>
            )}

            {/* Shoutout source info if any */}
            {business.shoutoutSourceAccount && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 sm:col-span-2 truncate text-xs text-slate-600 dark:text-slate-300">
                <Share2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Found via community post by <strong className="font-mono text-indigo-700 dark:text-indigo-300">@{business.shoutoutSourceAccount.replace(/^@/, '')}</strong></span>
              </div>
            )}
          </div>
        </div>

        {/* 4. Opportunity & Service to Offer (2-Column Grid) */}
        {analysis ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Opportunity Gap */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Opportunity
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  {analysis.whyOpportunity || analysis.whyGoodLead || 'Clear opportunity to build a digital presence and attract customers.'}
                </p>
              </div>

              {/* Identified Problem Points */}
              {Array.isArray(analysis.identifiedProblems) && analysis.identifiedProblems.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 space-y-1">
                  {analysis.identifiedProblems.slice(0, 2).map((prob, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                      <span className="text-amber-500 font-bold">•</span>
                      <span className="truncate">{prob}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Service & Offer */}
            <div className="p-3.5 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 space-y-1.5 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Recommended Service
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  {analysis.recommendedService}
                </p>
                {analysis.recommendedOffer && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {analysis.recommendedOffer}
                  </p>
                )}
              </div>

              <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-[11px]">
                <span className="text-indigo-700 dark:text-indigo-300 font-medium">Ready for pitch</span>
                <span className="text-slate-400">{analysis.leadClassification || 'High Fit'}</span>
              </div>
            </div>
          </div>
        ) : isAnalyzing ? (
          <div className="py-4 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" />
            <span>Generating tailored sales opportunity &amp; pitch...</span>
          </div>
        ) : analysisError ? (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between">
            <span>{analysisError}</span>
            <button
              onClick={() => onReanalyzeLead(lead)}
              className="text-[11px] font-semibold underline ml-2"
            >
              Retry
            </button>
          </div>
        ) : null}

        {/* 5. Progressive Disclosure: Outreach Email */}
        {analysis && (
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => setShowEmail(!showEmail)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Outreach Email Draft
                </span>
                <span className="text-[10px] text-slate-400">({analysis.emailSubject})</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <span>{showEmail ? 'Hide' : 'Preview'}</span>
                {showEmail ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </button>

            {showEmail && (
              <div className="p-4 space-y-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Subject Line
                  </span>
                  <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mt-0.5">
                    {analysis.emailSubject}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Email Message
                  </span>
                  <div className="mt-1 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-sans leading-relaxed whitespace-pre-line">
                    {analysis.coldEmail}
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    onClick={handleCopy}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy Pitch Email'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. Progressive Disclosure: Detailed Observations & Findings */}
        {business.evidence && business.evidence.length > 0 && (
          <div className="border border-slate-100 dark:border-slate-800/80 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowObservations(!showObservations)}
              className="w-full px-3.5 py-2 bg-transparent flex items-center justify-between text-left text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors text-xs"
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-[11px]">
                  View Observations &amp; Verification Signals ({business.evidence.length})
                </span>
              </div>
              {showObservations ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showObservations && (
              <div className="p-3 bg-slate-50/70 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
                <ul className="space-y-1">
                  {business.evidence.map((ev, idx) => (
                    <li key={idx} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{ev}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 7. Footer Action Bar */}
      <div className="px-5 py-3.5 bg-slate-50/80 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Quick Copy Email Button */}
          {analysis && (
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-xs'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Email'}</span>
            </button>
          )}

          {/* Save Lead Button */}
          <button
            onClick={() => onSaveLead(lead)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSaved
                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-600 dark:fill-indigo-300' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save Lead'}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Re-Generate AI Analysis Button */}
          <button
            onClick={() => onReanalyzeLead(lead)}
            title="Re-run AI Analysis"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Dismiss / Delete Lead Button */}
          <button
            onClick={() => onDeleteLead(business.id)}
            title="Dismiss lead from view"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
