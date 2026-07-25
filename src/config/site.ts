export const siteConfig = {
  name: "LeakGuard AI",
  tagline: "Stop Losing Money You Didn't Know You Were Spending.",
  description:
    "AI-powered subscription leak detection. Analyze bank statements, detect recurring payments, and save money automatically.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  links: {
    github: "https://github.com/leakguard-ai",
    docs: "/docs",
  },
} as const;

export const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Upload", href: "/upload", icon: "Upload" },
  { title: "Subscriptions", href: "/subscriptions", icon: "CreditCard" },
  { title: "Analytics", href: "/analytics", icon: "BarChart3" },
  { title: "AI Advisor", href: "/advisor", icon: "MessageSquare" },
  { title: "Recommendations", href: "/recommendations", icon: "Sparkles" },
  { title: "Export", href: "/export", icon: "Download" },
] as const;
