"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (val: string) => void;
  children: React.ReactNode;
  className?: string;
}

const TabsContext = React.createContext<{
  selected: string;
  setSelected: (val: string) => void;
}>({ selected: "", setSelected: () => {} });

export function Tabs({ defaultValue, value, onValueChange, children, className }: TabsProps) {
  const [selected, setSelectedState] = React.useState(value || defaultValue);

  const setSelected = (val: string) => {
    setSelectedState(val);
    if (onValueChange) onValueChange(val);
  };

  return (
    <TabsContext.Provider value={{ selected: value !== undefined ? value : selected, setSelected }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("inline-flex items-center justify-center rounded-lg bg-slate-100 p-1 text-slate-500", className)}>
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { selected, setSelected } = React.useContext(TabsContext);
  const isSelected = selected === value;

  return (
    <button
      type="button"
      onClick={() => setSelected(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold ring-offset-white transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
        isSelected
          ? "bg-slate-800 text-white shadow-xs"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  className,
  children,
}: {
  value: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { selected } = React.useContext(TabsContext);
  if (selected !== value) return null;
  return <div className={cn("mt-2 focus-visible:outline-none", className)}>{children}</div>;
}
