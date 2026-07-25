"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
      <AuthProvider>
        {children}
        <Toaster theme="dark" position="top-right" toastOptions={{ classNames: { toast: "glass border border-white/10" } }} />
      </AuthProvider>
    </NextThemesProvider>
  );
}
