"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Shield,
  Sparkles,
  TrendingDown,
  Upload,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeakScoreGauge } from "@/components/dashboard/leak-score-gauge";
import { siteConfig } from "@/config/site";

const features = [
  {
    icon: Upload,
    title: "Smart Upload",
    description: "Drop bank statements, CSVs, or SMS exports. AI extracts every transaction automatically.",
  },
  {
    icon: Brain,
    title: "AI Detection",
    description: "Gemini-powered engine detects recurring payments, price hikes, and duplicate subscriptions.",
  },
  {
    icon: TrendingDown,
    title: "Leak Score",
    description: "Personalized 0-100 score showing exactly how much money you're losing each month.",
  },
  {
    icon: Sparkles,
    title: "AI Advisor",
    description: "Chat with your financial data. Get personalized cancellation and savings recommendations.",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    description: "Beautiful charts showing spending trends, category breakdowns, and price history.",
  },
  {
    icon: Zap,
    title: "Instant Actions",
    description: "One-click cancellation emails, negotiation templates, and savings projections.",
  },
];

const stats = [
  { value: "$847", label: "Avg. Annual Savings" },
  { value: "12", label: "Subscriptions Detected" },
  { value: "98%", label: "Detection Accuracy" },
  { value: "<30s", label: "Analysis Time" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-white/5 glass-strong">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold gradient-text">{siteConfig.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="gradient">
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 text-sm text-indigo-300 mb-6">
                <Sparkles className="h-4 w-4" />
                AI-Powered Financial Intelligence
              </div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
                Stop Losing Money{" "}
                <span className="gradient-text">You Didn&apos;t Know</span>{" "}
                You Were Spending
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                {siteConfig.description} Upload your statements and let AI find
                every subscription leak in seconds.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/dashboard">
                  <Button size="lg" variant="gradient">
                    Start Free Analysis
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/upload">
                  <Button size="lg" variant="glass">
                    Upload Statement
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="glass rounded-2xl p-8 w-full max-w-md">
                <div className="text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-2">Your Leak Score</p>
                  <LeakScoreGauge score={42} size="lg" />
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Monthly Waste", value: "$96.96", color: "text-red-400" },
                    { label: "Active Subscriptions", value: "12", color: "text-foreground" },
                    { label: "Potential Annual Savings", value: "$1,152", color: "text-emerald-400" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="flex justify-between items-center p-3 rounded-lg bg-secondary/50"
                    >
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className={`font-semibold ${item.color}`}>{item.value}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-indigo-500/20 blur-2xl" />
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-purple-500/20 blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-6 border-y border-white/5">
        <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Stop the Leak</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From upload to action, LeakGuard AI handles the entire subscription
              optimization workflow with enterprise-grade intelligence.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass rounded-xl p-6 hover:border-indigo-500/30 transition-colors group"
                >
                  <div className="rounded-xl bg-indigo-500/10 p-3 w-fit mb-4 group-hover:bg-indigo-500/20 transition-colors">
                    <Icon className="h-6 w-6 text-indigo-400" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center glass rounded-2xl p-12 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
          <div className="relative">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Find Your Hidden Leaks?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands who&apos;ve discovered money they didn&apos;t know they were losing.
              Free analysis in under 30 seconds.
            </p>
            <Link href="/dashboard">
              <Button size="lg" variant="gradient">
                Get Your Leak Score
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-400" />
            <span className="font-semibold text-sm">{siteConfig.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Copyright 2026 LeakGuard AI. Built for the National Hackathon.
          </p>
        </div>
      </footer>
    </div>
  );
}
