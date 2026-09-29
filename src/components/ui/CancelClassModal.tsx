// CancelClassModal component allowing admins to cancel a daily batch with specific reason, note, and WhatsApp subscriber notice

"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Slot } from "@/types";

interface CancelClassModalProps {
  isOpen: boolean;
  slot: Slot | null;
  subscriberCount: number;
  onConfirm: (reason: string, note: string) => void;
  onClose: () => void;
}

const CANCEL_REASONS = [
  "Trainer unwell",
  "Technical issue (Zoom / Internet)",
  "Public holiday / Festival",
  "Trainer unavailable",
  "Low attendance",
  "Other",
];

export default function CancelClassModal({
  isOpen,
  slot,
  subscriberCount,
  onConfirm,
  onClose,
}: CancelClassModalProps) {
  const [reason, setReason] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Reset form whenever modal opens/closes or slot changes
  useEffect(() => {
    if (isOpen) {
      setReason("");
      setNote("");
      setError(null);
    }
  }, [isOpen, slot]);

  if (!isOpen || !slot) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason) {
      setError("Please select a reason");
      return;
    }

    if (reason === "Other" && !note.trim()) {
      setError("Please add a note");
      return;
    }

    onConfirm(reason, note.trim());
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-sand space-y-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Title & Close Button */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-forest font-serif">
              Cancel Class
            </h2>
            <p className="text-xs md:text-sm text-warmgray mt-0.5">
              {slot.time} batch, 29 Sep 2026
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-warmgray hover:text-charcoal hover:bg-sand/40 transition cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Field */}
          <div>
            <label
              htmlFor="cancel-reason"
              className="block text-xs font-semibold text-charcoal mb-1"
            >
              Reason <span className="text-[#A3382B]">*</span>
            </label>
            <select
              id="cancel-reason"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError(null);
              }}
              className="w-full bg-white border border-sand rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage transition cursor-pointer"
            >
              <option value="" disabled>
                Select a reason
              </option>
              {CANCEL_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Note Field */}
          <div>
            <label
              htmlFor="cancel-note"
              className="block text-xs font-semibold text-charcoal mb-1"
            >
              Note{" "}
              {reason === "Other" ? (
                <span className="text-[#A3382B]">*</span>
              ) : (
                <span className="text-warmgray font-normal">(optional)</span>
              )}
            </label>
            <textarea
              id="cancel-note"
              rows={3}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setError(null);
              }}
              placeholder="Add more details for subscribers (optional)"
              className="w-full bg-white border border-sand rounded-lg px-3 py-2 text-sm text-charcoal placeholder:text-warmgray/60 focus:outline-none focus:ring-2 focus:ring-sage transition resize-none"
            />
          </div>

          {/* Validation Error Message */}
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-[#A3382B] font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-cream border border-sand rounded-lg p-3 text-xs text-charcoal space-y-1">
            <p className="font-semibold text-forest">Subscriber Notification</p>
            <p className="text-warmgray">
              {subscriberCount} {subscriberCount === 1 ? "subscriber" : "subscribers"} will be notified on WhatsApp. Their plan will be extended by 1 day.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-sand bg-white text-charcoal hover:bg-sand/40 transition cursor-pointer"
            >
              Go Back
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-terracotta hover:bg-[#C0764C] text-white transition shadow-sm cursor-pointer"
            >
              Cancel Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
