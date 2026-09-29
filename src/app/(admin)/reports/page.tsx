// Reports page enabling client-side CSV exports for subscriber bookings, attendance logs, and web analytics synced via AdminContext

"use client";

import { useState } from "react";
import {
  CalendarCheck,
  UserCheck,
  BarChart3,
  Download,
  Info,
  Check,
} from "lucide-react";
import ReportCard from "@/components/ui/ReportCard";
import { convertToCSV, downloadCSV } from "@/lib/csv";
import { useAdmin } from "@/context/AdminContext";
import {
  attendance,
  trafficSources,
  pageDwell,
  journeySteps,
} from "@/lib/mockData";
import {
  buildBookingsReport,
  buildAttendanceReport,
  buildAnalyticsReport,
} from "@/lib/utils";

const periods = [
  { value: "september-2026", label: "September 2026" },
  { value: "august-2026", label: "August 2026" },
  { value: "july-2026", label: "July 2026" },
];

export default function ReportsPage() {
  const { bookings, slots } = useAdmin();

  const [selectedPeriod, setSelectedPeriod] = useState("september-2026");
  const [allDownloaded, setAllDownloaded] = useState(false);

  // Individual export handlers using live context store
  const handleDownloadBookings = () => {
    const { headers, rows } = buildBookingsReport(bookings, slots);
    const csvContent = convertToCSV(headers, rows);
    downloadCSV(`bookings-report-${selectedPeriod}.csv`, csvContent);
  };

  const handleDownloadAttendance = () => {
    const { headers, rows } = buildAttendanceReport(attendance, bookings, slots);
    const csvContent = convertToCSV(headers, rows);
    downloadCSV(`attendance-report-${selectedPeriod}.csv`, csvContent);
  };

  const handleDownloadAnalytics = () => {
    const { headers, rows } = buildAnalyticsReport(
      trafficSources,
      pageDwell,
      journeySteps
    );
    const csvContent = convertToCSV(headers, rows);
    downloadCSV(`analytics-report-${selectedPeriod}.csv`, csvContent);
  };

  // Download All handler
  const handleDownloadAll = () => {
    handleDownloadBookings();
    setTimeout(handleDownloadAttendance, 150);
    setTimeout(handleDownloadAnalytics, 300);

    setAllDownloaded(true);
    setTimeout(() => {
      setAllDownloaded(false);
    }, 2500);
  };

  const totalAnalyticsRecords =
    trafficSources.length + pageDwell.length + journeySteps.length;

  return (
    <div className="space-y-6">
      {/* Header Row: Left Title & Right Period Selector */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-forest font-serif">
            Reports
          </h1>
          <p className="text-sm text-warmgray mt-1">
            Download your data as CSV files
          </p>
        </div>

        {/* Compact Report Period Selector on the Right */}
        <div className="flex flex-col items-start md:items-end">
          <label
            htmlFor="period-select"
            className="text-xs font-semibold text-warmgray mb-1"
          >
            Report Period
          </label>
          <select
            id="period-select"
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="w-full md:w-56 text-sm bg-white border border-sand rounded-lg px-3 py-2 text-charcoal font-medium focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition shadow-2xs cursor-pointer"
          >
            {periods.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          <span className="text-[11px] text-warmgray mt-1">
            Demo: data is the same for all periods
          </span>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bookings Report */}
        <ReportCard
          title="Bookings Report"
          description="Complete records of all registered members, plans, payment statuses, and batch schedules."
          icon={CalendarCheck}
          recordCount={bookings.length}
          onDownload={handleDownloadBookings}
        />

        {/* Attendance Report */}
        <ReportCard
          title="Attendance Report"
          description="Daily Zoom attendee join logs, match verification, join timestamps, and session durations."
          icon={UserCheck}
          recordCount={attendance.length}
          onDownload={handleDownloadAttendance}
        />

        {/* Analytics Report */}
        <ReportCard
          title="Analytics Report"
          description="Summary breakdown of traffic sources, visitor engagement, page dwell times, and conversion funnel."
          icon={BarChart3}
          recordCount={totalAnalyticsRecords}
          onDownload={handleDownloadAnalytics}
        />
      </div>

      {/* Download All Button */}
      <div className="flex justify-start">
        <button
          onClick={handleDownloadAll}
          className={`py-3 px-6 rounded-xl font-medium text-sm flex items-center gap-2.5 shadow-xs transition-all cursor-pointer ${
            allDownloaded
              ? "bg-[#2F6B3D] text-white"
              : "bg-terracotta hover:bg-[#c2764c] text-white"
          }`}
        >
          {allDownloaded ? (
            <>
              <Check className="w-5 h-5" />
              <span>All 3 Reports Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download All Reports (ZIP / Batch)</span>
            </>
          )}
        </button>
      </div>

      {/* Production Integration Info Banner */}
      <div className="bg-sand/40 border border-sand rounded-xl p-4.5 flex items-start gap-3 text-xs md:text-sm text-charcoal/80">
        <Info className="w-5 h-5 text-sage shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Real version mein ye reports Zoom aur booking data se automatically monthly generate hongi.
        </p>
      </div>
    </div>
  );
}
