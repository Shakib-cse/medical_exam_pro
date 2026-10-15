import { Sidebar } from "./_components/Sidebar";
import { Header } from "./_components/Header";
import { QuickAccessHighlights } from "./_components/QuickAccessHighlights";
import { DashboardSubscriptionGuard } from "./_components/DashboardSubscriptionGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#edf0f4] flex flex-col lg:flex-row font-sans text-slate-800 antialiased">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0 min-h-screen relative">
        <Header />
        <main className="flex-1 px-4 pt-4 sm:px-6 sm:pt-6 lg:px-7 lg:pt-7 pb-16 sm:pb-20 lg:pb-24 space-y-6 w-full mx-auto">
          <DashboardSubscriptionGuard>
            {children}
          </DashboardSubscriptionGuard>
        </main>

        {/* Collapsible Floating Quick Access Highlights */}
        <QuickAccessHighlights />
      </div>
    </div>
  );
}
