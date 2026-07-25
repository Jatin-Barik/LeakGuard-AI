import type {
  Achievement,
  CategoryBreakdown,
  DashboardStats,
  DuplicateGroup,
  LeakScoreBreakdown,
  MonthlySpending,
  PriceHike,
  Recommendation,
  SavingsGoal,
  Subscription,
  Transaction,
  UserProfile,
} from "@/types";

export const demoAccount = {
  email: "demo@leakguard.ai",
  password: "Demo@123",
};

export const demoUser: UserProfile = {
  id: "demo_user_1",
  name: "Alex Morgan",
  email: demoAccount.email,
  avatar: undefined,
  memberSince: "2025-07-25",
  totalSaved: 847.5,
};

const subscriptionSeed: Array<
  Omit<Subscription, "id" | "lastCharge" | "nextCharge" | "confidence"> & {
    day: number;
    confidence?: number;
    inactiveSince?: string;
  }
> = [
  { name: "Netflix Premium", merchant: "Netflix", amount: 13.99, previousAmount: 9.99, frequency: "monthly", category: "streaming", day: 1, isActive: true, priceHikePercent: 40, usageScore: 72 },
  { name: "Spotify Premium", merchant: "Spotify", amount: 11.99, frequency: "monthly", category: "music", day: 3, isActive: true, usageScore: 91 },
  { name: "Amazon Prime", merchant: "Amazon", amount: 14.99, previousAmount: 12.99, frequency: "monthly", category: "streaming", day: 2, isActive: true, priceHikePercent: 15.4, usageScore: 65 },
  { name: "YouTube Premium", merchant: "YouTube", amount: 13.99, frequency: "monthly", category: "streaming", day: 5, isActive: true, isDuplicate: true, duplicateGroup: "video_streaming", usageScore: 26 },
  { name: "Apple Music", merchant: "Apple", amount: 10.99, frequency: "monthly", category: "music", day: 28, isActive: true, isDuplicate: true, duplicateGroup: "music_streaming", usageScore: 12 },
  { name: "YouTube Music", merchant: "Google", amount: 10.99, frequency: "monthly", category: "music", day: 6, isActive: true, isDuplicate: true, duplicateGroup: "music_streaming", usageScore: 23 },
  { name: "Google One 200GB", merchant: "Google One", amount: 2.99, frequency: "monthly", category: "cloud", day: 1, isActive: true, isDuplicate: true, duplicateGroup: "cloud_storage", usageScore: 45 },
  { name: "iCloud+ 2TB", merchant: "Apple", amount: 9.99, frequency: "monthly", category: "cloud", day: 1, isActive: true, isDuplicate: true, duplicateGroup: "cloud_storage", usageScore: 55 },
  { name: "Adobe Creative Cloud", merchant: "Adobe", amount: 54.99, previousAmount: 52.99, frequency: "monthly", category: "software", day: 12, isActive: true, priceHikePercent: 3.8, usageScore: 34 },
  { name: "Canva Pro", merchant: "Canva", amount: 14.99, frequency: "monthly", category: "software", day: 17, isActive: true, usageScore: 22 },
  { name: "Notion Plus", merchant: "Notion", amount: 10, frequency: "monthly", category: "software", day: 8, isActive: true, usageScore: 68 },
  { name: "ChatGPT Plus", merchant: "OpenAI", amount: 20, frequency: "monthly", category: "software", day: 10, isActive: true, usageScore: 88 },
  { name: "Claude Pro", merchant: "Anthropic", amount: 20, frequency: "monthly", category: "software", day: 14, isActive: true, isDuplicate: true, duplicateGroup: "ai_assistants", usageScore: 39 },
  { name: "GitHub Copilot", merchant: "GitHub", amount: 10, frequency: "monthly", category: "software", day: 19, isActive: true, usageScore: 76 },
  { name: "Microsoft 365", merchant: "Microsoft", amount: 9.99, frequency: "monthly", category: "software", day: 21, isActive: true, usageScore: 51 },
  { name: "Dropbox Plus", merchant: "Dropbox", amount: 11.99, frequency: "monthly", category: "cloud", day: 22, isActive: true, isDuplicate: true, duplicateGroup: "cloud_storage", usageScore: 18 },
  { name: "Disney+", merchant: "Disney", amount: 13.99, frequency: "monthly", category: "streaming", day: 15, isActive: true, isDuplicate: true, duplicateGroup: "video_streaming", usageScore: 18 },
  { name: "Uber One", merchant: "Uber", amount: 9.99, frequency: "monthly", category: "other", day: 4, isActive: true, usageScore: 61 },
  { name: "Swiggy One", merchant: "Swiggy", amount: 4.79, frequency: "quarterly", category: "other", day: 9, isActive: true, usageScore: 44 },
  { name: "Zomato Gold", merchant: "Zomato", amount: 3.59, frequency: "quarterly", category: "other", day: 16, isActive: true, isDuplicate: true, duplicateGroup: "food_delivery", usageScore: 14 },
  { name: "Gym Membership", merchant: "Planet Fitness", amount: 24.99, frequency: "monthly", category: "fitness", day: 1, isActive: true, usageScore: 8 },
  { name: "Home Internet", merchant: "Xfinity", amount: 69.99, previousAmount: 59.99, frequency: "monthly", category: "utilities", day: 7, isActive: true, priceHikePercent: 16.7, usageScore: 99 },
  { name: "Electricity Autopay", merchant: "Con Edison", amount: 118.4, frequency: "monthly", category: "utilities", day: 11, isActive: true, usageScore: 100 },
  { name: "Renters Insurance", merchant: "Lemonade", amount: 18.5, frequency: "monthly", category: "insurance", day: 13, isActive: true, usageScore: 100 },
  { name: "Cloud Services", merchant: "AWS", amount: 29.74, frequency: "monthly", category: "cloud", day: 18, isActive: true, usageScore: 31 },
  { name: "Student Loan", merchant: "Nelnet", amount: 186.33, frequency: "monthly", category: "loan", day: 20, isActive: true, usageScore: 100 },
  { name: "Credit Card Bill", merchant: "Chase", amount: 420.25, frequency: "monthly", category: "other", day: 25, isActive: true, usageScore: 100 },
  { name: "NYT Digital", merchant: "New York Times", amount: 17, frequency: "monthly", category: "news", day: 20, isActive: false, inactiveSince: "2026-05-20", usageScore: 15 },
  { name: "Calm Premium", merchant: "Calm", amount: 69.99, frequency: "annual", category: "other", day: 24, isActive: false, inactiveSince: "2026-04-24", usageScore: 5 },
  { name: "Figma Professional", merchant: "Figma", amount: 15, frequency: "monthly", category: "software", day: 27, isActive: true, usageScore: 28 },
];

