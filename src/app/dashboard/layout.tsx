import { Sidebar } from "./_components/Sidebar";
import { Header } from "./_components/Header";

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
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-7 space-y-6 w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
