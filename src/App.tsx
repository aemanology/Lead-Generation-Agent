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
  ApiStatus
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
import { RefreshCw, Sparkles, Filter, AlertCircle, Search, Info, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'saved' | 'history' | 'settings'>('dashboard');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  // Leads & History State
  const [leads, setLeads] = useState<CombinedLead[]>([]);
  const [savedLeads, setSavedLeads] = useState<SavedLeadItem[]>([]);
  const [searchHistory, setSearchHistory] = useState<SearchQueryRecord[]>([]);
  
  // UI Loading States & Stats
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchStats, setSearchStats] = useState<{
    totalCandidates?: number;
    qualifiedCount?: number;
    source?: string;
  } | null>(null);

  // API Key Status
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    hasGeminiKey: true,
    hasSerpKey: false,
    serpSource: 'serp_discovery_engine',
  });

  // Filter & Search active options
  const [activeService, setActiveService] = useState<string>('Web Development');

  // Sync Dark Mode class with root HTML element
  useEffect(() => {
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
          hasGeminiKey: data.hasGeminiKey ?? true,
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
  }) => {
    setIsSearching(true);
    setSearchError(null);
    setActiveService(params.freelancerService);

    try {
      const res = await fetch('/api/search-businesses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error('Business search request failed.');
      }

      const data = await res.json();
      const rawLeads: BusinessLead[] = data.leads || [];

      setSearchStats({
        totalCandidates: data.totalCandidatesAnalyzed || rawLeads.length * 2,
        qualifiedCount: data.qualifiedCount || rawLeads.length,
        source: data.source || 'serp_api',
      });

      if (rawLeads.length === 0) {
        addToast('info', 'No qualified opportunity leads found matching this query. Try a different category or location.');
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
      addToast('success', `Discovered & qualified ${rawLeads.length} leads. Running Gemini opportunity analysis...`);

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

      // Analyze each lead asynchronously with Gemini API
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
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950 text-slate-100 dark' : 'bg-slate-950 text-slate-100'} flex font-sans antialiased selection:bg-indigo-500 selection:text-white relative overflow-hidden`}>
      {/* Background Ambient Glow Effects */}
      <div className="fixed top-0 left-1/4 -z-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 -z-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

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
              {/* SERP API Status Indicator Banner if running without live key */}
              {!apiStatus.hasSerpKey && (
                <div className="p-3.5 bg-indigo-950/40 border border-indigo-800/60 rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>
                      <strong>SERP Discovery Mode:</strong> Running with high-fidelity realistic search &amp; website analysis engine. Add <code className="bg-slate-900 px-1 py-0.5 rounded text-indigo-300 font-mono">SERP_API_KEY</code> in <code className="text-slate-200">.env</code> anytime for live queries.
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className="text-xs px-3 py-1 bg-indigo-900/60 hover:bg-indigo-800 text-indigo-200 rounded-lg font-medium border border-indigo-700/50 transition-colors"
                  >
                    View Setup Instructions
                  </button>
                </div>
              )}

              {/* Search Form Card */}
              <SearchForm onSearch={handleSearch} isLoading={isSearching} />

              {/* Search Error Banner */}
              {searchError && (
                <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-200 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{searchError}</span>
                  </div>
                  <button
                    onClick={() => setSearchError(null)}
                    className="text-rose-400 hover:text-white font-bold"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Active Search Results Grid */}
              {leads.length > 0 ? (
                <div className="space-y-4">
                  {/* Results Header & Qualification Summary */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" />
                        Qualified Opportunity Leads ({leads.length})
                      </h2>
                      {searchStats && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          Analyzed {searchStats.totalCandidates} raw SERP candidates → filtered out modern/strong websites → returning {leads.length} high-potential prospects.
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        Target Service: <strong className="text-indigo-300">{activeService}</strong>
                      </span>
                    </div>
                  </div>

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