const monthStarts = [
  "2025-08",
  "2025-09",
  "2025-10",
  "2025-11",
  "2025-12",
  "2026-01",
  "2026-02",
  "2026-03",
  "2026-04",
  "2026-05",
  "2026-06",
  "2026-07",
];

const pad = (value: number) => value.toString().padStart(2, "0");

const dated = (month: string, day: number) => `${month}-${pad(Math.min(day, 28))}`;

const nextChargeDate = (day: number) => `2026-08-${pad(Math.min(day, 28))}`;

export const demoSubscriptions: Subscription[] = subscriptionSeed.map((subscription, index) => ({
  ...subscription,
  id: `sub_${index + 1}`,
  lastCharge: dated("2026-07", subscription.day),
  nextCharge: subscription.isActive ? nextChargeDate(subscription.day) : subscription.inactiveSince,
  confidence: subscription.confidence ?? 0.9 + ((index % 9) * 0.01),
}));

export const demoPriceHikes: PriceHike[] = [
  { id: "ph_1", subscriptionId: "sub_1", merchant: "Netflix", oldAmount: 9.99, newAmount: 13.99, changePercent: 40, detectedAt: "2026-07-01", impact: "high" },
  { id: "ph_2", subscriptionId: "sub_3", merchant: "Amazon Prime", oldAmount: 12.99, newAmount: 14.99, changePercent: 15.4, detectedAt: "2026-01-02", impact: "medium" },
  { id: "ph_3", subscriptionId: "sub_22", merchant: "Home Internet", oldAmount: 59.99, newAmount: 69.99, changePercent: 16.7, detectedAt: "2026-06-07", impact: "high" },
  { id: "ph_4", subscriptionId: "sub_9", merchant: "Adobe", oldAmount: 52.99, newAmount: 54.99, changePercent: 3.8, detectedAt: "2026-04-12", impact: "low" },
];

