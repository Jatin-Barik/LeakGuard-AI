"use client";

import { Calendar, Mail, ShieldCheck, Trophy, UserCircle } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { demoAchievements, demoDashboardStats, demoUser } from "@/lib/demo-data";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const initials = demoUser.name.split(" ").map((part) => part[0]).join("");

  return (
    <DashboardShell title="Profile" subtitle="Account details, savings history, and trust settings">
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-gradient-to-br from-sky-500 to-emerald-500 text-lg text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{demoUser.name}</h2>
                <p className="text-sm text-muted-foreground">{demoUser.email}</p>
                <Badge className="mt-2" variant="success">Verified customer</Badge>
              </div>
            </div>
            <div className="mt-6 grid gap-3">
              {[
                { icon: Trophy, label: "Total saved", value: formatCurrency(demoUser.totalSaved) },
                { icon: Calendar, label: "Member since", value: formatDate(demoUser.memberSince) },
                { icon: ShieldCheck, label: "Data mode", value: "Encrypted analysis" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center justify-between rounded-lg bg-white/[0.03] p-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-sky-300" />
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <UserCircle className="h-4 w-4 text-sky-300" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Full name</span>
              <Input defaultValue={demoUser.name} className="bg-secondary/30" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Email</span>
              <Input defaultValue={demoUser.email} className="bg-secondary/30" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Primary currency</span>
              <Input defaultValue="USD" className="bg-secondary/30" />
            </label>
            <label className="space-y-2 text-sm">
              <span className="text-muted-foreground">Savings goal</span>
              <Input defaultValue={formatCurrency(demoDashboardStats.potentialSavings)} className="bg-secondary/30" />
            </label>
            <div className="md:col-span-2">
              <Button variant="gradient">
                <Mail className="h-4 w-4" />
                Save Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Achievements</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {demoAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-lg border p-4 ${
                  achievement.unlocked ? "border-emerald-500/25 bg-emerald-500/8" : "border-white/10 bg-white/[0.03]"
                }`}
              >
                <p className="text-sm font-medium">{achievement.title}</p>
                <p className="mt-2 text-xs text-muted-foreground">{achievement.description}</p>
                <Badge className="mt-4" variant={achievement.unlocked ? "success" : "secondary"}>
                  {achievement.unlocked ? "Unlocked" : "Locked"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
