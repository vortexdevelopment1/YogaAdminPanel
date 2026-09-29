// CancelBookingModal component enabling admins to cancel a subscriber booking with reason, refund selection, and note

"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Booking } from "@/types";

interface CancelBookingModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onConfirm: (
    reason: string,
    note: string,
    refundType: "Full" | "Partial" | "None"
  ) => void;
  onClose: () => void;
}

const CANCEL_REASONS = [
  "User requested",
  "Payment issue",
  "Duplicate booking",
  "Health reasons",
  "Other",
];

export default function CancelBookingModal({
  isOpen,
  booking,
  onConfirm,
  onClose,
}: CancelBookingModalProps) {
  const [reason, setReason] = useState<string>("");
  const [refundType, setRefundType] = useState<"Full" | "Partial" | "None">("Full");
  const [note, setNote] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const isPaid = booking?.paymentStatus === "Paid";

  // Reset form when modal opens or target booking changes
  useEffect(() => {
    if (isOpen && booking) {
      setReason("");
      setNote("");
      setError(null);
      setRefundType(booking.paymentStatus === "Paid" ? "Full" : "None");
    }
  }, [isOpen, booking]);

  if (!isOpen || !booking) return null;

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

    onConfirm(reason, note.trim(), isPaid ? refundType : "None");
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
              Cancel Booking
            </h2>
            <p className="text-xs md:text-sm text-warmgray mt-0.5">
              {booking.name} &bull; {booking.plan} plan
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
              htmlFor="cancel-booking-reason"
              className="block text-xs font-semibold text-charcoal mb-1"
            >
              Reason <span className="text-[#A3382B]">*</span>
            </label>
            <select
              id="cancel-booking-reason"
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

          {/* Refund Type Field */}
          <div>
            <label
              htmlFor="cancel-booking-refund"
              className="block text-xs font-semibold text-charcoal mb-1"
            >
              Refund Status
            </label>
            <select
              id="cancel-booking-refund"
              value={isPaid ? refundType : "None"}
              disabled={!isPaid}
              onChange={(e) =>
                setRefundType(e.target.value as "Full" | "Partial" | "None")
              }
              className={`w-full bg-white border border-sand rounded-lg px-3 py-2 text-sm text-charcoal focus:outline-none focus:ring-2 focus:ring-sage transition ${
                !isPaid ? "opacity-60 bg-cream/60 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              <option value="Full">Full refund</option>
              <option value="Partial">Partial refund</option>
              <option value="None">No refund</option>
            </select>
            {!isPaid && (
              <p className="text-[11px] text-warmgray mt-1">
                No payment received, nothing to refund.
              </p>
            )}
          </div>

          {/* Note Field */}
          <div>
            <label
              htmlFor="cancel-booking-note"
              className="block text-xs font-semibold text-charcoal mb-1"
            >
              Internal Note{" "}
              {reason === "Other" ? (
                <span className="text-[#A3382B]">*</span>
              ) : (
                <span className="text-warmgray font-normal">(optional)</span>
              )}
            </label>
            <textarea
              id="cancel-booking-note"
              rows={3}
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setError(null);
              }}
              placeholder="Add internal note (optional)"
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
            <p className="font-semibold text-forest">Cancellation Notice</p>
            <p className="text-warmgray">
              Seat will be freed, Zoom access removed and a WhatsApp cancellation message will be sent.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-sand bg-white text-charcoal hover:bg-sand/40 transition cursor-pointer"
            >
              Keep Booking
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-terracotta hover:bg-[#C0764C] text-white transition shadow-sm cursor-pointer"
            >
              Cancel Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
