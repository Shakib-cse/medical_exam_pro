"use client";

import React from "react";
import { X } from "lucide-react";

interface OptionItem {
  id: string;
  label: string;
}

interface EmqOptionPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: OptionItem[];
  currentSelectedId?: string;
  onSelectOption: (optionId: string) => void;
  caseNumber?: number;
}

export function EmqOptionPickerModal({
  isOpen,
  onClose,
  options,
  currentSelectedId,
  onSelectOption,
  caseNumber,
}: EmqOptionPickerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">
            {caseNumber ? `Select Option for Case ${caseNumber}` : "Select Option"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-2 flex-1">
          {options.map((opt) => {
            const isSelected = currentSelectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  onSelectOption(opt.id);
                  onClose();
                }}
                className={`w-full text-left p-3 sm:p-3.5 rounded-xl border flex items-center gap-3.5 transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-500 bg-blue-50/70 text-blue-950 font-semibold ring-1 ring-blue-500"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 ${
                    isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {opt.id}
                </span>
                <span className="text-xs sm:text-[13px]">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
