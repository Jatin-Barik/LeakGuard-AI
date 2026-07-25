"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, GitFork, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/providers/auth-provider";

export default function SignInPage() {
  const { enabled, signInWithOAuth } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const signIn = async (provider: "google" | "github") => {
    setIsSigningIn(true);
    try {
      await signInWithOAuth(provider);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign-in failed");
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 mb-4"><Shield className="h-6 w-6 text-white" /></div>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your LeakGuard AI account</p>
        </div>
        <Card>
          <CardHeader><CardTitle className="text-lg">Secure Sign In</CardTitle><CardDescription>Continue with a trusted provider</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            {enabled ? <>
              <Button variant="outline" className="w-full" disabled={isSigningIn} onClick={() => signIn("google")}>Continue with Google</Button>
              <Button variant="outline" className="w-full" disabled={isSigningIn} onClick={() => signIn("github")}><GitFork className="h-4 w-4" />Continue with GitHub</Button>
            </> : <>
              <Input type="email" placeholder="Email address" disabled />
              <Button variant="gradient" className="w-full" asChild><Link href="/dashboard">Explore the secure demo <ArrowRight className="h-4 w-4" /></Link></Button>
            </>}
            <p className="text-center text-xs text-muted-foreground">{enabled ? "Your session is securely persisted by Supabase." : "Configure Supabase environment variables to enable Google and GitHub sign-in."}</p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
