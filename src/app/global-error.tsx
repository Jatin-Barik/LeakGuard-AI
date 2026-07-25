"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-[#070807] text-[#f7f7f2] flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="mt-2 text-sm text-[#a8ada5]">
              LeakGuard hit an unexpected error while preparing the workspace.
            </p>
            <Button className="mt-6" onClick={reset}>
              Try again
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
