// Client component rendering the list of expiring subscriptions in a structured responsive table with urgency badges and WhatsApp renewal reminders

"use client";

import { MessageCircle, Check } from "lucide-react";
import { Booking, Slot } from "@/types";
import Badge from "@/components/ui/Badge";
import {
  getSlotName,
  getEndDate,
  getDaysLeft,
  getRenewalUrgency,
} from "@/lib/utils";

interface RenewalsTableProps {
  bookings: Booking[];
  slots: Slot[];
  today?: string;
  onSendReminder: (bookingId: string) => void;
}

export default function RenewalsTable({
  bookings,
  slots,
  today = "2026-09-29",
  onSendReminder,
}: RenewalsTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-sand p-12 text-center">
        <p className="text-base font-semibold text-charcoal">
          No subscriptions expiring soon
        </p>
        <p className="text-sm text-warmgray mt-1">
          All active subscribers have ample time remaining in their current plan.
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
              <th className="py-3.5 px-4">Slot</th>
              <th className="py-3.5 px-4">Plan</th>
              <th className="py-3.5 px-4">End Date</th>
              <th className="py-3.5 px-4">Days Left</th>
              <th className="py-3.5 px-4">Urgency</th>
              <th className="py-3.5 px-4">Reminder</th>
              <th className="py-3.5 px-4 md:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/60 text-sm text-charcoal">
            {bookings.map((booking) => {
              const daysLeft = getDaysLeft(booking, today);
              const endDate = getEndDate(booking);
              const urgency = getRenewalUrgency(daysLeft);
              const isReminderSent = Boolean(booking.reminderSentAt);

              const daysLeftDisplay =
                daysLeft === 0
                  ? "Ends today"
                  : daysLeft === 1
                  ? "1 day"
                  : `${daysLeft} days`;

              return (
                <tr
                  key={booking.id}
                  className="hover:bg-cream/40 transition-colors"
                >
                  {/* Name & Email */}
                  <td className="py-3.5 px-4 md:px-6 font-medium">
                    <div>
                      <p className="font-semibold text-forest">{booking.name}</p>
                      <p className="text-xs text-warmgray">{booking.email}</p>
                    </div>
                  </td>

                  {/* Slot */}
                  <td className="py-3.5 px-4 font-medium text-charcoal text-xs md:text-sm">
                    {getSlotName(booking.slotId, slots)}
                  </td>

                  {/* Plan */}
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-sand/60 text-charcoal">
                      {booking.plan}
                    </span>
                  </td>

                  {/* End Date */}
                  <td className="py-3.5 px-4 text-warmgray text-xs md:text-sm font-medium">
                    {endDate}
                  </td>

                  {/* Days Left */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-semibold ${
                        daysLeft <= 2
                          ? "text-[#A3382B]"
                          : daysLeft <= 5
                          ? "text-[#8A6414]"
                          : "text-forest"
                      }`}
                    >
                      {daysLeftDisplay}
                    </span>
                  </td>

                  {/* Urgency */}
                  <td className="py-3.5 px-4">
                    <Badge label={urgency} />
                  </td>

                  {/* Reminder Status */}
                  <td className="py-3.5 px-4 text-xs">
                    {isReminderSent ? (
                      <span className="inline-flex items-center gap-1 font-medium text-[#2F6B3D]">
                        <Check className="w-3.5 h-3.5" />
                        <span>Sent on {booking.reminderSentAt}</span>
                      </span>
                    ) : (
                      <span className="text-warmgray font-medium">Not sent</span>
                    )}
                  </td>

                  {/* Action Button */}
                  <td className="py-3.5 px-4 md:px-6 text-right">
                    {isReminderSent ? (
                      <button
                        disabled
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sand/50 text-warmgray opacity-70 cursor-not-allowed"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Sent</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onSendReminder(booking.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sage hover:bg-forest text-white transition-colors cursor-pointer shadow-2xs"
                        title={`Send WhatsApp renewal reminder to ${booking.name}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Send Reminder</span>
                      </button>
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
