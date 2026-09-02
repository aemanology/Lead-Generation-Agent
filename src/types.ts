export type LeadClassification =
  | 'Strong Opportunity'
  | 'Possible Opportunity'
  | 'Low Opportunity'
  | 'Not a Lead';

export type LeadSource = 'serp' | 'instagram' | 'both' | 'serp_api' | 'serp_discovery_engine';

export type DiscoverySourceFilter = 'all' | 'serp' | 'instagram';

export type EntityType =
  | 'Actual business'
  | 'Business directory'
  | 'Restaurant/booking marketplace'
  | 'Review website'
  | 'Guide/listicle'
  | 'News/article/blog'
  | 'Marketplace'
  | 'SaaS/software provider'
  | 'Agency/service provider'
  | 'Search/aggregator platform'
  | 'Other non-business result';

export interface RejectedItem {
  id: string;
  title: string;
  url?: string;
  entityType: EntityType;
  reason: string;
  confidence: number;
}

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
  source?: LeadSource;
  // Instagram specific metadata
  instagramUsername?: string;
  instagramUrl?: string;
  instagramPostUrl?: string;
  isShoutoutDiscovered?: boolean;
  shoutoutSourceAccount?: string;
  serpUrl?: string;
  whyFoundReason: string; // e.g. "No website detected", "Instagram-only presence", "New business shoutout", etc.
  websiteCheck?: WebsiteCheckResult;
  evidence: string[];
  preQualification: LeadClassification;
  // Entity Validation & Verification
  entityType?: EntityType;
  businessIdentityConfidence?: number; // 0-100%
  verificationSignals?: string[];
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
  discoverySource?: DiscoverySourceFilter;
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
  hasOpenRouterKey: boolean;
  hasSerpKey: boolean;
  serpSource: 'live_serp_api' | 'serp_discovery_engine';
}
