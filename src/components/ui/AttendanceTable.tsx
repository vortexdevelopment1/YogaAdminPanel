// Client component rendering daily attendance logs matched with Zoom sessions and subscribers

"use client";

import { AttendanceRecord, Booking, Slot } from "@/types";
import Badge from "@/components/ui/Badge";
import { getBookingById, getSlotName } from "@/lib/utils";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  bookings: Booking[];
  slots: Slot[];
}

export default function AttendanceTable({
  records,
  bookings,
  slots,
}: AttendanceTableProps) {
  if (records.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-sand p-12 text-center">
        <p className="text-base font-semibold text-charcoal">
          No attendance records found
        </p>
        <p className="text-sm text-warmgray mt-1">
          Try selecting a different date or clearing the active filters.
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
              <th className="py-3.5 px-4 md:px-6">Member</th>
              <th className="py-3.5 px-4">Email</th>
              <th className="py-3.5 px-4">Slot</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Join Time</th>
              <th className="py-3.5 px-4 md:px-6">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/60 text-sm text-charcoal">
            {records.map((record) => {
              const booking = getBookingById(record.bookingId, bookings);
              const name = booking ? booking.name : "Unknown Member";
              const email = booking ? booking.email : "-";
              const slotTime = booking
                ? getSlotName(booking.slotId, slots)
                : "-";

              return (
                <tr
                  key={`${record.bookingId}-${record.date}`}
                  className="hover:bg-cream/40 transition-colors"
                >
                  <td className="py-3.5 px-4 md:px-6 font-semibold text-forest">
                    {name}
                  </td>
                  <td className="py-3.5 px-4 text-warmgray text-xs md:text-sm">
                    {email}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-charcoal text-xs">
                    {slotTime}
                  </td>
                  <td className="py-3.5 px-4 text-warmgray text-xs font-medium">
                    {record.date}
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge label={record.joined ? "Present" : "Absent"} />
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-charcoal">
                    {record.joined && record.joinTime ? record.joinTime : "-"}
                  </td>
                  <td className="py-3.5 px-4 md:px-6 text-xs text-warmgray font-medium">
                    {record.joined && record.durationMins
                      ? `${record.durationMins} min`
                      : "-"}
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
