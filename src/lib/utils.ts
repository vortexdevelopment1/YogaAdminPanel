// Helper utility functions for calculations, slot lookup, occupancy, analytics, attendance, CSV reports, WhatsApp messaging, Zoom sessions, day locking, and revenue analytics in Escape in Yoga

import {
  Booking,
  Slot,
  TrafficSource,
  PageDwell,
  JourneyStep,
  AttendanceRecord,
  WhatsAppMessage,
  MessageStatus,
  ZoomSession,
  MeetingStatus,
  MonthlyRevenue,
  CancelledClass,
  AppNotification,
  NotificationType,
  WaitlistEntry,
  Coupon,
  Feedback,
} from "@/types";

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Returns total count of bookings
 */
export function getTotalBookings(bookings: Booking[]): number {
  return bookings.length;
}

/**
 * Returns count of active subscribers
 */
export function getActiveSubscribers(bookings: Booking[]): number {
  return bookings.filter((b) => b.status === "Active").length;
}

/**
 * Returns count of bookings with pending payment
 */
export function getPendingPayments(bookings: Booking[]): number {
  return bookings.filter((b) => b.paymentStatus === "Pending").length;
}

/**
 * Calculates overall slot occupancy percentage
 */
export function getOverallOccupancy(slots: Slot[]): number {
  if (!slots.length) return 0;
  const totalCapacity = slots.reduce((acc, slot) => acc + slot.capacity, 0);
  const totalFilled = slots.reduce((acc, slot) => acc + slot.filled, 0);
  if (totalCapacity === 0) return 0;
  return Math.round((totalFilled / totalCapacity) * 100);
}

/**
 * Returns the formatted time name of a slot by its ID
 */
export function getSlotName(slotId: string, slots: Slot[]): string {
  const foundSlot = slots.find((slot) => slot.id === slotId);
  return foundSlot ? foundSlot.time : "Unknown Slot";
}

/**
 * Returns remaining available seats in a slot
 */
export function getSeatsAvailable(slot: Slot): number {
  return Math.max(0, slot.capacity - slot.filled);
}

/**
 * Returns the occupancy percentage of a slot
 */
export function getOccupancyPercent(slot: Slot): number {
  if (slot.capacity === 0) return 0;
  return Math.round((slot.filled / slot.capacity) * 100);
}

/**
 * Returns occupancy status label based on percentage
 */
export function getSlotStatus(slot: Slot): "Full" | "Filling Fast" | "Available" {
  const percent = getOccupancyPercent(slot);
  if (percent >= 100) return "Full";
  if (percent >= 75) return "Filling Fast";
  return "Available";
}

/**
 * Returns all bookings assigned to a specific slot ID
 */
export function getBookingsForSlot(slotId: string, bookings: Booking[]): Booking[] {
  return bookings.filter((b) => b.slotId === slotId);
}

/**
 * Converts a 24-hour time string ("18:00") into 12-hour format ("6:00 PM")
 */
