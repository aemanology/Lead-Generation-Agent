export type LeadClassification =
  | 'Strong Opportunity'
  | 'Possible Opportunity'
  | 'Low Opportunity'
  | 'Not a Lead';

export interface WebsiteCheckResult {
  hasWebsite: boolean;
  websiteUrl?: string;
  isReachable?: boolean;
  httpStatus?: number;
  isMobileResponsive?: boolean | 'Unknown';
  hasBookingSystem?: boolean | 'Unknown';
  hasEcommerce?: boolean | 'Unknown';
  hasAutomatedChatOrPortal?: boolean | 'Unknown';
  technologyDetected?: string[];
  socialProfiles?: { platform: string; url: string }[];
  reachabilityNote?: string;
}

export interface BusinessLead {
  id: string;
  name: string;
  category: string;
  location: string;
  address: string;
  website?: string;
  phone?: string;
  email?: string;
  snippet?: string;
  searchTitle?: string;
  searchRank?: number;
  source?: 'serp_api' | 'serp_discovery_engine';
  whyFoundReason: string; // e.g. "No website detected", "Social-only presence", "Website appears outdated", "No online booking detected", "Potential automation opportunity"
  websiteCheck?: WebsiteCheckResult;
  evidence: string[];
  preQualification: LeadClassification;
}

export interface AIAnalysis {
  opportunityScore: number; // 1-10
  leadClassification: LeadClassification;
  identifiedProblems: string[] | string;
  whyOpportunity: string; // Why this is an opportunity based on evidence
  whyGoodLead?: string; // Backwards-compatible alias
  recommendedService: string;
  recommendedOffer: string;
  coldEmail: string;
  emailSubject: string;
  evidenceUsed?: string[];
  analyzedAt?: string;
}

export interface CombinedLead {
  business: BusinessLead;
  analysis?: AIAnalysis;
  isAnalyzing?: boolean;
  analysisError?: string;
  isSaved?: boolean;
  savedId?: string;
}

export interface SavedLeadItem {
  id: string;
  userId: string;
  business: BusinessLead;
  analysis: AIAnalysis;
  freelancerService: string;
  savedAt: string; // ISO string
}

export interface SearchQueryRecord {
  id: string;
  userId: string;
  businessType: string;
  location: string;
  freelancerService: string;
  numberOfLeads: number;
  resultsCount: number;
  timestamp: string; // ISO string
}

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isDemo?: boolean;
}

export interface ApiStatus {
  hasGeminiKey: boolean;
  hasSerpKey: boolean;
  serpSource: 'live_serp_api' | 'serp_discovery_engine';
}
