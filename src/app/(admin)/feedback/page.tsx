// Feedback and review management page displaying ratings breakdown, batch satisfaction, filter controls, and interactive subscriber reply modal

"use client";

import { useState } from "react";
import { Star, MessageSquare, ThumbsUp, Clock, Check } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import StatCard from "@/components/ui/StatCard";
import StarRating from "@/components/ui/StarRating";
import FeedbackCard from "@/components/ui/FeedbackCard";
import ReplyModal from "@/components/ui/ReplyModal";
import Pagination from "@/components/ui/Pagination";
import {
  getAverageRating,
  getRatingDistribution,
  getSlotRatings,
  getPositivePercent,
} from "@/lib/utils";
import { Feedback } from "@/types";

const PAGE_SIZE = 6;

export default function FeedbackPage() {
  const { feedbacks, slots, bookings, replyToFeedback } = useAdmin();

  const [slotFilter, setSlotFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<{
    feedback: Feedback;
    subscriberName: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Global metrics from all feedbacks
  const avgRating = getAverageRating(feedbacks);
  const totalReviews = feedbacks.length;
  const positivePercent = getPositivePercent(feedbacks);
  const awaitingReplyCount = feedbacks.filter((f) => !f.reply).length;

  const ratingDistribution = getRatingDistribution(feedbacks);
  const slotRatings = getSlotRatings(feedbacks, slots);

  // Filtered feedbacks
  const filteredFeedbacks = feedbacks
    .filter((f) => {
      const matchSlot = slotFilter === "all" || f.slotId === slotFilter;
      const matchRating =
        ratingFilter === "all" || f.rating === parseInt(ratingFilter, 10);
      return matchSlot && matchRating;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  // Pagination calculation
  const totalPages = Math.ceil(filteredFeedbacks.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedFeedbacks = filteredFeedbacks.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // Filter change handlers
  const handleSlotFilterChange = (val: string) => {
    setSlotFilter(val);
    setCurrentPage(1);
  };

  const handleRatingFilterChange = (val: string) => {
    setRatingFilter(val);
    setCurrentPage(1);
  };

  // Reply submit handler
  const handleSendReply = (reply: string) => {
    if (!replyTarget) return;
    replyToFeedback(replyTarget.feedback.id, reply);
    showToast(`Reply saved for ${replyTarget.subscriberName}.`);
    setReplyTarget(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-forest text-white shadow-lg text-sm font-medium animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-sage" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-forest font-serif">
          Feedback
        </h1>
        <p className="text-xs md:text-sm text-warmgray mt-1">
          What your subscribers are saying
        </p>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Average Rating"
          value={`${avgRating} / 5`}
          icon={Star}
          hint="Across all class batches"
        />
        <StatCard
          title="Total Reviews"
          value={totalReviews}
          icon={MessageSquare}
          hint="Subscriber feedback submissions"
        />
        <StatCard
          title="Positive"
          value={`${positivePercent}%`}
          icon={ThumbsUp}
          hint="4 & 5-star ratings"
        />
        <StatCard
          title="Awaiting Reply"
          value={awaitingReplyCount}
          icon={Clock}
          hint="Pending admin responses"
        />
      </div>

      {/* Breakdown & Batch Satisfaction Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rating Breakdown Card */}
        <div className="bg-white rounded-xl border border-sand p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-forest font-serif">
            Rating Breakdown
          </h3>

          <div className="space-y-2.5">
            {ratingDistribution.map(({ star, count }) => {
              const percent =
                totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-14 shrink-0 font-medium text-charcoal">
                    <span>{star}</span>
                    <Star className="w-3.5 h-3.5 fill-[#E0B45A] text-[#E0B45A]" />
                  </div>

                  <div className="flex-1 h-2.5 bg-sand/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sage rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="w-16 text-right font-mono text-warmgray shrink-0">
                    {count} ({percent}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rating by Batch Card */}
        <div className="bg-white rounded-xl border border-sand p-5 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-forest font-serif">
            Rating by Batch
          </h3>

          <div className="divide-y divide-sand/60 text-xs">
            {slotRatings.map((slot) => (
              <div
                key={slot.slot}
                className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2"
              >
                <div>
                  <p className="font-semibold text-charcoal">{slot.slot}</p>
                  <p className="text-[11px] text-warmgray">
                    {slot.count} {slot.count === 1 ? "review" : "reviews"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-forest font-mono">
                    {slot.avg > 0 ? slot.avg.toFixed(1) : "-"}
                  </span>
                  <StarRating rating={slot.avg} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-sand shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Batch Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-charcoal">Batch:</span>
            <select
              value={slotFilter}
              onChange={(e) => handleSlotFilterChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-sand bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-sage cursor-pointer"
            >
              <option value="all">All Batches</option>
              {slots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.time}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-charcoal">Rating:</span>
            <select
              value={ratingFilter}
              onChange={(e) => handleRatingFilterChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-sand bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-sage cursor-pointer"
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-warmgray">
          Showing <strong className="text-charcoal">{paginatedFeedbacks.length}</strong> of{" "}
          <strong className="text-charcoal">{filteredFeedbacks.length}</strong> reviews
        </span>
      </div>

      {/* Feedback List */}
      {filteredFeedbacks.length === 0 ? (
        <div className="bg-white rounded-xl border border-sand p-12 text-center">
          <p className="text-base font-semibold text-charcoal">
            No feedback found
          </p>
          <p className="text-sm text-warmgray mt-1">
            Try selecting a different batch or star rating filter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedFeedbacks.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              slots={slots}
              bookings={bookings}
              onOpenReply={(f, name) =>
                setReplyTarget({ feedback: f, subscriberName: name })
              }
            />
          ))}

          {/* Pagination */}
          {filteredFeedbacks.length > PAGE_SIZE && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(p) => setCurrentPage(p)}
            />
          )}
        </div>
      )}

      {/* Reply Modal */}
      <ReplyModal
        isOpen={Boolean(replyTarget)}
        feedback={replyTarget?.feedback || null}
        subscriberName={replyTarget?.subscriberName || ""}
        onSend={handleSendReply}
        onClose={() => setReplyTarget(null)}
      />
    </div>
  );
}