export const demoPriceTimeline = [
  { merchant: "Netflix", timeline: [{ month: "Jan", amount: 9.99 }, { month: "Feb", amount: 9.99 }, { month: "Mar", amount: 9.99 }, { month: "Apr", amount: 9.99 }, { month: "May", amount: 9.99 }, { month: "Jun", amount: 9.99 }, { month: "Jul", amount: 13.99 }], increasePercent: 40, annualImpact: 48 },
  { merchant: "Home Internet", timeline: [{ month: "Jan", amount: 59.99 }, { month: "Feb", amount: 59.99 }, { month: "Mar", amount: 59.99 }, { month: "Apr", amount: 59.99 }, { month: "May", amount: 59.99 }, { month: "Jun", amount: 69.99 }, { month: "Jul", amount: 69.99 }], increasePercent: 16.7, annualImpact: 120 },
  { merchant: "Amazon Prime", timeline: [{ month: "Jan", amount: 12.99 }, { month: "Feb", amount: 14.99 }, { month: "Mar", amount: 14.99 }, { month: "Apr", amount: 14.99 }, { month: "May", amount: 14.99 }, { month: "Jun", amount: 14.99 }, { month: "Jul", amount: 14.99 }], increasePercent: 15.4, annualImpact: 24 },
];

export const demoDuplicateGroups: DuplicateGroup[] = [
  {
    id: "dg_1",
    category: "Music Streaming",
    subscriptions: demoSubscriptions.filter((subscription) => subscription.duplicateGroup === "music_streaming" || subscription.merchant === "Spotify"),
    monthlyWaste: 21.98,
    recommendation: "Keep Spotify because it has 91% usage. Cancel Apple Music and YouTube Music.",
  },
  {
    id: "dg_2",
    category: "Cloud Storage",
    subscriptions: demoSubscriptions.filter((subscription) => subscription.duplicateGroup === "cloud_storage"),
    monthlyWaste: 21.98,
    recommendation: "Google One covers actual storage needs. Cancel iCloud+ and Dropbox.",
  },
  {
    id: "dg_3",
    category: "Video Streaming",
    subscriptions: demoSubscriptions.filter((subscription) => subscription.duplicateGroup === "video_streaming" || subscription.merchant === "Netflix"),
    monthlyWaste: 27.98,
    recommendation: "Keep Netflix for high usage. Pause Disney+ and YouTube Premium until needed.",
  },
  {
    id: "dg_4",
    category: "AI Assistants",
    subscriptions: demoSubscriptions.filter((subscription) => subscription.duplicateGroup === "ai_assistants" || subscription.merchant === "OpenAI"),
    monthlyWaste: 20,
    recommendation: "Keep ChatGPT Plus as the primary assistant. Review Claude Pro before renewal.",
  },
];

