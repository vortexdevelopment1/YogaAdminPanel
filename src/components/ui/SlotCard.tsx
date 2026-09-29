// SlotCard component displaying individual slot metrics, progress bar, recent subscribers, cancellation banner, and action buttons

"use client";

import { Clock, User, Pencil, Trash2, Ban, Undo2 } from "lucide-react";
import { Slot, Booking, CancelledClass } from "@/types";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  getSeatsAvailable,
  getOccupancyPercent,
  getSlotStatus,
  getBookingsForSlot,
} from "@/lib/utils";

interface SlotCardProps {
  slot: Slot;
  bookings: Booking[];
  onEdit?: (slot: Slot) => void;
  onDelete?: (slot: Slot) => void;
  onCancelClass?: (slot: Slot) => void;
  onUndoCancel?: (slot: Slot) => void;
  cancelledInfo?: CancelledClass;
}

export default function SlotCard({
  slot,
  bookings,
  onEdit,
  onDelete,
  onCancelClass,
  onUndoCancel,
  cancelledInfo,
}: SlotCardProps) {
  const percent = getOccupancyPercent(slot);
  const seatsAvailable = getSeatsAvailable(slot);
  const status = getSlotStatus(slot);
  const slotBookings = getBookingsForSlot(slot.id, bookings);
  const recentSubscribers = slotBookings.slice(0, 3);
  const isCancelled = Boolean(cancelledInfo);

  return (
    <div className="bg-white rounded-xl border border-sand p-5 md:p-6 shadow-sm flex flex-col justify-between space-y-4">
      {/* Top Header Row with Time & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage/15 text-sage flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-forest font-serif">{slot.time}</h3>
            <span className="text-xs text-warmgray font-medium">Daily Batch</span>
          </div>
        </div>

        {/* Status Badge and Edit/Delete Icon Buttons */}
        <div className="flex items-center gap-2">
          <Badge label={isCancelled ? "Cancelled" : status} />

          {onEdit && !isCancelled && (
            <button
              onClick={() => onEdit(slot)}
              title="Edit Slot"
              className="p-1.5 text-warmgray hover:text-forest hover:bg-sand/40 rounded-lg transition cursor-pointer"
              aria-label="Edit slot"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}

          {onDelete && !isCancelled && (
            <button
              onClick={() => onDelete(slot)}
              title="Delete Slot"
              className="p-1.5 text-warmgray hover:text-[#A3382B] hover:bg-[#F8E1DE]/60 rounded-lg transition cursor-pointer"
              aria-label="Delete slot"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Cancelled Banner (if class is cancelled today) */}
      {cancelledInfo && (
        <div className="bg-[#F8E1DE] text-[#A3382B] rounded-lg p-3 text-xs space-y-0.5 border border-[#F8E1DE]">
          <p className="font-bold">Today&apos;s class cancelled</p>
          <p className="text-[#A3382B]/90">
            <span className="font-semibold">Reason:</span> {cancelledInfo.reason}
            {cancelledInfo.note ? ` • ${cancelledInfo.note}` : ""}
          </p>
        </div>
      )}

      {/* Capacity Progress & Stats */}
      <div className={`space-y-2 ${isCancelled ? "opacity-70" : ""}`}>
        <ProgressBar percent={percent} />
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-charcoal">
            {slot.filled} / {slot.capacity} seats filled ({percent}%)
          </span>
          <span
            className={
              seatsAvailable === 0 ? "text-[#A3382B] font-semibold" : "text-warmgray"
            }
          >
            {seatsAvailable === 0 ? "No seats left" : `${seatsAvailable} seats available`}
          </span>
        </div>
      </div>

      {/* Recent Subscribers List */}
      <div className={`pt-3 border-t border-sand space-y-2.5 ${isCancelled ? "opacity-70" : ""}`}>
        <p className="text-xs font-semibold text-warmgray uppercase tracking-wider">
          Recent Subscribers
        </p>

        {recentSubscribers.length > 0 ? (
          <ul className="space-y-2">
            {recentSubscribers.map((booking) => (
              <li
                key={booking.id}
                className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-cream/60"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-sand flex items-center justify-center text-charcoal text-[10px]">
                    <User className="w-3 h-3" />
                  </div>
                  <span className="font-semibold text-charcoal">{booking.name}</span>
                </div>
                <span className="text-warmgray font-medium">{booking.plan}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-warmgray italic py-1">No subscribers yet</p>
        )}
      </div>

      {/* Class Cancellation Action Row */}
      <div className="pt-3 border-t border-sand flex items-center justify-end">
        {!isCancelled && onCancelClass && (
          <button
            type="button"
            onClick={() => onCancelClass(slot)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-terracotta border border-terracotta/40 rounded-lg hover:bg-[#F8E1DE]/50 transition cursor-pointer"
          >
            <Ban className="w-3.5 h-3.5" />
            <span>Cancel Today&apos;s Class</span>
          </button>
        )}

        {isCancelled && onUndoCancel && (
          <button
            type="button"
            onClick={() => onUndoCancel(slot)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-sage hover:bg-forest rounded-lg shadow-xs transition cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span>Undo Cancel</span>
          </button>
        )}
      </div>
    </div>
  );
}
