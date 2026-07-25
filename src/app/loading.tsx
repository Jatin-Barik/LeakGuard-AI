export default function Loading() {
  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-sky-300 border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading LeakGuard AI...</p>
      </div>
    </div>
  );
}