export const demoRecommendations: Recommendation[] = [
  { id: "rec_1", action: "cancel", title: "Cancel Gym Membership", description: "Only two visits were detected in the last 90 days.", subscriptionId: "sub_21", merchant: "Planet Fitness", estimatedMonthlySavings: 24.99, estimatedAnnualSavings: 299.88, confidence: 0.94, reason: "Usage score is 8%, making this the clearest subscription leak.", priority: "high" },
  { id: "rec_2", action: "cancel", title: "Cancel Apple Music and YouTube Music", description: "Three music subscriptions are active while Spotify has the strongest usage.", merchant: "Apple / Google", estimatedMonthlySavings: 21.98, estimatedAnnualSavings: 263.76, confidence: 0.92, reason: "Spotify is used weekly; the other two have low activity and duplicate the same job.", priority: "high" },
  { id: "rec_3", action: "bundle", title: "Consolidate Cloud Storage", description: "Google One, iCloud+, and Dropbox overlap.", merchant: "Google / Apple / Dropbox", estimatedMonthlySavings: 21.98, estimatedAnnualSavings: 263.76, confidence: 0.87, reason: "Actual storage usage is 87GB, so Google One alone covers the need.", priority: "high" },
  { id: "rec_4", action: "downgrade", title: "Downgrade Netflix", description: "Premium plan price rose 40% and 4K viewing is rare.", subscriptionId: "sub_1", merchant: "Netflix", estimatedMonthlySavings: 4, estimatedAnnualSavings: 48, confidence: 0.78, reason: "Most viewing happens on mobile or laptop where the premium tier adds little value.", priority: "medium" },
  { id: "rec_5", action: "negotiate", title: "Request Adobe Retention Discount", description: "Creative Cloud usage is moderate and eligible for a loyalty offer.", subscriptionId: "sub_9", merchant: "Adobe", estimatedMonthlySavings: 15, estimatedAnnualSavings: 180, confidence: 0.71, reason: "Adobe frequently offers retention discounts before cancellation.", priority: "medium" },
  { id: "rec_6", action: "pause", title: "Pause Disney+ for 60 Days", description: "Low recent watch activity and overlap with Netflix and Prime.", subscriptionId: "sub_17", merchant: "Disney", estimatedMonthlySavings: 13.99, estimatedAnnualSavings: 167.88, confidence: 0.84, reason: "Only one watch session was detected in the last 45 days.", priority: "medium" },
  { id: "rec_7", action: "cancel", title: "Remove Zomato Gold", description: "Food delivery benefits duplicate Swiggy One.", subscriptionId: "sub_20", merchant: "Zomato", estimatedMonthlySavings: 3.59, estimatedAnnualSavings: 43.08, confidence: 0.81, reason: "Delivery fee savings did not exceed the membership cost in two of the last three months.", priority: "low" },
  { id: "rec_8", action: "downgrade", title: "Move AWS to Budget Alerts", description: "Small cloud workloads are growing irregularly.", subscriptionId: "sub_25", merchant: "AWS", estimatedMonthlySavings: 9.5, estimatedAnnualSavings: 114, confidence: 0.73, reason: "Spend spikes appear after weekend experiments and can be capped.", priority: "low" },
];

const activeSubscriptions = demoSubscriptions.filter((subscription) => subscription.isActive);
const totalMonthlySpend = Number(activeSubscriptions.reduce((sum, subscription) => sum + subscription.amount, 0).toFixed(2));
const potentialSavings = Number(demoRecommendations.reduce((sum, recommendation) => sum + recommendation.estimatedMonthlySavings, 0).toFixed(2));

export const demoLeakScore: LeakScoreBreakdown = {
  overall: 42,
  unusedSubscriptions: 28,
  duplicateSubscriptions: 35,
  priceHikes: 52,
  largeExpenses: 45,
  spendingTrend: 38,
  reasoning: [
    "6 subscriptions show low usage and can be cancelled, paused, or downgraded.",
    "4 duplicate groups create $91.94/month of avoidable overlap.",
    "Netflix, Internet, Amazon Prime, and Adobe increased prices in the last six months.",
    "Recurring spending increased 18% compared with last month.",
    "Cloud storage is split across three providers while actual usage fits one plan.",
  ],
};

export const demoDashboardStats: DashboardStats = {
  totalMonthlySpend,
  activeSubscriptions: activeSubscriptions.length,
  potentialSavings,
  leakScore: demoLeakScore.overall,
  highestExpense: { name: "Credit Card Bill", amount: 420.25 },
  biggestPriceIncrease: { name: "Netflix", percent: 40 },
  annualWaste: Number((potentialSavings * 12).toFixed(2)),
  projectedSavings: 486,
};

export const demoMonthlySpending: MonthlySpending[] = [
  { month: "Aug", total: 873.46, subscriptions: 285.9, other: 587.56 },
  { month: "Sep", total: 902.14, subscriptions: 294.3, other: 607.84 },
  { month: "Oct", total: 934.72, subscriptions: 306.16, other: 628.56 },
  { month: "Nov", total: 955.2, subscriptions: 319.91, other: 635.29 },
  { month: "Dec", total: 998.85, subscriptions: 344.44, other: 654.41 },
  { month: "Jan", total: 1016.37, subscriptions: 357.38, other: 658.99 },
  { month: "Feb", total: 1042.05, subscriptions: 372.95, other: 669.1 },
  { month: "Mar", total: 1094.42, subscriptions: 397.87, other: 696.55 },
  { month: "Apr", total: 1128.18, subscriptions: 421.44, other: 706.74 },
  { month: "May", total: 1160.64, subscriptions: 447.23, other: 713.41 },
  { month: "Jun", total: 1222.58, subscriptions: 492.11, other: 730.47 },
  { month: "Jul", total: 1442.27, subscriptions: totalMonthlySpend, other: 461.27 },
];

