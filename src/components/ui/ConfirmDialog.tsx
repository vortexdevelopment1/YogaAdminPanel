// Modal confirmation dialog component for destructive operations like deleting slots

"use client";

import { AlertTriangle, X } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog Card */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl border border-sand p-6 shadow-xl z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#F8E1DE] text-[#A3382B] flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-warmgray hover:text-charcoal hover:bg-sand/40 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-lg font-bold text-forest font-serif mb-1">
          {title}
        </h3>
        <p className="text-xs md:text-sm text-warmgray mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs md:text-sm font-medium border border-sand rounded-xl text-charcoal hover:bg-sand/30 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs md:text-sm font-medium bg-terracotta hover:bg-[#c2764c] text-white rounded-xl shadow-xs transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
