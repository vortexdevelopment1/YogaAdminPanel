// Client component rendering the list of automated WhatsApp notifications, statuses, and retry actions

"use client";

import { RotateCw } from "lucide-react";
import { WhatsAppMessage, Booking } from "@/types";
import Badge from "@/components/ui/Badge";
import { getBookingById } from "@/lib/utils";

interface MessagesTableProps {
  messages: WhatsAppMessage[];
  bookings: Booking[];
}

export default function MessagesTable({
  messages,
  bookings,
}: MessagesTableProps) {
  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-sand p-12 text-center">
        <p className="text-base font-semibold text-charcoal">No messages found</p>
        <p className="text-sm text-warmgray mt-1">
          Try adjusting your search keywords or filter criteria.
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
              <th className="py-3.5 px-4 md:px-6">Recipient</th>
              <th className="py-3.5 px-4">Message Type</th>
              <th className="py-3.5 px-4 max-w-xs">Preview</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Sent At</th>
              <th className="py-3.5 px-4 md:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/60 text-sm text-charcoal">
            {messages.map((message) => {
              const booking = getBookingById(message.bookingId, bookings);
              const name = booking ? booking.name : "Unknown Recipient";
              const phone = booking ? booking.phone : "-";

              return (
                <tr
                  key={message.id}
                  className="hover:bg-cream/40 transition-colors"
                >
                  <td className="py-3.5 px-4 md:px-6">
                    <div>
                      <p className="font-semibold text-forest">{name}</p>
                      <p className="text-xs text-warmgray font-mono">{phone}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-sand/50 text-charcoal">
                      {message.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="text-xs text-warmgray line-clamp-2 leading-relaxed">
                      {message.preview}
                    </p>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge label={message.status} />
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium text-warmgray whitespace-nowrap">
                    {message.sentAt}
                  </td>
                  <td className="py-3.5 px-4 md:px-6 text-right">
                    {message.status === "Failed" ? (
                      <button
                        onClick={() =>
                          alert(`Demo: Message resent to ${name} (${phone})`)
                        }
                        title="Resend Message"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F8E1DE] text-[#A3382B] hover:bg-[#F8E1DE]/80 transition cursor-pointer"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                        <span>Resend</span>
                      </button>
                    ) : (
                      <span className="text-warmgray/60">-</span>
                    )}
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
