export const metadata = {
  title: "Practice Mode | MedicalExamPro",
  description: "Distraction-free professional medical exam practice environment.",
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#edf0f4] font-sans text-slate-800 antialiased flex flex-col">
      {children}
    </div>
  );
}
