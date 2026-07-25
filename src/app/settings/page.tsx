"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Bell, Globe2, Languages, LockKeyhole, Moon, Trash2, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-white/[0.03] p-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative h-6 w-11 rounded-full border transition-colors ${
          checked ? "border-emerald-400/40 bg-emerald-500/40" : "border-white/10 bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { setTheme } = useTheme();
  const [alerts, setAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [securityEmails, setSecurityEmails] = useState(true);

  return (
    <DashboardShell title="Settings" subtitle="Personalize LeakGuard AI for your financial workflow">
      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <WalletCards className="h-4 w-4 text-sky-300" />
              Financial Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Currency</span>
              <Input defaultValue="USD" className="bg-secondary/30" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Language</span>
              <Input defaultValue="English" className="bg-secondary/30" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Monthly savings target</span>
              <Input defaultValue="$100" className="bg-secondary/30" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Risk threshold</span>
              <Input defaultValue="Leak Score below 60" className="bg-secondary/30" />
            </label>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Moon className="h-4 w-4 text-sky-300" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid grid-cols-3 gap-2">
              {["dark", "light", "system"].map((mode) => (
                <Button key={mode} variant="outline" className="capitalize" onClick={() => setTheme(mode)}>
                  {mode}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Theme controls are ready for production; the demo defaults to a high-contrast dark workspace.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4 text-sky-300" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ToggleRow
              title="Price hike alerts"
              description="Notify me when a subscription silently increases."
              checked={alerts}
              onChange={() => setAlerts((value) => !value)}
            />
            <ToggleRow
              title="Weekly leak digest"
              description="Send a weekly summary of savings opportunities."
              checked={weeklyDigest}
              onChange={() => setWeeklyDigest((value) => !value)}
            />
            <ToggleRow
              title="Security emails"
              description="Receive sign-in and data export notifications."
              checked={securityEmails}
              onChange={() => setSecurityEmails((value) => !value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <LockKeyhole className="h-4 w-4 text-sky-300" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: Globe2, label: "Connected region", value: "United States" },
              { icon: Languages, label: "Statement language", value: "Auto-detect" },
              { icon: LockKeyhole, label: "Data retention", value: "90 days" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between rounded-lg bg-white/[0.03] p-4">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  </div>
                  <Badge variant="outline">{item.value}</Badge>
                </div>
              );
            })}
            <Button variant="destructive" className="w-full" onClick={() => toast.error("Demo account deletion is disabled")}>
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
