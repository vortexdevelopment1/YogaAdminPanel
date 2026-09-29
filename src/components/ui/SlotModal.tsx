// Modal dialog component for adding new batch slots or editing existing slot time and capacity

"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Slot } from "@/types";
import { formatTime12To24 } from "@/lib/utils";

interface SlotModalProps {
  isOpen: boolean;
  mode: "add" | "edit";
  initialSlot: Slot | null;
  onSave: (time: string, capacity: number) => { success: boolean; error?: string };
  onClose: () => void;
}

export default function SlotModal({
  isOpen,
  mode,
  initialSlot,
  onSave,
  onClose,
}: SlotModalProps) {
  const [time, setTime] = useState("06:00");
  const [capacity, setCapacity] = useState<number>(20);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialSlot) {
        setTime(formatTime12To24(initialSlot.time));
        setCapacity(initialSlot.capacity);
      } else {
        setTime("06:00");
        setCapacity(20);
      }
      setError("");
    }
  }, [isOpen, mode, initialSlot]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!time) {
      setError("Please select a valid slot time");
      return;
    }

    if (!capacity || capacity < 1) {
      setError("Capacity must be at least 1 seat");
      return;
    }

    if (capacity > 100) {
      setError("Capacity cannot exceed 100 seats");
      return;
    }

    const result = onSave(time, Number(capacity));
    if (result && !result.success) {
      setError(result.error || "An error occurred while saving the slot");
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-sand p-6 md:p-8 shadow-xl z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-forest font-serif">
            {mode === "add" ? "Add New Slot" : "Edit Slot"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-warmgray hover:text-charcoal hover:bg-sand/40 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-[#F8E1DE] text-[#A3382B] text-xs font-semibold border border-[#F8E1DE]">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="slot-time"
              className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5"
            >
              Slot Time
            </label>
            <input
              id="slot-time"
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setError("");
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-sand rounded-xl text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition shadow-2xs"
            />
          </div>

          <div>
            <label
              htmlFor="slot-capacity"
              className="block text-xs font-semibold text-charcoal uppercase tracking-wider mb-1.5"
            >
              Capacity (Seats)
            </label>
            <input
              id="slot-capacity"
              type="number"
              min="1"
              max="100"
              value={capacity}
              onChange={(e) => {
                setCapacity(parseInt(e.target.value, 10) || 0);
                setError("");
              }}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-sand rounded-xl text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition shadow-2xs"
            />
            {mode === "edit" && initialSlot && (
              <p className="text-[11px] text-warmgray mt-1">
                Currently filled: <strong className="text-forest">{initialSlot.filled}</strong> seats
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-medium border border-sand rounded-xl text-charcoal hover:bg-sand/30 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium bg-sage hover:bg-forest text-white rounded-xl shadow-xs transition cursor-pointer"
            >
              Save Slot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
