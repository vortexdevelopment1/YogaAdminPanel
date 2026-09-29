// Zoom session manager page for configuring automated batch meetings, email restrictions, and meeting links synced via AdminContext

"use client";

import { Video, Radio, ShieldCheck, AlertCircle, Info } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import ZoomSessionCard from "@/components/ui/ZoomSessionCard";
import { useAdmin } from "@/context/AdminContext";
import { getSessionCountByStatus, getRestrictedCount } from "@/lib/utils";

export default function ZoomPage() {
  const { zoomSessions, slots, createZoomMeeting } = useAdmin();

  // Compute stat metrics from synchronized context
  const totalSessions = zoomSessions.length;
  const liveCount = getSessionCountByStatus(zoomSessions, "Live");
  const restrictedCount = getRestrictedCount(zoomSessions);
  const notCreatedCount = getSessionCountByStatus(zoomSessions, "Not Created");

  return (
    <div className="space-y-8">
      {/* Header & Subtitle */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-forest font-serif">
          Zoom Sessions
        </h1>
        <p className="text-sm text-warmgray mt-1">
          Email-restricted meetings generated via Zoom API
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Sessions"
          value={totalSessions}
          icon={Video}
          hint="Configured daily batch meetings"
        />
        <StatCard
          title="Live Now"
          value={liveCount}
          icon={Radio}
          hint="Currently streaming batch"
        />
        <StatCard
          title="Email-Restricted"
          value={`${restrictedCount} / ${totalSessions}`}
          icon={ShieldCheck}
          hint="Protected from link sharing"
        />
        <StatCard
          title="Not Created"
          value={notCreatedCount}
          icon={AlertCircle}
          hint="Requires meeting setup"
        />
      </div>

      {/* Zoom Session Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-forest font-serif">
            Batch Meeting Rooms
          </h2>
          <span className="text-xs text-warmgray">
            {zoomSessions.length} scheduled rooms
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {zoomSessions.map((session) => {
            const slot = slots.find((s) => s.id === session.slotId);
            return (
              <ZoomSessionCard
                key={session.id}
                session={session}
                slot={slot}
                onCreate={createZoomMeeting}
              />
            );
          })}
        </div>
      </div>

      {/* Zoom Security Info Banner */}
      <div className="bg-sand/40 border border-sand rounded-xl p-4.5 flex items-start gap-3 text-xs md:text-sm text-charcoal/80">
        <Info className="w-5 h-5 text-sage shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Real version mein Zoom API har subscriber ka email pre-register karegi, jisse sirf wahi email join kar payega aur link share karne se access nahi milega.
        </p>
      </div>
    </div>
  );
}
