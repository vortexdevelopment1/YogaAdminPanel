// Dashboard page displaying synchronized summary statistics, slot occupancy chart, and recent bookings table from central AdminContext

"use client";

import Link from "next/link";
import {
  Users,
  UserCheck,
  Clock,
  CreditCard,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Badge from "@/components/ui/Badge";
import OccupancyChart from "@/components/charts/OccupancyChart";
import { useAdmin } from "@/context/AdminContext";
import {
  getActiveSubscribers,
  getPendingPayments,
  getOverallOccupancy,
  getSlotName,
  getExpiringSoon,
} from "@/lib/utils";

export default function DashboardPage() {
  const { bookings, slots } = useAdmin();

  const totalNonCancelled = bookings.filter((b) => b.status !== "Cancelled").length;
  const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;
  const activeSubscribers = getActiveSubscribers(bookings);
  const pendingPayments = getPendingPayments(bookings);
  const overallOccupancy = getOverallOccupancy(slots);
  const expiringIn7Days = getExpiringSoon(bookings, "2026-09-29", 7).length;

  const totalCapacity = slots.reduce((acc, s) => acc + s.capacity, 0);
  const totalBooked = slots.reduce((acc, s) => acc + s.filled, 0);

  // Take the 5 most recent bookings for the dashboard preview
  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-forest font-serif">
          Dashboard Overview
        </h1>
        <p className="text-sm text-warmgray mt-1">
          Welcome back! Here is what is happening with Escape in Yoga today.
        </p>
      </div>

      {/* 4 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Bookings"
          value={totalNonCancelled}
          icon={Users}
          hint={cancelledCount > 0 ? `${cancelledCount} cancelled` : "Active & upcoming registrations"}
        />
        <StatCard
          title="Active Members"
          value={activeSubscribers}
          icon={UserCheck}
          hint={`${expiringIn7Days} expiring in 7 days`}
        />
        <StatCard
          title="Overall Occupancy"
          value={`${overallOccupancy}%`}
          icon={Clock}
          hint="Across all daily slots"
        />
        <StatCard
          title="Pending Payments"
          value={pendingPayments}
          icon={CreditCard}
          hint="Requires follow-up"
        />
      </div>

      {/* Charts & Slot Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slot Occupancy Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-sand p-5 md:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-forest font-serif">
                Slot Occupancy
              </h2>
              <p className="text-xs text-warmgray">
                Live attendance capacity per time slot ({totalBooked}/{totalCapacity} booked)
              </p>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 bg-sand/50 text-charcoal rounded-md">
              Today
            </span>
          </div>
          <OccupancyChart slots={slots} />
        </div>

        {/* Quick Slot Status Summary */}
        <div className="bg-white rounded-xl border border-sand p-5 md:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-forest font-serif mb-1">
              Slot Summary
            </h2>
            <p className="text-xs text-warmgray mb-5">
              Available spots by time slot
            </p>

            <div className="space-y-4">
              {slots.map((slot) => {
                const percentage = slot.capacity > 0 ? Math.round((slot.filled / slot.capacity) * 100) : 0;
                const isFull = slot.filled >= slot.capacity;

                return (
                  <div key={slot.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-charcoal font-semibold">{slot.time}</span>
                      <span className={isFull ? "text-[#A3382B]" : "text-warmgray"}>
                        {slot.filled}/{slot.capacity} {isFull ? "(Full)" : "filled"}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full h-2 bg-sand/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFull ? "bg-[#D98B5F]" : "bg-sage"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-sand text-xs text-warmgray flex justify-between items-center">
            <span>Total Capacity: {totalCapacity}</span>
            <span className="font-semibold text-forest">
              {totalBooked} Booked
            </span>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-xl border border-sand shadow-sm overflow-hidden">
        <div className="p-5 md:p-6 border-b border-sand flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-forest font-serif">
              Recent Bookings
            </h2>
            <p className="text-xs text-warmgray mt-0.5">
              Latest members who registered for yoga batches
            </p>
          </div>
          <Link
            href="/bookings"
            className="text-xs font-semibold text-sage hover:text-forest transition-colors"
          >
            View all bookings &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-sand/30 text-xs font-semibold text-warmgray uppercase tracking-wider border-b border-sand">
                <th className="py-3 px-4 md:px-6">Member</th>
                <th className="py-3 px-4">Slot</th>
                <th className="py-3 px-4">Plan</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 md:px-6">Start Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/60 text-sm text-charcoal">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-cream/50 transition-colors">
                  <td className="py-3.5 px-4 md:px-6 font-medium">
                    <div>
                      <p className="text-charcoal font-semibold">{booking.name}</p>
                      <p className="text-xs text-warmgray">{booking.email}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-warmgray font-medium">
                    {getSlotName(booking.slotId, slots)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-sand/60 text-charcoal">
                      {booking.plan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge label={booking.paymentStatus} />
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge label={booking.status} />
                  </td>
                  <td className="py-3.5 px-4 md:px-6 text-warmgray text-xs font-medium">
                    {booking.startDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
