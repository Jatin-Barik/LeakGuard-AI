"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { UploadCenter } from "@/components/upload/upload-center";

export default function UploadPage() {
  return (
    <DashboardShell
      title="Upload Center"
      subtitle="Upload bank statements, CSVs, or notification exports for AI analysis"
    >
      <UploadCenter />
    </DashboardShell>
  );
}
