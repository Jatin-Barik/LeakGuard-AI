import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen gradient-bg flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <Shield className="mx-auto mb-4 h-12 w-12 text-sky-300" />
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This route is not part of the LeakGuard demo workspace.
        </p>
        <Button className="mt-6" variant="gradient" asChild>
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </main>
  );
}
