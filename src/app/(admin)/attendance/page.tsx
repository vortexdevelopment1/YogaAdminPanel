// Attendance tracking page displaying daily Zoom join verification, status breakdown, and attendee logs synced via AdminContext

"use client";

import { useState } from "react";
import { Users, UserCheck, UserX, TrendingUp, ShieldCheck } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import AttendanceTable from "@/components/ui/AttendanceTable";
import Pagination from "@/components/ui/Pagination";
import { useAdmin } from "@/context/AdminContext";
import { attendance } from "@/lib/mockData";
import {
  getAttendanceForDate,
  getPresentCount,
  getAbsentCount,
  getAttendanceRate,
  getBookingById,
} from "@/lib/utils";

const PAGE_SIZE = 8;

const availableDates = [
  { value: "2026-09-29", label: "Sep 29, 2026 (Today)" },
  { value: "2026-09-28", label: "Sep 28, 2026 (Yesterday)" },
  { value: "2026-09-27", label: "Sep 27, 2026" },
];

export default function AttendancePage() {
  const { bookings, slots } = useAdmin();

  const [selectedDate, setSelectedDate] = useState("2026-09-29");
  const [slotFilter, setSlotFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Get all attendance records for selected date
  const dateRecords = getAttendanceForDate(attendance, selectedDate);

  // Compute stat metrics for selected date
  const totalExpected = dateRecords.length;
  const presentCount = getPresentCount(dateRecords);
  const absentCount = getAbsentCount(dateRecords);
  const attendanceRate = getAttendanceRate(dateRecords);

  // Filter records based on active slot and status filters
  const filteredRecords = dateRecords.filter((record) => {
    const booking = getBookingById(record.bookingId, bookings);
    if (!booking) return false;

    const matchesSlot = slotFilter === "all" || booking.slotId === slotFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "Present" && record.joined) ||
      (statusFilter === "Absent" && !record.joined);

    return matchesSlot && matchesStatus;
  });

  // Calculate pagination bounds
  const totalPages = Math.ceil(filteredRecords.length / PAGE_SIZE) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleDateChange = (val: string) => {
    setSelectedDate(val);
    setCurrentPage(1);
  };

  const handleSlotChange = (val: string) => {
    setSlotFilter(val);
    setCurrentPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header & Subtitle */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-forest font-serif">
          Attendance
        </h1>
        <p className="text-sm text-warmgray mt-1">
          Zoom join logs matched with subscriptions
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Expected"
          value={totalExpected}
          icon={Users}
          hint="Active subscribers scheduled"
        />
        <StatCard
          title="Present"
          value={presentCount}
          icon={UserCheck}
          hint="Joined live Zoom class"
        />
        <StatCard
          title="Absent"
          value={absentCount}
          icon={UserX}
          hint="Did not join session"
        />
        <StatCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={TrendingUp}
          hint="Turnout percentage"
        />
      </div>

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
          {/* Date Selector */}
          <select
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            className="text-sm bg-white border border-sand rounded-xl px-3.5 py-2 text-charcoal font-medium focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition shadow-2xs cursor-pointer"
          >
            {availableDates.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>

          {/* Slot Filter */}
          <select
            value={slotFilter}
            onChange={(e) => handleSlotChange(e.target.value)}
            className="text-sm bg-white border border-sand rounded-xl px-3 py-2 text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition shadow-2xs cursor-pointer"
          >
            <option value="all">All Slots</option>
            {slots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.time}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-sm bg-white border border-sand rounded-xl px-3 py-2 text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition shadow-2xs cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>
        </div>

        {/* Verification Info Line */}
        <div className="flex items-center gap-1.5 text-xs text-warmgray font-medium">
          <ShieldCheck className="w-4 h-4 text-sage shrink-0" />
          <span>Verified via Zoom join logs and subscriber email</span>
        </div>
      </div>

      {/* Attendance Table & Pagination */}
      <div className="space-y-4">
        <AttendanceTable
          records={paginatedRecords}
          bookings={bookings}
          slots={slots}
        />

        {filteredRecords.length > PAGE_SIZE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>
    </div>
  );
}
