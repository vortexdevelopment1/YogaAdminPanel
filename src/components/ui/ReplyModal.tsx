// Modal dialog for responding to subscriber feedback reviews

"use client";

import { useState, useEffect } from "react";
import { X, MessageCircle, AlertCircle, Quote } from "lucide-react";
import { Feedback } from "@/types";
import StarRating from "@/components/ui/StarRating";

interface ReplyModalProps {
  isOpen: boolean;
  feedback: Feedback | null;
  subscriberName: string;
  onSend: (reply: string) => void;
  onClose: () => void;
}

export default function ReplyModal({
  isOpen,
  feedback,
  subscriberName,
  onSend,
  onClose,
}: ReplyModalProps) {
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setReplyText(feedback?.reply || "");
      setError(null);
    }
  }, [isOpen, feedback]);

  if (!isOpen || !feedback) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) {
      setError("Please write a reply");
      return;
    }

    onSend(replyText.trim());
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-sand w-full max-w-md p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative custom-scrollbar animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-warmgray hover:text-charcoal p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage/15 text-sage flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-forest font-serif">
              Reply to Feedback
            </h2>
            <p className="text-xs text-warmgray">
              Response for {subscriberName}
            </p>
          </div>
        </div>

        {/* Feedback Quote Box */}
        <div className="mb-4 p-3.5 rounded-lg bg-cream/50 border border-sand/70 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-xs text-forest">
              {subscriberName}
            </span>
            <StarRating rating={feedback.rating} />
          </div>
          <div className="flex items-start gap-2 text-xs text-charcoal italic">
            <Quote className="w-3.5 h-3.5 text-sage shrink-0 mt-0.5" />
            <p className="leading-relaxed">&ldquo;{feedback.comment}&rdquo;</p>
          </div>
          <div className="text-[11px] text-warmgray font-mono text-right">
            {feedback.date}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-3 flex items-center gap-2 p-2.5 rounded-lg bg-[#F8E1DE] text-[#A3382B] text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Reply Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Your Reply <span className="text-terracotta">*</span>
            </label>
            <textarea
              rows={4}
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Write a warm, helpful response to the subscriber..."
              className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-sage resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs md:text-sm font-medium border border-sand text-charcoal hover:bg-sand/30 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs md:text-sm font-medium bg-sage hover:bg-forest text-white transition shadow-xs cursor-pointer"
            >
              Send Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
