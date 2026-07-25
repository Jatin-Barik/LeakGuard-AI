"use client";

import { Bell, LogOut, Search } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { demoUser } from "@/lib/demo-data";
import { useAuth } from "@/components/providers/auth-provider";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { user, enabled, signOut } = useAuth();
  const displayName = user?.user_metadata.full_name ?? user?.user_metadata.name ?? demoUser.name;
  const email = user?.email ?? demoUser.email;
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("");

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/5 glass-strong px-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search merchants, categories..."
            className="w-64 pl-9 bg-secondary/30 border-white/5"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-500" />
        </Button>

        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-xs text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          {enabled && (
            <Button variant="ghost" size="icon" aria-label="Log out" onClick={() => signOut().catch(() => toast.error("Could not sign you out"))}>
              <LogOut className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
