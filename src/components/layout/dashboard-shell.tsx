"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardShell({ children, title, subtitle }: DashboardLayoutProps) {
  const router = useRouter();
  const { enabled, loading, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (enabled && !loading && !user) router.replace("/sign-in");
  }, [enabled, loading, router, user]);

  if (enabled && (loading || !user)) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center text-sm text-muted-foreground">
        Securing your workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="pointer-events-none fixed inset-0 surface-grid opacity-40" />
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/60"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-64">
            <Sidebar />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-3 top-3"
              aria-label="Close navigation"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <Button
        variant="glass"
        size="icon"
        className="fixed left-4 top-4 z-40 lg:hidden"
        aria-label="Open navigation"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className="relative lg:pl-64">
        <Header title={title} subtitle={subtitle} />
        <main className="p-4 pt-6 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
