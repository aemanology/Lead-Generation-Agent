import React, { useState } from 'react';
import {
  Building2,
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
  Tag,
  ShieldAlert,
  Search,
  CheckCircle2,
  Share2
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
  const [expanded, setExpanded] = useState(true);

  const { business, analysis, isAnalyzing, analysisError } = lead;
  const isSaved = savedIdsSet.has(business.id) || lead.isSaved;

  const handleCopy = () => {
    if (!analysis) return;
    onCopyEmail(analysis.emailSubject, analysis.coldEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getScoreBadge = (score: number = 8) => {
    if (score >= 8) {
      return {
        bg: 'bg-emerald-950/90 border-emerald-700/80 text-emerald-300',
        text: 'Strong Opportunity',
        dot: 'bg-emerald-400',
      };
    } else if (score >= 5) {
      return {
        bg: 'bg-amber-950/90 border-amber-700/80 text-amber-300',
        text: 'Possible Opportunity',
        dot: 'bg-amber-400',
      };
    } else {
      return {
        bg: 'bg-rose-950/90 border-rose-700/80 text-rose-300',
        text: 'Low Opportunity',
        dot: 'bg-rose-400',
      };
    }
  };

  const getWhyFoundBadge = (reason: string = '') => {
    const r = reason.toLowerCase();
    if (r.includes('no website') || r.includes('social-only')) {
      return {
        bg: 'bg-purple-950/90 text-purple-300 border-purple-800/80',
        icon: <Globe className="w-3.5 h-3.5 text-purple-400" />
      };
    } else if (r.includes('outdated') || r.includes('mobile') || r.includes('unreachable') || r.includes('broken')) {
      return {
        bg: 'bg-rose-950/90 text-rose-300 border-rose-800/80',
        icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
      };
    } else if (r.includes('booking') || r.includes('ecommerce') || r.includes('ordering')) {
      return {
        bg: 'bg-amber-950/90 text-amber-300 border-amber-800/80',
        icon: <Tag className="w-3.5 h-3.5 text-amber-400" />
      };
    } else if (r.includes('automation')) {
      return {
        bg: 'bg-cyan-950/90 text-cyan-300 border-cyan-800/80',
        icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
      };
    }
    return {
      bg: 'bg-indigo-950/90 text-indigo-300 border-indigo-800/80',
      icon: <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
    };
  };

  const scoreInfo = analysis ? getScoreBadge(analysis.opportunityScore) : null;
  const whyBadge = getWhyFoundBadge(business.whyFoundReason);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-lg transition-all hover:border-slate-700 overflow-hidden flex flex-col">
      {/* Business Header & Why Found Flag */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/95 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                {business.category}
              </span>

              {/* SERP Search Source Pill */}
              <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {business.source === 'serp_api' ? 'Live SERP Result' : 'SERP Discovery Engine'}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              {business.name}
            </h3>
          </div>

          {/* Opportunity Score Badge */}
          {analysis && scoreInfo && (
            <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold shrink-0 ${scoreInfo.bg}`}>
              <span className={`w-2 h-2 rounded-full ${scoreInfo.dot} animate-pulse`} />
              <span>Score: {analysis.opportunityScore}/10</span>
            </div>
          )}
        </div>

        {/* Why Lead Was Found - Prominent Tag */}
        <div className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${whyBadge.bg}`}>
          {whyBadge.icon}
          <div>
            <span className="font-bold mr-1">Why Found:</span>
            <span className="font-medium">{business.whyFoundReason}</span>
          </div>
        </div>

        {/* Business Contact & Web Presence Metadata */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{business.address || business.location}</span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {business.website ? (
              <a
                href={business.website}
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:underline truncate"
              >
                {business.website.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <span className="text-amber-400/90 font-medium">No dedicated website</span>
            )}
          </div>

          {business.phone && (
            <div className="flex items-center gap-2 truncate">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{business.phone}</span>
            </div>
          )}

          {business.email && (
            <div className="flex items-center gap-2 truncate">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-300 font-mono text-[11px]">{business.email}</span>
            </div>
          )}
        </div>
      </div>

      {/* AI & Qualification Analysis Body */}
      <div className="p-5 flex-1 space-y-4 bg-slate-950/40">
        {/* Technical Evidence Badges */}
        {business.evidence && business.evidence.length > 0 && (
          <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl space-y-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-indigo-400" />
              Verified Evidence from SERP & Website Check
            </span>
            <ul className="space-y-1">
              {business.evidence.map((ev, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isAnalyzing ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-3 bg-indigo-950 rounded-2xl border border-indigo-800 animate-bounce">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-spin" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Analyzing Prospect with Gemini AI...</p>
              <p className="text-xs text-slate-400 mt-1">Generating evidence-backed opportunity score & cold email</p>
            </div>
          </div>
        ) : analysisError ? (
          <div className="p-4 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-200 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-300">
              <AlertTriangle className="w-4 h-4" />
              <span>Analysis Error</span>
            </div>
            <p>{analysisError}</p>
            <button
              onClick={() => onReanalyzeLead(lead)}
              className="px-3 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded-lg font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry Analysis</span>
            </button>
          </div>
        ) : analysis ? (
          <>
            {/* Why This Is An Opportunity & Lead Classification */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Why This Is An Opportunity
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                    {analysis.leadClassification || business.preQualification || 'Qualified Lead'}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                  {analysis.whyOpportunity || analysis.whyGoodLead}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Identified Problems */}
                <div>
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Identified Problems
                  </span>
                  <div className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                    {Array.isArray(analysis.identifiedProblems) ? (
                      analysis.identifiedProblems.map((prob, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{prob}</span>
                        </div>
                      ))
                    ) : (
                      <p>{Array.isArray(analysis.identifiedProblems) ? analysis.identifiedProblems.join(', ') : analysis.identifiedProblems}</p>
                    )}
                  </div>
                </div>

                {/* Recommended Service & Offer */}
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Recommended Offer
                  </span>
                  <div className="bg-emerald-950/40 border border-emerald-800/50 p-2.5 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-emerald-300">{analysis.recommendedService}</p>
                    {analysis.recommendedOffer && (
                      <p className="text-[11px] text-slate-300">{analysis.recommendedOffer}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Cold Email Accordion */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900">
              <div
                onClick={() => setExpanded(!expanded)}
                className="px-3.5 py-2.5 bg-slate-800/80 flex items-center justify-between cursor-pointer hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-200">
                    Personalized Outreach Email (&lt;120 words)
                  </span>
                </div>
                {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </div>

              {expanded && (
                <div className="p-3.5 space-y-2.5 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Subject Line:
                    </span>
                    <p className="font-semibold text-indigo-300 mt-0.5">
                      {analysis.emailSubject}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Cold Email Pitch:
                    </span>
                    <p className="text-slate-300 whitespace-pre-line mt-1 font-mono text-[11px] leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
                      {analysis.coldEmail}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="py-4 text-center">
            <button
              onClick={() => onReanalyzeLead(lead)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl flex items-center gap-2 mx-auto"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Sales Analysis</span>
            </button>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="p-3.5 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Copy Email Button */}
          {analysis && (
            <button
              onClick={handleCopy}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Email'}</span>
            </button>
          )}

          {/* Save Lead Button */}
          <button
            onClick={() => onSaveLead(lead)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isSaved
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/30'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-indigo-300' : ''}`} />
            <span>{isSaved ? 'Saved in Library' : 'Save Lead'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Re-Generate AI Analysis Button */}
          <button
            onClick={() => onReanalyzeLead(lead)}
            title="Re-run AI Opportunity Analysis"
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Delete Lead Button */}
          <button
            onClick={() => onDeleteLead(business.id)}
            title="Remove Lead from this search view"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