export const demoCategoryBreakdown: CategoryBreakdown[] = [
  { category: "Bills", amount: 795.47, count: 4, color: "#38bdf8" },
  { category: "Software", amount: 184.96, count: 9, color: "#a78bfa" },
  { category: "Streaming", amount: 56.96, count: 5, color: "#f87171" },
  { category: "Cloud", amount: 54.71, count: 4, color: "#34d399" },
  { category: "Music", amount: 33.97, count: 3, color: "#fbbf24" },
  { category: "Lifestyle", amount: 43.36, count: 5, color: "#fb7185" },
];

const everydayMerchants = [
  ["Trader Joe's", "other", 38.42],
  ["Starbucks", "other", 6.45],
  ["Uber", "other", 18.75],
  ["Shell", "utilities", 44.2],
  ["Target", "other", 52.18],
  ["Whole Foods", "other", 64.11],
  ["CVS Pharmacy", "other", 21.3],
  ["Local Cafe", "other", 9.8],
] as const;

function recurringAmount(subscription: Subscription, monthIndex: number) {
  if (subscription.merchant === "Netflix" && monthIndex < 11) return 9.99;
  if (subscription.merchant === "Amazon" && monthIndex < 5) return 12.99;
  if (subscription.merchant === "Xfinity" && monthIndex < 10) return 59.99;
  if (subscription.merchant === "Adobe" && monthIndex < 8) return 52.99;
  if (subscription.frequency === "quarterly") return monthIndex % 3 === 0 ? subscription.amount : 0;
  if (subscription.frequency === "annual") return monthIndex === 8 ? subscription.amount : 0;
  return subscription.amount;
}

function shouldIncludeSubscription(subscription: Subscription, month: string) {
  if (subscription.name === "ChatGPT Plus") return month >= "2026-01";
  if (subscription.name === "Claude Pro") return month >= "2026-03";
  if (subscription.name === "Figma Professional") return month >= "2026-02";
  if (!subscription.isActive && subscription.nextCharge) return month <= subscription.nextCharge.slice(0, 7);
  return true;
}

export const demoTransactions: Transaction[] = monthStarts.flatMap((month, monthIndex) => {
  const recurring = demoSubscriptions.flatMap((subscription, subscriptionIndex) => {
    if (!shouldIncludeSubscription(subscription, month)) return [];
    const amount = recurringAmount(subscription, monthIndex);
    if (!amount) return [];
    return [{
      id: `tx_sub_${monthIndex}_${subscriptionIndex}`,
      merchant: subscription.merchant,
      date: dated(month, subscriptionSeed[subscriptionIndex].day),
      amount: Number(amount.toFixed(2)),
      category: subscription.category,
      isRecurring: true,
      frequency: subscription.frequency,
      confidence: subscription.confidence,
      description: `${subscription.name} recurring charge`,
    }];
  });

  const daily = Array.from({ length: 82 }, (_, index) => {
    const merchant = everydayMerchants[(index + monthIndex) % everydayMerchants.length];
    const amount = merchant[2] + ((index * 7 + monthIndex * 3) % 19);
    return {
      id: `tx_day_${monthIndex}_${index}`,
      merchant: merchant[0],
      date: dated(month, (index % 28) + 1),
      amount: Number(amount.toFixed(2)),
      category: merchant[1],
      isRecurring: false,
      confidence: 0.78 + ((index % 18) / 100),
      description: `${merchant[0]} card purchase`,
    } satisfies Transaction;
  });

  return [...recurring, ...daily];
});

