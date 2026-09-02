import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { SearchForm } from './components/SearchForm';
import { LeadCard } from './components/LeadCard';
import { SavedLeads } from './components/SavedLeads';
import { SearchHistory } from './components/SearchHistory';
import { Settings } from './components/Settings';
import { EmptyState } from './components/EmptyState';
import { ToastContainer, ToastMessage } from './components/Toast';
import {
  CombinedLead,
  SavedLeadItem,
  SearchQueryRecord,
  UserProfile,
  BusinessLead,
  AIAnalysis,
  ApiStatus,
  RejectedItem
} from './types';
import {
  subscribeToAuthChanges,
  loginWithGoogle,
  logout,
  saveLead,
  getSavedLeads,
  deleteSavedLead,
  saveSearchHistory,
  getSearchHistory,
  deleteSearchHistoryItem
} from './lib/firebase';
import { RefreshCw, Sparkles, Filter, AlertCircle, Search, Info, ShieldCheck, CheckCircle2, ShieldAlert, ChevronDown, ChevronUp, Ban, ExternalLink } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'saved' | 'history' | 'settings'>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('app_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return false; // Default to light mode or respect user choice
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Leads & History State
  const [leads, setLeads] = useState<CombinedLead[]>([]);
  const [savedLeads, setSavedLeads] = useState<SavedLeadItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchQueryRecord[]>([]);
  
  // UI Loading States & Stats
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showRejectedLog, setShowRejectedLog] = useState<boolean>(false);
  const [rejectedList, setRejectedList] = useState<RejectedItem[]>([]);
  const [searchStats, setSearchStats] = useState<{
    totalCandidates?: number;
    qualifiedCount?: number;
    verifiedActualCount?: number;
    rejectedCount?: number;
    source?: string;
  } | null>(null);

  // API Key Status
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    hasOpenRouterKey: true,
    hasSerpKey: false,
    serpSource: 'serp_discovery_engine',
  });

  // Filter & Search active options
  const [activeService, setActiveService] = useState<string>('Web Development');

  // Sync Dark Mode class with root HTML element & localStorage
  useEffect(() => {
    try {
      localStorage.setItem('app_theme', darkMode ? 'dark' : 'light');
    } catch {
      // Ignored
    }
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Initial API health check
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setApiStatus({
          hasOpenRouterKey: data.hasOpenRouterKey ?? true,
          hasSerpKey: data.hasSerpKey ?? false,
          serpSource: data.serpSource ?? 'serp_discovery_engine',
        });
      })
      .catch((err) => console.warn('Health check failed:', err));
  }, []);

  // Auth Listener & Firestore Initial Fetch
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadUserData(currentUser.uid);
      } else {
        setSavedLeads([]);
        setSearchHistory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      const [saved, history] = await Promise.all([
        getSavedLeads(userId),
        getSearchHistory(userId),
      ]);
      setSavedLeads(saved);
      setSearchHistory(history);
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  };

  // Toast notification trigger
  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Handle Auth login/logout
  const handleLogin = async () => {
    try {
      const profile = await loginWithGoogle();
      setUser(profile);
      addToast('success', `Welcome back, ${profile.displayName || 'Freelancer'}!`);
      loadUserData(profile.uid);
    } catch (err: any) {
      console.error('Login error:', err);
      addToast('error', err.message || 'Failed to sign in with Google.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setSavedLeads([]);
      setSearchHistory([]);
      addToast('info', 'Logged out successfully.');
    } catch {
      addToast('error', 'Logout failed.');
    }
  };

  // Perform Business Search & Trigger AI Analyses
  const handleSearch = async (params: {
    businessType: string;
    location: string;
    freelancerService: string;
    numberOfLeads: number;
    discoverySource?: 'all' | 'serp' | 'instagram';
  }) => {
    setIsSearching(true);
    setSearchError(null);
    setActiveService(params.freelancerService);

    try {
      const res = await fetch('/api/search-businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessType: params.businessType,
          location: params.location,
          freelancerService: params.freelancerService,
          numberOfLeads: params.numberOfLeads,
          discoverySource: params.discoverySource || 'all',
        }),
      });

      if (!res.ok) {
        let errorMessage = 'Business search request failed.';
        try {
          const errData = await res.json();
          if (errData?.error) {
            errorMessage = errData.error;
          }
        } catch {
          // Fallback to default
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      const rawLeads: BusinessLead[] = data.leads || [];
      const rejectedItems: RejectedItem[] = data.rejectedLog || [];

      setRejectedList(rejectedItems);
      setSearchStats({
        totalCandidates: data.totalCandidatesAnalyzed || rawLeads.length + (data.rejectedCount || 0),
        qualifiedCount: data.qualifiedCount || rawLeads.length,
        verifiedActualCount: data.verifiedActualCount || rawLeads.length,
        rejectedCount: data.rejectedCount || (data.rejectedLog ? data.rejectedLog.length : 0),
        source: data.source || 'all',
      });

      if (rawLeads.length === 0) {
        if (data.rejectedCount && data.rejectedCount > 0) {
          addToast('info', `Filtered out ${data.rejectedCount} non-business entities (directories, aggregators, listicles). No direct commercial businesses matched.`);
        } else {
          addToast('info', 'No qualified opportunity leads found matching this query. Try a different category or location.');
        }
        setLeads([]);
        setIsSearching(false);
        return;
      }

      // Initialize combined leads array with analyzing spinners
      const initialCombined: CombinedLead[] = rawLeads.map((b) => ({
        business: b,
        isAnalyzing: true,
      }));

      setLeads(initialCombined);
      addToast('success', `Discovered & qualified ${rawLeads.length} leads. Running opportunity analysis...`);

      // Save query to search history in Firestore
      if (user) {
        const historyRecord = await saveSearchHistory(user.uid, {
          businessType: params.businessType,
          location: params.location,
          freelancerService: params.freelancerService,
          numberOfLeads: params.numberOfLeads,
          resultsCount: rawLeads.length,
        });
        setSearchHistory((prev) => [historyRecord, ...prev]);
      }

      // Analyze each lead asynchronously with OpenRouter API
      for (let i = 0; i < rawLeads.length; i++) {
        const leadItem = rawLeads[i];
        try {
          const aiRes = await fetch('/api/analyze-lead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              business: leadItem,
              freelancerService: params.freelancerService,
            }),
          });

          const aiData = await aiRes.json();
          const analysis: AIAnalysis = aiData.analysis || aiData.fallbackAnalysis;

          setLeads((prev) =>
            prev.map((item) =>
              item.business.id === leadItem.id
                ? { ...item, analysis, isAnalyzing: false }
                : item
            )
          );
        } catch (aiErr) {
          console.error(`AI analysis error for ${leadItem.name}:`, aiErr);
          setLeads((prev) =>
            prev.map((item) =>
              item.business.id === leadItem.id
                ? {
                    ...item,
                    isAnalyzing: false,
                    analysisError: 'AI analysis failed for this lead.',
                  }
                : item
            )
          );
        }
      }
    } catch (err: any) {
      console.error('Search error:', err);
      setSearchError(err.message || 'Failed to search businesses.');
      addToast('error', 'Search failed. Please check network connection.');
    } finally {
      setIsSearching(false);
    }
  };

  // Re-run single lead analysis
  const handleReanalyzeLead = async (lead: CombinedLead) => {
    setLeads((prev) =>
      prev.map((item) =>
        item.business.id === lead.business.id
          ? { ...item, isAnalyzing: true, analysisError: undefined }
          : item
      )
    );

    try {
      const res = await fetch('/api/analyze-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business: lead.business,
          freelancerService: activeService,
        }),
      });

      const data = await res.json();
      const analysis: AIAnalysis = data.analysis || data.fallbackAnalysis;

      setLeads((prev) =>
        prev.map((item) =>
          item.business.id === lead.business.id
            ? { ...item, analysis, isAnalyzing: false }
            : item
        )
      );
      addToast('success', `Re-generated AI analysis for ${lead.business.name}!`);
    } catch {
      setLeads((prev) =>
        prev.map((item) =>
          item.business.id === lead.business.id
            ? { ...item, isAnalyzing: false, analysisError: 'Re-analysis failed.' }
            : item
        )
      );
      addToast('error', 'Failed to re-generate AI analysis.');
    }
  };

  // Copy cold email to clipboard
  const handleCopyEmail = (subject: string, body: string) => {
    const fullText = `Subject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    addToast('success', 'Email subject and body copied to clipboard!');
  };

  // Save Lead to Firestore / LocalStorage
  const handleSaveLead = async (lead: CombinedLead) => {
    if (!lead.analysis) {
      addToast('error', 'Cannot save lead without AI analysis.');
      return;
    }

    const effectiveUser = user || {
      uid: 'demo-user-123',
      displayName: 'Alex Rivers',
      email: 'alex.rivers@freelance.io',
      photoURL: null,
      isDemo: true,
    };

    try {
      const savedItem = await saveLead(effectiveUser.uid, {
        business: lead.business,
        analysis: lead.analysis,
        freelancerService: activeService,
      });

      setSavedLeads((prev) => [savedItem, ...prev.filter((item) => item.id !== savedItem.id)]);
      addToast('success', `${lead.business.name} saved to your leads directory!`);
    } catch {
      addToast('error', 'Failed to save lead.');
    }
  };

  // Delete lead from active current view
  const handleDeleteActiveLead = (leadId: string) => {
    setLeads((prev) => prev.filter((item) => item.business.id !== leadId));
    addToast('info', 'Lead removed from current search view.');
  };

  // Delete saved lead
  const handleDeleteSavedLead = async (leadId: string) => {
    const userId = user?.uid || 'demo-user-123';
    try {
      await deleteSavedLead(userId, leadId);
      setSavedLeads((prev) => prev.filter((item) => item.id !== leadId));
      addToast('info', 'Saved lead deleted.');
    } catch {
      addToast('error', 'Failed to delete saved lead.');
    }
  };

  // Delete history item
  const handleDeleteHistoryItem = async (id: string) => {
    const userId = user?.uid || 'demo-user-123';
    try {
      await deleteSearchHistoryItem(userId, id);
      setSearchHistory((prev) => prev.filter((item) => item.id !== id));
      addToast('info', 'Search history entry deleted.');
    } catch {
      addToast('error', 'Failed to delete history item.');
    }
  };

  // Re-run search from history
  const handleRerunSearchFromHistory = (record: SearchQueryRecord) => {
    setActiveTab('dashboard');
    handleSearch({
      businessType: record.businessType,
      location: record.location,
      freelancerService: record.freelancerService,
      numberOfLeads: record.numberOfLeads,
    });
  };

  // Saved IDs set for bookmark toggles
  const savedIdsSet = new Set(savedLeads.map((s) => s.business.id));

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-50 text-slate-900'} flex font-sans antialiased selection:bg-indigo-500 selection:text-white relative overflow-hidden transition-colors duration-200`}>
      {/* Background Ambient Glow Effects */}
      <div className={`fixed top-0 left-1/4 -z-10 w-96 h-96 ${darkMode ? 'bg-indigo-600/10' : 'bg-indigo-500/5'} rounded-full blur-3xl pointer-events-none`} />
      <div className={`fixed bottom-0 right-1/4 -z-10 w-96 h-96 ${darkMode ? 'bg-purple-600/10' : 'bg-purple-500/5'} rounded-full blur-3xl pointer-events-none`} />

      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={savedLeads.length}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <TopNav
          activeTab={activeTab}
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenMobileMenu={() => setMobileOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Search Form Card */}
              <SearchForm onSearch={handleSearch} isLoading={isSearching} />

              {/* Search Error Banner */}
              {searchError && (
                <div className="p-4 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    <span>{searchError}</span>
                  </div>
                  <button
                    onClick={() => setSearchError(null)}
                    className="text-rose-700 dark:text-rose-400 hover:underline font-bold"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Active Search Results Grid */}
              {leads.length > 0 ? (
                <div className="space-y-4">
                  {/* Results Header & Summary */}
                  <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        Qualified Leads ({leads.length})
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Target Service: <strong className="text-indigo-600 dark:text-indigo-400">{activeService}</strong>
                        {searchStats && ` • ${searchStats.verifiedActualCount || leads.length} verified businesses`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        Verified Businesses
                      </span>
                    </div>
                  </div>

                  {/* Quality Filter Accordion */}
                  {searchStats && (searchStats.rejectedCount || 0) > 0 && (
                    <div className="border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
                      <button
                        onClick={() => setShowRejectedLog(!showRejectedLog)}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>
                            Filtered out <strong className="text-slate-800 dark:text-slate-200">{searchStats.rejectedCount} non-client listings</strong> (directories, blogs, platforms)
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shrink-0 ml-2">
                          <span>{showRejectedLog ? 'Hide' : 'View Excluded'}</span>
                          {showRejectedLog ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>
                      </button>

                      {showRejectedLog && rejectedList.length > 0 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            The following entries were excluded because they are directories or platforms rather than independent prospective businesses:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                            {rejectedList.map((item, rIdx) => (
                              <div
                                key={rIdx}
                                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1 shadow-xs"
                              >
                                <div className="flex items-start justify-between gap-1">
                                  <span className="font-bold text-slate-900 dark:text-white line-clamp-1">{item.title}</span>
                                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 shrink-0">
                                    {item.entityType}
                                  </span>
                                </div>
                                <p className="text-[11px] text-rose-700 dark:text-rose-400 font-medium flex items-center gap-1">
                                  <Ban className="w-3 h-3 shrink-0" />
                                  <span className="truncate">{item.reason}</span>
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {leads.map((lead) => (
                      <LeadCard
                        key={lead.business.id}
                        lead={lead}
                        onCopyEmail={handleCopyEmail}
                        onSaveLead={handleSaveLead}
                        onDeleteLead={handleDeleteActiveLead}
                        onReanalyzeLead={handleReanalyzeLead}
                        savedIdsSet={savedIdsSet}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                !isSearching && <EmptyState />
              )}
            </div>
          )}

          {/* Saved Leads Tab */}
          {activeTab === 'saved' && (
            <SavedLeads
              savedLeads={savedLeads}
              onDeleteSavedLead={handleDeleteSavedLead}
              onCopyEmail={handleCopyEmail}
            />
          )}

          {/* Search History Tab */}
          {activeTab === 'history' && (
            <SearchHistory
              history={searchHistory}
              onRerunSearch={handleRerunSearchFromHistory}
              onDeleteHistoryItem={handleDeleteHistoryItem}
            />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <Settings
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              onClearLocalCache={() => {
                localStorage.clear();
                setSavedLeads([]);
                setSearchHistory([]);
                addToast('info', 'Local storage cleared successfully.');
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}
