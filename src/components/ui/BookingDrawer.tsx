// Slide-over drawer component displaying comprehensive subscriber information, cancellation audit note, payment audit, Day-Lock grid, and attendance logs

"use client";

import { useEffect } from "react";
import { X, MessageCircle, CreditCard, User, Calendar, ShieldAlert, Ban } from "lucide-react";
import { Booking, Slot, AttendanceRecord } from "@/types";
import Badge from "@/components/ui/Badge";
import DayLockGrid from "@/components/ui/DayLockGrid";
import {
  getSlotName,
  getPlanPrice,
  getBookingAmount,
  getRefundAmount,
  getAttendanceForBooking,
} from "@/lib/utils";

interface BookingDrawerProps {
  isOpen: boolean;
  booking: Booking | null;
  slots: Slot[];
  attendance: AttendanceRecord[];
  onClose: () => void;
}

export default function BookingDrawer({
  isOpen,
  booking,
  slots,
  attendance,
  onClose,
}: BookingDrawerProps) {
  // Listen for Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !booking) return null;

  const subscriberAttendance = getAttendanceForBooking(booking.id, attendance);
  const bookingAmount = getBookingAmount(booking);
  const refundAmount = getRefundAmount(booking);
  const transactionId = `TXN-${booking.id.replace("BK-", "8821")}Y`;
  const isCancelled = booking.status === "Cancelled";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Side Panel */}
      <div className="relative w-full sm:w-[460px] bg-white h-full shadow-2xl border-l border-sand flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-sand flex items-start justify-between bg-cream/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl md:text-2xl font-bold text-forest font-serif">
                {booking.name}
              </h2>
            </div>
            <p className="text-xs md:text-sm text-warmgray mb-3">
              {booking.email}
            </p>
            <div className="flex items-center gap-2">
              <Badge label={booking.status} />
              <Badge label={booking.paymentStatus} />
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-warmgray hover:text-charcoal hover:bg-sand/40 transition cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Cancelled Banner Card */}
          {isCancelled && (
            <div className="bg-[#F8E1DE] text-[#A3382B] rounded-xl p-4 text-xs space-y-1.5 border border-[#F8E1DE]">
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <Ban className="w-4 h-4" />
                <span>Cancelled on {booking.cancelledAt || "2026-09-29"}</span>
              </div>
              <p>
                <span className="font-semibold">Reason:</span>{" "}
                {booking.cancelReason || "User requested"}
              </p>
              <p>
                <span className="font-semibold">Refund:</span>{" "}
                {booking.refundType ? `${booking.refundType} refund` : "None"}
              </p>
              {booking.cancelNote && (
                <p className="italic text-[#A3382B]/90 mt-1 pt-1 border-t border-[#A3382B]/20">
                  &ldquo;{booking.cancelNote}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* Subscriber Details Card */}
          <div className="bg-cream/40 border border-sand rounded-xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-forest font-serif font-bold text-sm">
              <User className="w-4 h-4 text-sage" />
              <span>Subscriber Details</span>
            </div>

            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-warmgray">Phone:</span>
                <span className="font-mono font-medium text-charcoal">{booking.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-warmgray">Batch Slot:</span>
                <span className="font-semibold text-charcoal">
                  {getSlotName(booking.slotId, slots)}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-warmgray">Plan Duration:</span>
                <span className="font-semibold text-forest">{booking.plan} Pass</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-warmgray">Source:</span>
                <span className="font-medium text-charcoal">{booking.source || "Website"}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-warmgray">Start Date:</span>
                <span className="text-charcoal font-medium">{booking.startDate}</span>
              </div>
            </div>
          </div>

          {/* Payment Details Card */}
          <div className="bg-cream/40 border border-sand rounded-xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-forest font-serif font-bold text-sm">
              <CreditCard className="w-4 h-4 text-sage" />
              <span>Payment Details</span>
            </div>

            <div className="space-y-2 text-xs md:text-sm">
              {booking.couponCode && (
                <>
                  <div className="flex justify-between py-1 border-b border-sand/40">
                    <span className="text-warmgray">Coupon:</span>
                    <span className="font-mono font-bold text-forest">
                      {booking.couponCode}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-sand/40 text-[#2F6B3D]">
                    <span className="font-medium">Discount:</span>
                    <span className="font-bold">
                      -Rs. {(booking.discountAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </>
              )}

              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-warmgray">Amount:</span>
                <span className="font-bold text-charcoal">
                  Rs. {bookingAmount.toLocaleString()}
                </span>
              </div>

              {booking.paymentStatus === "Refunded" && (
                <div className="flex justify-between py-1 border-b border-sand/40 text-[#3A5A80]">
                  <span className="font-medium">Refunded:</span>
                  <span className="font-bold">
                    Rs. {refundAmount.toLocaleString()}
                  </span>
                </div>
              )}

              {booking.paymentStatus === "Partial Refund" && (
                <div className="flex justify-between py-1 border-b border-sand/40 text-[#8A6414]">
                  <span className="font-medium">Refunded:</span>
                  <span className="font-bold">
                    Rs. {refundAmount.toLocaleString()} (50%)
                  </span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-warmgray">Payment Method:</span>
                <span className="text-charcoal font-medium">{booking.paymentMethod || "UPI"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand/40">
                <span className="text-warmgray">Transaction ID:</span>
                <span className="font-mono text-xs text-charcoal">{transactionId}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-warmgray">Payment Status:</span>
                <Badge label={booking.paymentStatus} />
              </div>
            </div>

            {/* Payment Warning / Refund Callouts */}
            {booking.paymentStatus === "Refunded" && (
              <div className="p-2.5 rounded-lg bg-[#E8EEF5] text-[#3A5A80] text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Full amount refunded to subscriber.</span>
              </div>
            )}

            {booking.paymentStatus === "Partial Refund" && (
              <div className="p-2.5 rounded-lg bg-[#FBF0D9] text-[#8A6414] text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Partial amount refunded to subscriber.</span>
              </div>
            )}

            {booking.paymentStatus === "Failed" && (
              <div className="p-2.5 rounded-lg bg-[#F8E1DE] text-[#A3382B] text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Payment failed. Subscriber has no access.</span>
              </div>
            )}

            {booking.paymentStatus === "Pending" && (
              <div className="p-2.5 rounded-lg bg-[#FBF0D9] text-[#8A6414] text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Payment pending. Access starts after payment.</span>
              </div>
            )}
          </div>

          {/* Access Grid Card */}
          <div className="bg-cream/40 border border-sand rounded-xl p-4.5 space-y-3">
            <div className="flex items-center gap-2 text-forest font-serif font-bold text-sm">
              <Calendar className="w-4 h-4 text-sage" />
              <span>{booking.plan} Access Grid</span>
            </div>

            <DayLockGrid booking={booking} today="2026-09-29" />
          </div>

          {/* Recent Attendance Card */}
          <div className="bg-cream/40 border border-sand rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-forest font-serif font-bold text-sm">
                Recent Attendance
              </span>
              <span className="text-xs text-warmgray">
                {subscriberAttendance.length} records logged
              </span>
            </div>

            {subscriberAttendance.length > 0 ? (
              <div className="space-y-2">
                {subscriberAttendance.map((record) => (
                  <div
                    key={`${record.bookingId}-${record.date}`}
                    className="flex items-center justify-between p-2 rounded-lg bg-white border border-sand/50 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-charcoal">{record.date}</span>
                      {record.joined && record.durationMins && (
                        <span className="text-warmgray ml-2 font-medium">
                          ({record.durationMins} min session)
                        </span>
                      )}
                    </div>
                    <Badge label={record.joined ? "Present" : "Absent"} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-warmgray italic py-1">
                No attendance logs found for this subscriber.
              </p>
            )}
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div className="p-4 border-t border-sand bg-white space-y-2">
          <button
            disabled={isCancelled}
            onClick={() =>
              !isCancelled &&
              alert(`Demo: WhatsApp reminder sent to ${booking.name} (${booking.phone})`)
            }
            className={`w-full py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-xs transition ${
              isCancelled
                ? "bg-sand/50 text-warmgray cursor-not-allowed opacity-60"
                : "bg-sage hover:bg-forest text-white cursor-pointer"
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Send WhatsApp Reminder</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 px-4 border border-sand text-charcoal hover:bg-sand/30 rounded-xl font-medium text-sm transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
