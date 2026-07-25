import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function DashboardShell({ children, title, subtitle }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen gradient-bg">
      <Sidebar />
      <div className="pl-64">
        <Header title={title} subtitle={subtitle} />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
