// Card component displaying subscriber review rating, comment, batch details, and admin reply thread

"use client";

import { MessageCircle, CornerDownRight, Clock } from "lucide-react";
import { Feedback, Slot, Booking } from "@/types";
import StarRating from "@/components/ui/StarRating";
import { getSlotName } from "@/lib/utils";

interface FeedbackCardProps {
  feedback: Feedback;
  slots: Slot[];
  bookings: Booking[];
  onOpenReply: (feedback: Feedback, subscriberName: string) => void;
}

export default function FeedbackCard({
  feedback,
  slots,
  bookings,
  onOpenReply,
}: FeedbackCardProps) {
  const matchingBooking = bookings.find((b) => b.id === feedback.bookingId);
  const subscriberName = matchingBooking ? matchingBooking.name : "Subscriber";
  const slotName = getSlotName(feedback.slotId, slots);

  return (
    <div className="bg-white rounded-xl border border-sand p-4 md:p-5 shadow-sm hover:border-sage/40 transition-colors space-y-3">
      {/* Top Header: Name, Slot & Star Rating */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-sage/20 text-forest flex items-center justify-center font-bold text-xs">
            {subscriberName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-sm text-forest leading-tight">
              {subscriberName}
            </h4>
            <span className="text-xs text-warmgray font-medium">
              {slotName}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StarRating rating={feedback.rating} size="sm" />
          <span className="text-xs text-warmgray font-mono">{feedback.date}</span>
        </div>
      </div>

      {/* Comment text */}
      <p className="text-xs md:text-sm text-charcoal leading-relaxed">
        {feedback.comment}
      </p>

      {/* Admin Reply or Reply Button */}
      {feedback.reply ? (
        <div className="bg-cream/60 border border-sand/70 rounded-lg p-3 text-xs space-y-1 mt-2">
          <div className="flex items-center gap-1.5 text-forest font-semibold">
            <CornerDownRight className="w-3.5 h-3.5 text-sage shrink-0" />
            <span>Your reply:</span>
          </div>
          <p className="text-charcoal pl-5 leading-relaxed italic">
            &ldquo;{feedback.reply}&rdquo;
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-end pt-1">
          <button
            type="button"
            onClick={() => onOpenReply(feedback, subscriberName)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sand bg-white hover:bg-cream/60 text-xs font-medium text-charcoal transition cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-sage" />
            <span>Reply</span>
          </button>
        </div>
      )}
    </div>
  );
}
