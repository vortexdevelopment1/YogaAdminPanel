// Client component rendering recent subscriber payment transactions with status badges and Indian currency formatting

"use client";

import { Booking, Slot } from "@/types";
import Badge from "@/components/ui/Badge";
import { formatRupees, getBookingAmount } from "@/lib/utils";

interface PaymentsTableProps {
  bookings: Booking[];
  slots?: Slot[];
}

export default function PaymentsTable({ bookings }: PaymentsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-sand p-12 text-center">
        <p className="text-base font-semibold text-charcoal">No payments found</p>
        <p className="text-sm text-warmgray mt-1">
          Try adjusting your filter options.
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
              <th className="py-3.5 px-4">Plan</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Method</th>
              <th className="py-3.5 px-4">Payment Status</th>
              <th className="py-3.5 px-4 md:px-6">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/60 text-sm text-charcoal">
            {bookings.map((booking) => {
              const amount = getBookingAmount(booking);

              return (
                <tr
                  key={booking.id}
                  className="hover:bg-cream/40 transition-colors"
                >
                  <td className="py-3.5 px-4 md:px-6 font-semibold text-forest">
                    {booking.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-sand/60 text-charcoal">
                      {booking.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-charcoal">
                    {formatRupees(amount)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-mono font-medium text-warmgray bg-cream px-2 py-0.5 rounded border border-sand/60">
                      UPI
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge label={booking.paymentStatus} />
                  </td>
                  <td className="py-3.5 px-4 md:px-6 text-warmgray text-xs md:text-sm">
                    {booking.startDate}
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
