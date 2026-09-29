// Client component rendering the list of subscriber bookings in a structured responsive table with view and cancel actions

"use client";

import { Eye, XCircle } from "lucide-react";
import { Booking, Slot } from "@/types";
import Badge from "@/components/ui/Badge";
import { getSlotName } from "@/lib/utils";

interface BookingsTableProps {
  bookings: Booking[];
  slots: Slot[];
  onView?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void;
}

export default function BookingsTable({
  bookings,
  slots,
  onView,
  onCancel,
}: BookingsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-sand p-12 text-center">
        <p className="text-base font-semibold text-charcoal">No bookings found</p>
        <p className="text-sm text-warmgray mt-1">
          Try adjusting your search query or filter options.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-sand shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream border-b border-sand text-xs font-semibold text-warmgray uppercase tracking-wider">
              <th className="py-3.5 px-4 md:px-6">Name</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Phone</th>
              <th className="py-3.5 px-4">Slot</th>
              <th className="py-3.5 px-4">Plan</th>
              <th className="py-3.5 px-4">Payment</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Start Date</th>
              <th className="py-3.5 px-4 md:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/60 text-sm text-charcoal">
            {bookings.map((booking) => {
              const isCancelDisabled =
                booking.status === "Cancelled" || booking.status === "Expired";

              return (
                <tr
                  key={booking.id}
                  className="hover:bg-cream/40 transition-colors"
                >
                  <td className="py-3.5 px-4 md:px-6">
                    <div className="flex flex-col items-start">
                      <button
                        type="button"
                        onClick={() => onView?.(booking)}
                        className="font-semibold text-forest hover:text-sage hover:underline transition cursor-pointer text-left"
                        title="View Subscriber Details"
                      >
                        {booking.name}
                      </button>
                      {booking.source === "Manual" && (
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cream text-warmgray border border-sand/60 mt-0.5">
                          Manual
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-warmgray text-xs md:text-sm">
                    {booking.email}
                  </td>
                  <td className="py-3.5 px-4 text-warmgray font-mono text-xs">
                    {booking.phone}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-charcoal text-xs">
                    {getSlotName(booking.slotId, slots)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-sand/60 text-charcoal">
                      {booking.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge label={booking.paymentStatus} />
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge label={booking.status} />
                  </td>
                  <td className="py-3.5 px-4 text-warmgray text-xs">
                    {booking.startDate}
                  </td>
                  <td className="py-3.5 px-4 md:px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          onView
                            ? onView(booking)
                            : alert(
                                `Demo: View booking details for ${booking.name} (${booking.id})`
                              )
                        }
                        title="View Booking Details"
                        className="p-1.5 rounded-lg text-warmgray hover:text-forest hover:bg-sand/40 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {isCancelDisabled ? (
                        <button
                          disabled
                          title="Cannot cancel"
                          className="p-1.5 rounded-lg text-warmgray/40 opacity-40 cursor-not-allowed"
                          aria-label="Cannot cancel booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            onCancel
                              ? onCancel(booking)
                              : alert(
                                  `Demo: Cancel booking ${booking.id} for ${booking.name}`
                                )
                          }
                          title="Cancel Booking"
                          className="p-1.5 rounded-lg text-warmgray hover:text-[#A3382B] hover:bg-[#F8E1DE]/50 transition-colors cursor-pointer"
                          aria-label="Cancel booking"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
