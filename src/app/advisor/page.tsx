"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AIAdvisorChat } from "@/components/advisor/ai-advisor-chat";

export default function AdvisorPage() {
  return (
    <DashboardShell
      title="AI Financial Advisor"
      subtitle="Ask questions about your subscriptions and get personalized savings advice"
    >
      <AIAdvisorChat />
    </DashboardShell>
  );
}
