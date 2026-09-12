import { Sidebar } from "./_components/Sidebar";
import { Header } from "./_components/Header";
import { QuickAccessHighlights } from "./_components/QuickAccessHighlights";

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
        <main className="flex-1 p-4 sm:p-6 lg:p-7 space-y-6 w-full mx-auto pb-28 sm:pb-32">
          {children}
        </main>

        {/* Fixed Floating Bottom Quick Access Bar */}
        <div className="fixed bottom-3 sm:bottom-4 left-4 right-4 lg:left-[calc(16rem+1.5rem)] lg:right-6 xl:right-7 z-40 pointer-events-none">
          <div className="pointer-events-auto max-w-7xl mx-auto">
            <QuickAccessHighlights />
          </div>
        </div>
      </div>
    </div>
  );
}
