"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  BarChart3,
  CreditCard,
  Download,
  LayoutDashboard,
  MessageSquare,
  Shield,
  Sparkles,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/config/site";

const iconMap = {
  LayoutDashboard,
  Upload,
  CreditCard,
  BarChart3,
  MessageSquare,
  Sparkles,
  Download,
};

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-white/5 glass-strong transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
          <Shield className="h-5 w-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="font-bold text-sm gradient-text">LeakGuard AI</h1>
            <p className="text-[10px] text-muted-foreground">Financial Shield</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-4 scrollbar-thin overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative",
                  isActive
                    ? "text-white bg-white/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border border-indigo-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon className="h-4 w-4 relative z-10 shrink-0" />
                {!collapsed && <span className="relative z-10">{item.title}</span>}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="border-t border-white/5 p-4">
          <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-4">
            <p className="text-xs font-medium text-indigo-300">Pro Tip</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Upload your latest statement to refresh your Leak Score.
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
