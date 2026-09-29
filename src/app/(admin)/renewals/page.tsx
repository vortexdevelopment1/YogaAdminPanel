// Renewals page for monitoring expiring subscriptions, urgency tiers, and dispatching automated WhatsApp renewal reminders synced via AdminContext

"use client";

import { useState, useEffect } from "react";
import {
  CalendarClock,
  AlertTriangle,
  Send,
  CheckCircle,
  Info,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import RenewalsTable from "@/components/ui/RenewalsTable";
import { useAdmin } from "@/context/AdminContext";
import { getExpiringSoon, getDaysLeft } from "@/lib/utils";

const TODAY = "2026-09-29";

export default function RenewalsPage() {
  const { bookings, slots, sendRenewalReminder, sendAllReminders } = useAdmin();

  const [windowDays, setWindowDays] = useState<number>(7);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast notification after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Compute expiring bookings for selected window
  const expiringBookings = getExpiringSoon(bookings, TODAY, windowDays);

  // Computed metrics
  const totalExpiring = expiringBookings.length;
  const criticalCount = expiringBookings.filter(
    (b) => getDaysLeft(b, TODAY) <= 2
  ).length;
  const remindersSentCount = expiringBookings.filter(
    (b) => Boolean(b.reminderSentAt)
  ).length;

  // Single reminder handler
  const handleSendReminder = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    sendRenewalReminder(bookingId);
    setToastMessage(
      `Renewal reminder sent to ${booking ? booking.name : "subscriber"} on WhatsApp.`
    );
  };

  // Batch reminder handler for all pending subscribers in the current window
  const handleSendAllReminders = () => {
    const pendingIds = expiringBookings
      .filter((b) => !b.reminderSentAt)
      .map((b) => b.id);

    if (pendingIds.length === 0) {
      setToastMessage("All expiring subscribers in this window have already been reminded.");
      return;
    }

    sendAllReminders(pendingIds);
    setToastMessage(
      `Reminder sent to ${pendingIds.length} ${
        pendingIds.length === 1 ? "subscriber" : "subscribers"
      }.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 bg-[#E3F0E5] text-[#2F6B3D] border border-[#C9E2CC] px-4 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-5 h-5 shrink-0 text-[#2F6B3D]" />
          <span className="text-xs md:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Subtitle */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-forest font-serif">
          Renewals
        </h1>
        <p className="text-sm text-warmgray mt-1">
          Subscribers whose plan is ending soon
        </p>
      </div>

      {/* 3 Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title="Expiring in Window"
          value={totalExpiring}
          icon={CalendarClock}
          hint={`Active plans ending within next ${windowDays} days`}
        />
        <StatCard
          title="Critical"
          value={criticalCount}
          icon={AlertTriangle}
          hint="0 to 2 days left before expiration"
        />
        <StatCard
          title="Reminders Sent"
          value={remindersSentCount}
          icon={Send}
          hint="Subscribers notified via WhatsApp"
        />
      </div>

      {/* Filter Row & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-sand shadow-2xs">
        {/* Left: Window Filter Dropdown */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="renewal-window"
            className="text-xs md:text-sm font-semibold text-charcoal shrink-0"
          >
            Show expiring within:
          </label>
          <select
            id="renewal-window"
            value={windowDays}
            onChange={(e) => setWindowDays(Number(e.target.value))}
            className="bg-cream/40 border border-sand rounded-lg px-3 py-1.5 text-xs md:text-sm text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-sage transition cursor-pointer"
          >
            <option value={3}>3 days</option>
            <option value={7}>7 days</option>
            <option value={14}>14 days</option>
          </select>
        </div>

        {/* Right: Send All Reminders Button */}
        <button
          onClick={handleSendAllReminders}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-terracotta hover:bg-[#c2764c] text-white text-xs md:text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
          title="Send WhatsApp renewal reminders to all pending subscribers in this window"
        >
          <Send className="w-4 h-4" />
          <span>Send All Reminders</span>
        </button>
      </div>

      {/* Renewals Table */}
      <RenewalsTable
        bookings={expiringBookings}
        slots={slots}
        today={TODAY}
        onSendReminder={handleSendReminder}
      />

      {/* Production Info Banner */}
      <div className="bg-sand/40 border border-sand rounded-xl p-4.5 flex items-start gap-3 text-xs md:text-sm text-charcoal/80">
        <Info className="w-5 h-5 text-sage shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Real version mein ye reminders Meta WhatsApp Cloud API se automatically plan khatam hone se pehle jayenge.
        </p>
      </div>
    </div>
  );
}
