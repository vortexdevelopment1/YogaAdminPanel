// Zoom session card displaying meeting credentials, email restriction security status, cancellation state, and creation/join actions

"use client";

import { useState } from "react";
import {
  Video,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Plus,
} from "lucide-react";
import { ZoomSession, Slot } from "@/types";
import Badge from "@/components/ui/Badge";
import { maskMeetingId } from "@/lib/utils";

interface ZoomSessionCardProps {
  session: ZoomSession;
  slot?: Slot;
  onCreate: (sessionId: string) => void;
}

export default function ZoomSessionCard({
  session,
  slot,
  onCreate,
}: ZoomSessionCardProps) {
  const [showFullMeetingId, setShowFullMeetingId] = useState(false);
  const [copied, setCopied] = useState(false);

  const slotTime = slot ? slot.time : "Unknown Slot";
  const isNotCreated = session.status === "Not Created";
  const isCancelled = session.status === "Cancelled";
  const isLive = session.status === "Live";

  const handleCopyLink = () => {
    if (session.joinUrl && !isCancelled) {
      navigator.clipboard.writeText(session.joinUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-sand p-5 md:p-6 shadow-sm flex flex-col justify-between space-y-5">
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage/15 text-sage flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-forest font-serif">
                {slotTime}
              </h3>
              {isLive && (
                <span
                  className="w-2.5 h-2.5 rounded-full bg-[#A3382B] animate-pulse shrink-0"
                  title="Session is Live"
                />
              )}
            </div>
            <span className="text-xs text-warmgray font-medium">
              Daily Yoga Batch
            </span>
          </div>
        </div>

        <Badge label={session.status} />
      </div>

      {/* Body Content */}
      {isNotCreated ? (
        <div className="py-6 text-center space-y-2">
          <p className="text-sm text-warmgray font-medium">
            Meeting not created yet
          </p>
          <p className="text-xs text-warmgray/80">
            Generate an automated email-restricted Zoom session for this batch
          </p>
        </div>
      ) : (
        <div className={`space-y-2.5 text-xs md:text-sm py-1 ${isCancelled ? "opacity-75" : ""}`}>
          {/* Meeting ID */}
          <div className="flex items-center justify-between py-1 border-b border-sand/50">
            <span className="text-warmgray">Meeting ID:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-charcoal">
                {showFullMeetingId ? session.meetingId : maskMeetingId(session.meetingId)}
              </span>
              {!isCancelled && (
                <button
                  type="button"
                  onClick={() => setShowFullMeetingId((prev) => !prev)}
                  className="text-warmgray hover:text-charcoal p-0.5 rounded transition cursor-pointer"
                  title={showFullMeetingId ? "Hide Meeting ID" : "Show Meeting ID"}
                >
                  {showFullMeetingId ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Passcode */}
          <div className="flex items-center justify-between py-1 border-b border-sand/50">
            <span className="text-warmgray">Passcode:</span>
            <span className="font-mono font-semibold text-charcoal bg-sand/40 px-2 py-0.5 rounded">
              {session.passcode}
            </span>
          </div>

          {/* Pre-Registered Subscribers */}
          <div className="flex items-center justify-between py-1 border-b border-sand/50">
            <span className="text-warmgray">Registered:</span>
            <span className="font-semibold text-forest">
              {session.registeredCount} subscribers
            </span>
          </div>

          {/* Last Created */}
          <div className="flex items-center justify-between py-1 border-b border-sand/50">
            <span className="text-warmgray">Last Created:</span>
            <span className="text-charcoal font-medium">
              {session.lastCreatedAt}
            </span>
          </div>

          {/* Security / Restriction */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-warmgray">Access Security:</span>
            {session.emailRestricted ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E3F0E5] text-[#2F6B3D]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Email-Restricted: ON</span>
              </span>
            ) : (
              <span className="text-xs text-warmgray">Open Access</span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2">
        {isNotCreated ? (
          <button
            onClick={() => onCreate(session.id)}
            className="w-full py-2.5 px-4 rounded-xl font-medium text-sm bg-sage hover:bg-forest text-white flex items-center justify-center gap-2 shadow-2xs transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Meeting</span>
          </button>
        ) : isCancelled ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled
              title="Class cancelled"
              className="py-2 px-3 rounded-xl text-xs md:text-sm font-medium border border-sand bg-sand/40 text-warmgray/50 cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </button>

            <button
              disabled
              title="Class cancelled"
              className="py-2 px-3 rounded-xl text-xs md:text-sm font-medium bg-sand/50 text-warmgray/50 cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Zoom</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyLink}
              className={`py-2 px-3 rounded-xl text-xs md:text-sm font-medium border border-sand flex items-center justify-center gap-1.5 transition cursor-pointer ${
                copied
                  ? "bg-[#2F6B3D] text-white border-transparent"
                  : "bg-white text-charcoal hover:bg-sand/30"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              onClick={() => alert("Demo: Zoom meeting would open here")}
              className="py-2 px-3 rounded-xl text-xs md:text-sm font-medium bg-sage hover:bg-forest text-white flex items-center justify-center gap-1.5 shadow-2xs transition cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open Zoom</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
