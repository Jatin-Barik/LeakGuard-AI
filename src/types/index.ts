export type SubscriptionFrequency =
  | "weekly"
  | "monthly"
  | "quarterly"
  | "annual"
  | "unknown";

export type SubscriptionCategory =
  | "streaming"
  | "music"
  | "cloud"
  | "fitness"
  | "insurance"
  | "software"
  | "gaming"
  | "news"
  | "utilities"
  | "loan"
  | "other";

export type RecommendationAction =
  | "cancel"
  | "downgrade"
  | "pause"
  | "negotiate"
  | "bundle"
  | "keep";

export interface Transaction {
  id: string;
  merchant: string;
  date: string;
  amount: number;
  category: SubscriptionCategory;
  isRecurring: boolean;
  frequency?: SubscriptionFrequency;
  confidence: number;
  description?: string;
}

export interface Subscription {
  id: string;
  name: string;
  merchant: string;
  amount: number;
  previousAmount?: number;
  frequency: SubscriptionFrequency;
  category: SubscriptionCategory;
  lastCharge: string;
  nextCharge?: string;
  isActive: boolean;
  isDuplicate?: boolean;
  duplicateGroup?: string;
  priceHikePercent?: number;
  usageScore?: number;
  confidence: number;
  logo?: string;
}

export interface PriceHike {
  id: string;
  subscriptionId: string;
  merchant: string;
  oldAmount: number;
  newAmount: number;
  changePercent: number;
  detectedAt: string;
  impact: "low" | "medium" | "high";
}

export interface DuplicateGroup {
  id: string;
  category: string;
  subscriptions: Subscription[];
  monthlyWaste: number;
  recommendation: string;
}

export interface Recommendation {
  id: string;
  action: RecommendationAction;
  title: string;
  description: string;
  subscriptionId?: string;
  merchant?: string;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  confidence: number;
  reason: string;
  priority: "low" | "medium" | "high";
}

export interface LeakScoreBreakdown {
  overall: number;
  unusedSubscriptions: number;
  duplicateSubscriptions: number;
  priceHikes: number;
  largeExpenses: number;
  spendingTrend: number;
  reasoning: string[];
}

export interface DashboardStats {
  totalMonthlySpend: number;
  activeSubscriptions: number;
  potentialSavings: number;
  leakScore: number;
  highestExpense: { name: string; amount: number };
  biggestPriceIncrease: { name: string; percent: number };
  annualWaste: number;
  projectedSavings: number;
}

export interface MonthlySpending {
  month: string;
  total: number;
  subscriptions: number;
  other: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  count: number;
  color: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export interface UploadFile {
  id: string;
  name: string;
  type: "pdf" | "csv" | "excel" | "sms" | "email";
  size: number;
  status: "pending" | "processing" | "completed" | "error";
  progress: number;
  uploadedAt: string;
  transactionsExtracted?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  memberSince: string;
  totalSaved: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}