export const demoAchievements: Achievement[] = [
  { id: "ach_1", title: "Smart Saver", description: "Found the first $100 in recurring savings.", icon: "BadgeDollarSign", unlocked: true, unlockedAt: "2026-01-18" },
  { id: "ach_2", title: "Leak Hunter", description: "Detected duplicate subscriptions in three categories.", icon: "Target", unlocked: true, unlockedAt: "2026-03-03" },
  { id: "ach_3", title: "Budget Master", description: "Kept discretionary spend below goal for four weeks.", icon: "Trophy", unlocked: true, unlockedAt: "2026-04-29" },
  { id: "ach_4", title: "Subscription Slayer", description: "Queued three cancellations from AI recommendations.", icon: "Sword", unlocked: true, unlockedAt: "2026-06-11" },
  { id: "ach_5", title: "Financial Optimizer", description: "Projected annual savings crossed $486.", icon: "Sparkles", unlocked: true, unlockedAt: "2026-07-19" },
];

export const demoSavingsGoals: SavingsGoal[] = [
  { id: "goal_1", title: "Weekly Goal", targetAmount: 25, currentAmount: 22, deadline: "2026-07-31" },
  { id: "goal_2", title: "Monthly Goal", targetAmount: 100, currentAmount: 96, deadline: "2026-08-31" },
  { id: "goal_3", title: "Savings Streak", targetAmount: 8, currentAmount: 6, deadline: "2026-09-15" },
];

export const demoInsights = [
  "You have 6 subscriptions you rarely use.",
  "Your spending increased 18% compared to last month.",
  "You could save approximately $486/year with the starter optimization plan.",
  "Three subscriptions increased in price during the last six months.",
  "You are paying for three cloud storage services.",
  "Spotify, Apple Music, and YouTube Music duplicate the same entertainment need.",
];

export const monthlyFinancialStory = {
  title: "What changed this month?",
  summary: "July was the first month where recurring bills crossed $900. The biggest drivers were the Netflix price hike, higher internet bill, and duplicate cloud storage renewals.",
  wins: ["ChatGPT Plus and GitHub Copilot show high usage.", "No missed payments were detected.", "Insurance and loan payments stayed stable."],
  risks: ["Streaming overlap is growing.", "AWS spend is irregular.", "Low-use gym and design tools are still active."],
};

export const emailTemplates = {
  cancel:
    "Subject: Cancellation Request\n\nHello,\n\nPlease cancel my membership effective at the end of the current billing cycle. I would appreciate written confirmation that no further charges will be applied.\n\nThank you,\nAlex Morgan",
  discount:
    "Subject: Request for Loyalty Discount\n\nHello,\n\nI have been a customer for several years and am reviewing my monthly subscriptions. Before I make changes, could you confirm whether a retention, student, or annual plan discount is available for my account?\n\nBest,\nAlex Morgan",
  downgrade:
    "Subject: Plan Downgrade Request\n\nHello,\n\nPlease move my account to the lowest plan that preserves my current data and basic access. Kindly confirm the new monthly price and the date the change takes effect.\n\nThank you,\nAlex Morgan",
  pause:
    "Subject: Membership Pause Request\n\nHello,\n\nI would like to pause my membership for the next billing cycle due to low current usage. Please confirm the pause period and whether any charges will occur during that time.\n\nRegards,\nAlex Morgan",
};

export const savingsProjection = [
  { month: "Now", savings: 0, score: 42 },
  { month: "Month 1", savings: 97, score: 56 },
  { month: "Month 3", savings: 291, score: 64 },
  { month: "Month 6", savings: 486, score: 73 },
  { month: "Month 12", savings: 1164, score: 82 },
];

export const advisorQuickPrompts = [
  "Where am I wasting money?",
  "Which subscriptions should I cancel?",
  "Explain my leak score.",
  "How can I save $50 every month?",
  "Show my biggest recurring expenses.",
  "Generate a cancellation email.",
];

export const categoryColors: Record<string, string> = {
  streaming: "#f87171",
  music: "#fbbf24",
  cloud: "#34d399",
  fitness: "#fb7185",
  insurance: "#818cf8",
  software: "#a78bfa",
  gaming: "#f472b6",
  news: "#fb923c",
  utilities: "#38bdf8",
  loan: "#94a3b8",
  other: "#cbd5e1",
};
