"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useAuth } from "@/components/providers/auth-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardShell({ children, title, subtitle }: DashboardLayoutProps) {
  const router = useRouter();
  const { enabled, loading, user } = useAuth();

  useEffect(() => {
    if (enabled && !loading && !user) router.replace("/sign-in");
  }, [enabled, loading, router, user]);

  if (enabled && (loading || !user)) {
    return <div className="min-h-screen gradient-bg flex items-center justify-center text-sm text-muted-foreground">Securing your workspace…</div>;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar />
      <div className="pl-64">
        <Header title={title} subtitle={subtitle} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
