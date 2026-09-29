// Day-Lock grid component visualizing progressive daily yoga curriculum unlock status, supporting active, upcoming, expired, and cancelled subscriptions

"use client";

import { Check, Lock } from "lucide-react";
import { Booking } from "@/types";
import ProgressBar from "@/components/ui/ProgressBar";
import {
  getPlanDays,
  getDayNumber,
  getDayStatus,
  getUnlockDate,
} from "@/lib/utils";

interface DayLockGridProps {
  booking: Booking;
  today?: string;
}

export default function DayLockGrid({
  booking,
  today = "2026-09-29",
}: DayLockGridProps) {
  const totalDays = getPlanDays(booking.plan);
  const rawCurrentDay = getDayNumber(booking.startDate, today);

  const isCancelled = booking.status === "Cancelled";
  const isUpcoming = booking.status === "Upcoming" || rawCurrentDay === 0;
  const isExpired = booking.status === "Expired";

  // Effective progress
  const currentDay = isCancelled
    ? 0
    : isExpired
    ? totalDays
    : isUpcoming
    ? 0
    : Math.min(rawCurrentDay, totalDays);

  const progressPercent = Math.round((currentDay / totalDays) * 100);

  return (
    <div className="space-y-4">
      {/* Status Note & Progress Header */}
      {isCancelled ? (
        <div className="p-2.5 rounded-lg bg-[#F8E1DE] text-[#A3382B] text-xs font-semibold">
          Subscription cancelled. All access removed.
        </div>
      ) : isUpcoming ? (
        <div className="p-2.5 rounded-lg bg-[#FBF0D9] text-[#8A6414] text-xs font-medium">
          Subscription starts on <strong>{booking.startDate}</strong>. All days are locked.
        </div>
      ) : isExpired ? (
        <div className="p-2.5 rounded-lg bg-[#E8EEF5] text-[#3A5A80] text-xs font-medium">
          Subscription completed. All curriculum days unlocked.
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-charcoal">
            <span>
              Day {currentDay} of {totalDays}
            </span>
            <span className="text-forest font-bold">{progressPercent}% Unlocked</span>
          </div>
          <ProgressBar percent={progressPercent} />
        </div>
      )}

      {/* Grid of Day Boxes */}
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
        {Array.from({ length: totalDays }, (_, idx) => {
          const dayIndex = idx + 1;
          let status: "completed" | "today" | "locked" = "locked";

          if (isCancelled) {
            status = "locked";
          } else if (isExpired) {
            status = "completed";
          } else if (isUpcoming) {
            status = "locked";
          } else {
            status = getDayStatus(dayIndex, currentDay);
          }

          const unlockDate = getUnlockDate(booking.startDate, dayIndex);

          return (
            <div
              key={dayIndex}
              title={
                isCancelled
                  ? "Access revoked (Cancelled)"
                  : status === "locked"
                  ? `Unlocks on ${unlockDate}`
                  : status === "today"
                  ? "Today's Active Session"
                  : `Completed on ${unlockDate}`
              }
              className={`relative h-14 rounded-xl flex flex-col items-center justify-center text-xs font-semibold transition-all select-none ${
                isCancelled
                  ? "bg-cream/60 text-warmgray/50 border border-sand/50 opacity-60"
                  : status === "completed"
                  ? "bg-[#E3F0E5] text-[#2F6B3D] border border-[#d1e8d4]"
                  : status === "today"
                  ? "bg-[#D98B5F] text-white ring-2 ring-[#D98B5F]/40 shadow-xs"
                  : "bg-cream/90 text-warmgray border border-sand/80 opacity-75 hover:opacity-100"
              }`}
            >
              {status === "completed" ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5] mb-0.5" />
                  <span className="text-[11px]">D{dayIndex}</span>
                </>
              ) : status === "today" ? (
                <>
                  <span className="text-[12px] font-bold">D{dayIndex}</span>
                  <span className="text-[9px] uppercase tracking-wider font-bold opacity-90">
                    Today
                  </span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-warmgray/70 mb-0.5" />
                  <span className="text-[11px] text-warmgray/90">D{dayIndex}</span>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Grid Legend */}
      <div className="flex items-center justify-between pt-2 border-t border-sand/60 text-[11px] text-warmgray font-medium">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-[#E3F0E5] border border-[#d1e8d4]" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-[#D98B5F]" />
          <span>Today</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-cream border border-sand" />
          <span>Locked</span>
        </div>
      </div>
    </div>
  );
}