export function formatTime24To12(time24: string): string {
  if (!time24) return "";
  const [hourStr, minStr] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const minute = minStr || "00";
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${period}`;
}

/**
 * Converts a 12-hour time string ("6:00 PM") into 24-hour format ("18:00") for HTML time inputs
 */
export function formatTime12To24(time12: string): string {
  if (!time12) return "06:00";
  const match = time12.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return "06:00";
  let hour = parseInt(match[1], 10);
  const minute = match[2];
  const period = match[3].toUpperCase();

  if (period === "PM" && hour < 12) hour += 12;
  if (period === "AM" && hour === 12) hour = 0;

  const paddedHour = hour.toString().padStart(2, "0");
  return `${paddedHour}:${minute}`;
}

/**
 * Helper to sort slots chronologically by time of day
 */
export function sortSlotsChronologically(slots: Slot[]): Slot[] {
  const parseToMinutes = (timeStr: string): number => {
    const time24 = formatTime12To24(timeStr);
    const [h, m] = time24.split(":").map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  return [...slots].sort((a, b) => parseToMinutes(a.time) - parseToMinutes(b.time));
}

/**
 * Calculates sum of all traffic sources visitors
 */
export function getTotalVisitors(sources: TrafficSource[]): number {
  return sources.reduce((acc, curr) => acc + curr.visitors, 0);
}

/**
 * Finds the top traffic source name by visitor count
 */
export function getTopSource(sources: TrafficSource[]): string {
  if (!sources.length) return "None";
  const sorted = [...sources].sort((a, b) => b.visitors - a.visitors);
  return sorted[0].source;
}

/**
 * Calculates average dwell time across all measured pages in seconds
 */
export function getAvgDwellSeconds(pageDwell: PageDwell[]): number {
  if (!pageDwell.length) return 0;
  const total = pageDwell.reduce((acc, curr) => acc + curr.avgSeconds, 0);
  return Math.round(total / pageDwell.length);
}

/**
 * Formats duration in seconds into "Xm Ys" format
 */
export function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
}

/**
 * Calculates funnel conversion rate from first step to final step
 */
export function getConversionRate(steps: JourneyStep[]): string {
  if (steps.length < 2 || steps[0].visitors === 0) return "0.0%";
  const first = steps[0].visitors;
  const last = steps[steps.length - 1].visitors;
  return `${((last / first) * 100).toFixed(1)}%`;
}

/**
 * Calculates percentage drop-off between consecutive funnel steps
 */
export function getDropOffPercent(current: number, next: number): number {
  if (current <= 0) return 0;
  const drop = current - next;
  return Math.max(0, Math.round((drop / current) * 100));
}

/**
 * Filters attendance records for a specific date (YYYY-MM-DD)
 */
export function getAttendanceForDate(
  records: AttendanceRecord[],
  date: string
): AttendanceRecord[] {
  return records.filter((r) => r.date === date);
}

/**
 * Counts joined/present attendees
 */
export function getPresentCount(records: AttendanceRecord[]): number {
  return records.filter((r) => r.joined).length;
}

/**
 * Counts absent attendees
 */
export function getAbsentCount(records: AttendanceRecord[]): number {
  return records.filter((r) => !r.joined).length;
}

/**
 * Calculates attendance percentage rate
 */
export function getAttendanceRate(records: AttendanceRecord[]): number {
  if (!records.length) return 0;
  const present = getPresentCount(records);
  return Math.round((present / records.length) * 100);
}

/**
 * Finds a booking object by its ID
 */
export function getBookingById(
  bookingId: string,
  bookings: Booking[]
): Booking | undefined {
  return bookings.find((b) => b.id === bookingId);
}

/**
 * Counts WhatsApp messages by specific delivery status
 */
export function getMessageCountByStatus(
  messages: WhatsAppMessage[],
  status: MessageStatus
): number {
  return messages.filter((m) => m.status === status).length;
}

/**
 * Calculates percentage delivery rate (Delivered + Read / Total)
 */
export function getDeliveryRate(messages: WhatsAppMessage[]): number {
  if (!messages.length) return 0;
  const deliveredOrRead = messages.filter(
    (m) => m.status === "Delivered" || m.status === "Read"
  ).length;
  return Math.round((deliveredOrRead / messages.length) * 100);
}

/**
 * Returns list of failed messages
 */
export function getFailedMessages(messages: WhatsAppMessage[]): WhatsAppMessage[] {
  return messages.filter((m) => m.status === "Failed");
}

/**
 * Counts messages sent today
 */
export function getSentTodayCount(
  messages: WhatsAppMessage[],
  todayDate: string = "2026-09-29"
): number {
  return messages.filter((m) => m.sentAt.startsWith(todayDate)).length;
}

/**
 * Counts Zoom sessions by meeting status
 */
export function getSessionCountByStatus(
  sessions: ZoomSession[],
  status: MeetingStatus
): number {
  return sessions.filter((s) => s.status === status).length;
}

/**
 * Counts email restricted Zoom sessions
 */
export function getRestrictedCount(sessions: ZoomSession[]): number {
  return sessions.filter((s) => s.emailRestricted).length;
}

/**
 * Masks meeting ID to hide middle digits e.g. "845 2961 7730" -> "845 **** 7730"
 */
export function maskMeetingId(id: string): string {
  if (!id || id.trim() === "") return "-";
  const parts = id.trim().split(" ");
  if (parts.length >= 3) {
    return `${parts[0]} **** ${parts[parts.length - 1]}`;
  }
  if (id.length > 6) {
    return `${id.slice(0, 3)} **** ${id.slice(-4)}`;
  }
  return id;
}

/**
 * Returns total days for plan ("30-Day" => 30, "7-Day" => 7)
 */
export function getPlanDays(plan: "30-Day" | "7-Day"): number {
  return plan === "30-Day" ? 30 : 7;
}

/**
 * Returns total pricing in INR for plan
 */
export function getPlanPrice(plan: "30-Day" | "7-Day"): number {
  return plan === "30-Day" ? 2999 : 999;
}

/**
 * Computes which day of the plan today represents (Day 1 on startDate)
 * Returns 0 if startDate is in the future.
 */
export function getDayNumber(
  startDateStr: string,
  todayStr: string = "2026-09-29"
): number {
  if (!startDateStr) return 0;
  const start = new Date(startDateStr);
  const today = new Date(todayStr);

  // Normalize hours to avoid DST / timezone issues
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - start.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 0; // Starts in the future
  return diffDays + 1;
}

/**
 * Determines day lock status based on current subscription day
 */
export function getDayStatus(
  dayIndex: number,
  currentDay: number
): "completed" | "today" | "locked" {
  if (currentDay === 0 || dayIndex > currentDay) return "locked";
  if (dayIndex === currentDay) return "today";
  return "completed";
}

/**
 * Calculates unlock calendar date for a given subscription day index
 */
export function getUnlockDate(startDateStr: string, dayIndex: number): string {
  if (!startDateStr) return "";
  const date = new Date(startDateStr);
  date.setDate(date.getDate() + (dayIndex - 1));

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Returns all attendance records for a specific booking ID
 */
export function getAttendanceForBooking(
  bookingId: string,
  records: AttendanceRecord[]
): AttendanceRecord[] {
  return records.filter((r) => r.bookingId === bookingId);
}

/**
 * Builds structured headers and rows for Bookings CSV export
 */
export function buildBookingsReport(bookings: Booking[], slots: Slot[]) {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Slot",
    "Plan",
    "Payment Status",
    "Status",
    "Start Date",
    "Cancel Reason",
    "Refund Type",
  ];

  const rows = bookings.map((b) => [
    b.name,
    b.email,
    b.phone,
    getSlotName(b.slotId, slots),
    b.plan,
    b.paymentStatus,
    b.status,
    b.startDate,
    b.cancelReason || "-",
    b.refundType ? `${b.refundType} Refund` : "-",
  ]);

  return { headers, rows };
}

/**
 * Builds structured headers and rows for Attendance CSV export
 */
export function buildAttendanceReport(
  records: AttendanceRecord[],
  bookings: Booking[],
  slots: Slot[]
) {
  const headers = [
    "Name",
    "Email",
    "Slot",
    "Date",
    "Status",
    "Join Time",
    "Duration (mins)",
  ];

  const rows = records.map((r) => {
    const booking = getBookingById(r.bookingId, bookings);
    return [
      booking ? booking.name : "Unknown",
      booking ? booking.email : "-",
      booking ? getSlotName(booking.slotId, slots) : "-",
      r.date,
      r.joined ? "Present" : "Absent",
      r.joined && r.joinTime ? r.joinTime : "",
      r.joined && r.durationMins !== undefined ? r.durationMins : "",
    ];
  });

  return { headers, rows };
}

/**
 * Builds structured headers and rows for Analytics CSV export with categorized sections
 */
export function buildAnalyticsReport(
  trafficSources: TrafficSource[],
  pageDwell: PageDwell[],
  journeySteps: JourneyStep[]
) {
  const headers = ["Report Section", "Metric / Step", "Value / Count"];

  const rows: (string | number)[][] = [
    // Section 1: Traffic Sources
    ...trafficSources.map((s) => ["Traffic Sources", s.source, s.visitors]),
    ["", "", ""],
    // Section 2: Page Dwell Time
    ...pageDwell.map((p) => [
      "Page Dwell Time",
      p.page,
      `${p.avgSeconds} seconds (${formatSeconds(p.avgSeconds)})`,
    ]),
    ["", "", ""],
    // Section 3: Visitor Journey Funnel
    ...journeySteps.map((j) => ["Visitor Funnel", j.step, j.visitors]),
  ];

  return { headers, rows };
}

/**
 * Returns net price for a booking after any coupon discount applied
 */
export function getBookingAmount(booking: Booking): number {
  const basePrice = getPlanPrice(booking.plan);
  const discount = booking.discountAmount || 0;
  return Math.max(0, basePrice - discount);
}

/**
 * Returns net revenue from subscriptions:
 * Sum of Paid booking amounts + Partial Refund net amounts (amount - refund). Refunded is 0.
 */
export function getTotalRevenue(bookings: Booking[]): number {
  return bookings.reduce((sum, b) => {
    if (b.paymentStatus === "Paid") {
      return sum + getBookingAmount(b);
    }
    if (b.paymentStatus === "Partial Refund") {
      return sum + (getBookingAmount(b) - getRefundAmount(b));
    }
    return sum;
  }, 0);
}

/**
 * Returns sum of net amounts for all Pending bookings
 */
export function getPendingAmount(bookings: Booking[]): number {
  return bookings
    .filter((b) => b.paymentStatus === "Pending")
    .reduce((sum, b) => sum + getBookingAmount(b), 0);
}

/**
 * Returns sum of net amounts for all Failed bookings
 */
export function getFailedAmount(bookings: Booking[]): number {
  return bookings
    .filter((b) => b.paymentStatus === "Failed")
    .reduce((sum, b) => sum + getBookingAmount(b), 0);
}

/**
 * Returns total refunded amount across all bookings
 */
export function getTotalRefundedAmount(bookings: Booking[]): number {
  return bookings.reduce((sum, b) => sum + getRefundAmount(b), 0);
}

/**
 * Returns breakdown of net revenue and count per plan
 */
export function getRevenueByPlan(bookings: Booking[]): {
  plan: "30-Day" | "7-Day";
  revenue: number;
  count: number;
}[] {
  const getNetRevenueForPlan = (plan: "30-Day" | "7-Day") => {
    const planBookings = bookings.filter((b) => b.plan === plan);
    const revenue = planBookings.reduce((sum, b) => {
      if (b.paymentStatus === "Paid") return sum + getBookingAmount(b);
      if (b.paymentStatus === "Partial Refund")
        return sum + (getBookingAmount(b) - getRefundAmount(b));
      return sum;
    }, 0);
    const count = planBookings.filter(
      (b) => b.paymentStatus === "Paid" || b.paymentStatus === "Partial Refund"
    ).length;
    return { revenue, count };
  };

  const thirty = getNetRevenueForPlan("30-Day");
  const seven = getNetRevenueForPlan("7-Day");

  return [
    { plan: "30-Day", revenue: thirty.revenue, count: thirty.count },
    { plan: "7-Day", revenue: seven.revenue, count: seven.count },
  ];
}

/**
 * Returns revenue breakdown per slot taking into account Paid and Partial Refund subscriptions
 */
export function getRevenueBySlot(
  bookings: Booking[],
  slots: Slot[]
): { slot: string; revenue: number }[] {
  return slots.map((s) => {
    const slotBookings = bookings.filter((b) => b.slotId === s.id);
    const revenue = slotBookings.reduce((sum, b) => {
      if (b.paymentStatus === "Paid") return sum + getBookingAmount(b);
      if (b.paymentStatus === "Partial Refund")
        return sum + (getBookingAmount(b) - getRefundAmount(b));
      return sum;
    }, 0);
    return {
      slot: s.time,
      revenue,
    };
  });
}

/**
 * Formats a number as an Indian Rupee string (e.g. "Rs. 1,24,500")
 */
export function formatRupees(amount: number): string {
  return `Rs. ${amount.toLocaleString("en-IN")}`;
}

/**
 * Calculates percentage growth from previous month to current month
 */
export function getMonthGrowth(monthly: MonthlyRevenue[]): number {
  if (monthly.length < 2) return 0;
  const current = monthly[monthly.length - 1].revenue;
  const previous = monthly[monthly.length - 2].revenue;
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * Calculates refunded amount for a booking based on its payment/refund status
 */
export function getRefundAmount(booking: Booking): number {
  const fullPrice = getBookingAmount(booking);
  if (booking.paymentStatus === "Refunded") {
    return fullPrice;
  }
  if (booking.paymentStatus === "Partial Refund") {
    return Math.round(fullPrice / 2);
  }
  return 0;
}

/**
 * Calculates subscription end date string ("YYYY-MM-DD") based on plan duration
 * End date = startDate + (planDays - 1) days
 */
export function getEndDate(booking: Booking): string {
  if (!booking.startDate) return "";
  const [year, month, day] = booking.startDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const totalDays = getPlanDays(booking.plan);
  date.setDate(date.getDate() + (totalDays - 1));

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Calculates remaining days until subscription ends from reference date (default "2026-09-29")
 * Returns minimum 0.
 */
export function getDaysLeft(
  booking: Booking,
  todayStr: string = "2026-09-29"
): number {
  const endDateStr = getEndDate(booking);
  if (!endDateStr) return 0;
  const [ey, em, ed] = endDateStr.split("-").map(Number);
  const [ty, tm, td] = todayStr.split("-").map(Number);

  const end = new Date(ey, em - 1, ed);
  const today = new Date(ty, tm - 1, td);

  const diffTime = end.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Filters and returns active bookings expiring within specified number of days (sorted ascending by days left)
 */
export function getExpiringSoon(
  bookings: Booking[],
  today: string = "2026-09-29",
  withinDays: number = 7
): Booking[] {
  return bookings
    .filter((b) => {
      if (b.status !== "Active") return false;
      const daysLeft = getDaysLeft(b, today);
      return daysLeft <= withinDays;
    })
    .sort((a, b) => getDaysLeft(a, today) - getDaysLeft(b, today));
}

/**
 * Returns renewal urgency category based on days left
 */
export function getRenewalUrgency(
  daysLeft: number
): "Critical" | "Soon" | "Upcoming Renewal" {
  if (daysLeft <= 2) return "Critical";
  if (daysLeft <= 5) return "Soon";
  return "Upcoming Renewal";
}

/**
 * Builds synchronized notifications list based on real-time slots, bookings, waitlist, and cancellation state
 */
export function buildNotifications(
  bookings: Booking[],
  slots: Slot[],
  cancelledClasses: CancelledClass[],
  today: string = "2026-09-29",
  waitlist: WaitlistEntry[] = []
): AppNotification[] {
  // 1. Payment Failed alerts (exclude cancelled bookings)
  const paymentFailedNotifs: AppNotification[] = bookings
    .filter((b) => b.paymentStatus === "Failed" && b.status !== "Cancelled")
    .map((b) => ({
      id: `payfail-${b.id}`,
      type: "Payment Failed",
      title: "Payment failed",
      message: `${b.name} - ${b.plan} transaction could not be processed`,
      link: "/bookings",
    }));

  // 2. Slot Full alerts
  const slotFullNotifs: AppNotification[] = slots
    .filter((s) => s.capacity > 0 && s.filled >= s.capacity)
    .map((s) => ({
      id: `slotfull-${s.id}`,
      type: "Slot Full",
      title: "Slot is full",
      message: `${s.time} batch has reached maximum capacity (${s.filled}/${s.capacity} seats)`,
      link: "/slots",
    }));

  // 3. Seat Available alerts (free seats available in a slot that has subscribers waiting on waitlist)
  const seatAvailableNotifs: AppNotification[] = slots
    .filter(
      (s) =>
        s.filled < s.capacity && getWaitlistForSlot(waitlist, s.id).length > 0
    )
    .map((s) => {
      const waitlistCount = getWaitlistForSlot(waitlist, s.id).length;
      const freeSeats = s.capacity - s.filled;
      return {
        id: `seat-${s.id}`,
        type: "Seat Available",
        title: "Seat available",
        message: `${freeSeats} ${
          freeSeats === 1 ? "seat" : "seats"
        } free in ${s.time} batch. ${waitlistCount} on waitlist.`,
        link: "/waitlist",
      };
    });

  // 4. Renewal Due alerts (0-2 days remaining, without reminder sent, max 3)
  const renewalDueNotifs: AppNotification[] = getExpiringSoon(bookings, today, 2)
    .filter((b) => !b.reminderSentAt)
    .slice(0, 3)
    .map((b) => {
      const days = getDaysLeft(b, today);
      return {
        id: `renew-${b.id}`,
        type: "Renewal Due",
        title: "Renewal reminder due",
        message: `${b.name}'s ${b.plan} plan expires in ${
          days === 0 ? "today" : `${days} ${days === 1 ? "day" : "days"}`
        }`,
        link: "/renewals",
      };
    });

  // 5. Class Cancelled alerts
  const classCancelledNotifs: AppNotification[] = cancelledClasses.map((c) => ({
    id: `cancel-${c.id}`,
    type: "Class Cancelled",
    title: "Class cancelled",
    message: `${getSlotName(c.slotId, slots)} class was cancelled: ${c.reason}`,
    link: "/slots",
  }));

  // 6. New Booking alerts (start date today or adjacent, active/upcoming, max 3)
  const newBookingNotifs: AppNotification[] = bookings
    .filter(
      (b) =>
        (b.status === "Active" || b.status === "Upcoming") &&
        (b.startDate === today ||
          b.startDate === "2026-09-28" ||
          b.startDate === "2026-10-01" ||
          b.startDate === "2026-10-02")
    )
    .slice(0, 3)
    .map((b) => ({
      id: `newbook-${b.id}`,
      type: "New Booking",
      title: "New booking received",
      message: `${b.name} registered for ${getSlotName(b.slotId, slots)} (${b.plan})`,
      link: "/bookings",
    }));

  // Combine in priority order and limit to max 12
  return [
    ...paymentFailedNotifs,
    ...slotFullNotifs,
    ...seatAvailableNotifs,
    ...renewalDueNotifs,
    ...classCancelledNotifs,
    ...newBookingNotifs,
  ].slice(0, 12);
}

/**
 * Returns visual color tokens and icon identifier for a notification type
 */
export function getNotificationStyle(type: NotificationType): {
  iconName: "UserPlus" | "Users" | "AlertCircle" | "CalendarClock" | "Ban";
  bg: string;
  text: string;
} {
  switch (type) {
    case "New Booking":
      return { iconName: "UserPlus", bg: "#E3F0E5", text: "#2F6B3D" };
    case "Slot Full":
      return { iconName: "Users", bg: "#FBF0D9", text: "#8A6414" };
    case "Seat Available":
      return { iconName: "UserPlus", bg: "#E3F0E5", text: "#2F6B3D" };
    case "Payment Failed":
      return { iconName: "AlertCircle", bg: "#F8E1DE", text: "#A3382B" };
    case "Renewal Due":
      return { iconName: "CalendarClock", bg: "#FBF0D9", text: "#8A6414" };
    case "Class Cancelled":
      return { iconName: "Ban", bg: "#EFEAE0", text: "#7A7A72" };
  }
}

/**
 * Returns sorted waitlist entries for a specific slot ordered earliest addedAt first
 */
export function getWaitlistForSlot(
  waitlist: WaitlistEntry[],
  slotId: string
): WaitlistEntry[] {
  return waitlist
    .filter((w) => w.slotId === slotId)
    .sort((a, b) => a.addedAt.localeCompare(b.addedAt));
}

/**
 * Returns 1-based queue position of a waitlist entry within its target slot
 */
export function getWaitlistPosition(
  waitlist: WaitlistEntry[],
  entry: WaitlistEntry
): number {
  const slotList = getWaitlistForSlot(waitlist, entry.slotId);
  const index = slotList.findIndex((w) => w.id === entry.id);
  return index >= 0 ? index + 1 : 1;
}

/**
 * Checks whether a slot has remaining open capacity
 */
export function hasSeatAvailable(slot: Slot): boolean {
  return slot.filled < slot.capacity;
}


/**
 * Validates email format with simple regex
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Validates exactly 10-digit phone number
 */
export function isValidPhone(phone: string): boolean {
  return /^\d{10}$/.test(phone.trim());
}

/**
 * Checks if an active or upcoming booking already exists for the email in the specified slot
 */
export function isDuplicateBooking(
  bookings: Booking[],
  email: string,
  slotId: string
): boolean {
  const normEmail = email.trim().toLowerCase();
  return bookings.some(
    (b) =>
      b.email.trim().toLowerCase() === normEmail &&
      b.slotId === slotId &&
      (b.status === "Active" || b.status === "Upcoming")
  );
}

/**
 * Generates next sequential unique booking ID based on existing bookings
 */
export function getNextBookingId(bookings: Booking[]): string {
  let maxNum = 100;
  for (const b of bookings) {
    const match = b.id.match(/^BK-(\d+)$/i);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `BK-${maxNum + 1}`;
}

/**
 * Returns coupon lifecycle status based on active flag, validity date, and usage limit
 * Order: Inactive -> Expired -> Used Up -> Active
 */
export function getCouponStatus(
  coupon: Coupon,
  today: string = "2026-09-29"
): "Active" | "Inactive" | "Expired" | "Used Up" {
  if (!coupon.active) return "Inactive";
  if (coupon.validTill < today) return "Expired";
  if (coupon.usedCount >= coupon.usageLimit) return "Used Up";
  return "Active";
}

/**
 * Calculates discount amount in rupees for a coupon and subscription plan
 */
export function calculateDiscount(
  coupon: Coupon,
  plan: "30-Day" | "7-Day"
): number {
  const price = getPlanPrice(plan);
  let discount = 0;
  if (coupon.type === "Percent") {
    discount = Math.round((price * coupon.value) / 100);
  } else {
    discount = coupon.value;
  }
  return Math.min(price, Math.max(0, discount));
}

/**
 * Validates a coupon code against existence, active status, expiration, usage limit, and plan applicability
 */
export function validateCoupon(
  coupons: Coupon[],
  code: string,
  plan: "30-Day" | "7-Day",
  today: string = "2026-09-29"
): { valid: boolean; error?: string; coupon?: Coupon } {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, error: "Invalid coupon code" };
  }

  const found = coupons.find((c) => c.code.toUpperCase() === cleanCode);
  if (!found) {
    return { valid: false, error: "Invalid coupon code" };
  }

  if (!found.active) {
    return { valid: false, error: "Coupon is inactive" };
  }

  if (found.validTill < today) {
    return { valid: false, error: "Coupon has expired" };
  }

  if (found.usedCount >= found.usageLimit) {
    return { valid: false, error: "Coupon usage limit reached" };
  }

  if (found.applicablePlan !== "All" && found.applicablePlan !== plan) {
    return { valid: false, error: "Coupon not valid for this plan" };
  }

  return { valid: true, coupon: found };
}

/**
 * Calculates average rating from feedbacks rounded to one decimal place
 */
export function getAverageRating(feedbacks: Feedback[]): number {
  if (feedbacks.length === 0) return 0;
  const sum = feedbacks.reduce((acc, f) => acc + f.rating, 0);
  return parseFloat((sum / feedbacks.length).toFixed(1));
}

/**
 * Returns distribution of star ratings from 5 stars down to 1 star
 */
export function getRatingDistribution(
  feedbacks: Feedback[]
): { star: number; count: number }[] {
  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  feedbacks.forEach((f) => {
    const r = Math.min(5, Math.max(1, Math.round(f.rating)));
    counts[r] = (counts[r] || 0) + 1;
  });

  return [
    { star: 5, count: counts[5] },
    { star: 4, count: counts[4] },
    { star: 3, count: counts[3] },
    { star: 2, count: counts[2] },
    { star: 1, count: counts[1] },
  ];
}

/**
 * Returns average rating and review count per batch slot
 */
export function getSlotRatings(
  feedbacks: Feedback[],
  slots: Slot[]
): { slot: string; avg: number; count: number }[] {
  return slots.map((s) => {
    const slotFeedbacks = feedbacks.filter((f) => f.slotId === s.id);
    const avg = getAverageRating(slotFeedbacks);
    return {
      slot: s.time,
      avg,
      count: slotFeedbacks.length,
    };
  });
}

/**
 * Calculates percentage of positive reviews (4 or 5 stars)
 */
export function getPositivePercent(feedbacks: Feedback[]): number {
  if (feedbacks.length === 0) return 0;
  const positiveCount = feedbacks.filter((f) => f.rating >= 4).length;
  return Math.round((positiveCount / feedbacks.length) * 100);
}






