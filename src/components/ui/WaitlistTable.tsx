// Client component rendering the list of waitlisted subscribers in a structured responsive table with queue positions, seat availability status, and promote/notify actions

"use client";

import { MessageCircle, UserPlus, Trash2, Check } from "lucide-react";
import { WaitlistEntry, Slot } from "@/types";
import Badge from "@/components/ui/Badge";
import {
  getSlotName,
  getWaitlistPosition,
  hasSeatAvailable,
} from "@/lib/utils";

interface WaitlistTableProps {
  entries: WaitlistEntry[];
  slots: Slot[];
  fullWaitlist: WaitlistEntry[];
  onPromote: (id: string) => void;
  onRemove: (id: string) => void;
  onNotify: (id: string) => void;
}

export default function WaitlistTable({
  entries,
  slots,
  fullWaitlist,
  onPromote,
  onRemove,
  onNotify,
}: WaitlistTableProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-sand p-12 text-center">
        <p className="text-base font-semibold text-charcoal">
          No one on the waitlist
        </p>
        <p className="text-sm text-warmgray mt-1">
          There are currently no subscribers waiting for a seat.
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
              <th className="py-3.5 px-4 md:px-6">Pos</th>
              <th className="py-3.5 px-4">Name</th>
              <th className="py-3.5 px-4">Phone</th>
              <th className="py-3.5 px-4">Slot</th>
              <th className="py-3.5 px-4">Plan</th>
              <th className="py-3.5 px-4">Added On</th>
              <th className="py-3.5 px-4">Seat</th>
              <th className="py-3.5 px-4 md:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/60 text-sm text-charcoal">
            {entries.map((entry) => {
              const targetSlot = slots.find((s) => s.id === entry.slotId);
              const position = getWaitlistPosition(fullWaitlist, entry);
              const isSeatFree = targetSlot ? hasSeatAvailable(targetSlot) : false;

              return (
                <tr
                  key={entry.id}
                  className="hover:bg-cream/40 transition-colors"
                >
                  {/* Position Queue Number */}
                  <td className="py-3.5 px-4 md:px-6 font-bold text-forest font-mono text-xs md:text-sm">
                    #{position}
                  </td>

                  {/* Name & Email */}
                  <td className="py-3.5 px-4 font-medium">
                    <div>
                      <p className="font-semibold text-forest">{entry.name}</p>
                      <p className="text-xs text-warmgray">{entry.email}</p>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-4 text-warmgray font-mono text-xs">
                    {entry.phone}
                  </td>

                  {/* Slot */}
                  <td className="py-3.5 px-4 font-medium text-charcoal text-xs md:text-sm">
                    {getSlotName(entry.slotId, slots)}
                  </td>

                  {/* Plan */}
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-sand/60 text-charcoal">
                      {entry.plan}
                    </span>
                  </td>

                  {/* Added On */}
                  <td className="py-3.5 px-4 text-warmgray text-xs md:text-sm">
                    {entry.addedAt}
                  </td>

                  {/* Seat Availability Badge */}
                  <td className="py-3.5 px-4">
                    <Badge label={isSeatFree ? "Seat Free" : "Waiting"} />
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 md:px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Notify Button */}
                      {entry.notified ? (
                        <button
                          disabled
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-sand/40 text-warmgray opacity-70 cursor-not-allowed"
                          title="WhatsApp message already sent"
                        >
                          <Check className="w-3.5 h-3.5 text-[#2F6B3D]" />
                          <span>Notified</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onNotify(entry.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-sand bg-white hover:bg-sand/30 text-charcoal transition cursor-pointer"
                          title={`Send seat availability message to ${entry.name}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-sage" />
                          <span>Notify</span>
                        </button>
                      )}

                      {/* Promote to Booking Button */}
                      {isSeatFree ? (
                        <button
                          type="button"
                          onClick={() => onPromote(entry.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-sage hover:bg-forest text-white transition cursor-pointer shadow-2xs"
                          title={`Promote ${entry.name} to active bookings`}
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Promote</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-sand/40 text-warmgray/60 opacity-40 cursor-not-allowed"
                          title="No seat available in this slot"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Promote</span>
                        </button>
                      )}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => onRemove(entry.id)}
                        className="p-1 rounded-lg text-warmgray hover:text-[#A3382B] hover:bg-[#F8E1DE]/50 transition cursor-pointer"
                        title={`Remove ${entry.name} from waitlist`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
