// TypeScript type definitions for Escape in Yoga Admin Panel

export type PaymentStatus =
  | "Paid"
  | "Pending"
  | "Failed"
  | "Refunded"
  | "Partial Refund";
export type SubStatus = "Active" | "Expired" | "Upcoming" | "Cancelled";

export type MessageType =
  | "Booking Confirmation"
  | "Payment Receipt"
  | "Class Reminder";

export type MessageStatus = "Sent" | "Delivered" | "Read" | "Failed";

export type MeetingStatus =
  | "Ready"
  | "Live"
  | "Completed"
  | "Not Created"
  | "Cancelled";

export interface Slot {
  id: string;
  time: string;
  capacity: number;
  filled: number;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  slotId: string;
  plan: "30-Day" | "7-Day";
  paymentStatus: PaymentStatus;
  status: SubStatus;
  startDate: string;
  cancelReason?: string;
  cancelNote?: string;
  refundType?: "Full" | "Partial" | "None";
  cancelledAt?: string;
  reminderSentAt?: string;
  source?: "Website" | "Manual";
  paymentMethod?: "UPI" | "Cash" | "Card" | "Bank Transfer";
  couponCode?: string;
  discountAmount?: number;
}

export interface TrafficSource {
  source: string;
  visitors: number;
}

export interface AttendanceRecord {
  bookingId: string;
  date: string; // "YYYY-MM-DD"
  joined: boolean;
  joinTime?: string; // e.g. "6:02 AM" (if joined is true)
  durationMins?: number; // duration in class (if joined is true)
}

export interface DailyVisitors {
  date: string; // e.g. "Sep 16"
  visitors: number;
}

export interface PageDwell {
  page: string; // e.g. "Home", "Postures", "Services", "Booking"
  avgSeconds: number;
}

export interface JourneyStep {
  step: string; // e.g. "Landing Page"
  visitors: number;
}

export interface WhatsAppMessage {
  id: string;
  bookingId: string;
  type: MessageType;
  status: MessageStatus;
  sentAt: string; // "2026-09-29 05:30"
  preview: string;
}

export interface ZoomSession {
  id: string;
  slotId: string;
  meetingId: string; // "845 2961 7730"
  passcode: string; // "yoga26"
  joinUrl: string; // "https://zoom.us/j/84529617730"
  status: MeetingStatus;
  emailRestricted: boolean; // BRD: only registered subscriber emails allowed
  registeredCount: number; // count of pre-registered subscribers
  lastCreatedAt: string; // "2026-09-29 04:00"
}

export interface MonthlyRevenue {
  month: string; // e.g. "Apr", "May" ...
  revenue: number; // in rupees
}

export interface CancelledClass {
  id: string;
  slotId: string;
  date: string; // "2026-09-29"
  reason: string; // dropdown ka reason
  note: string; // admin ka likha hua extra note (optional, khaali ho sakta hai)
}

export type NotificationType =
  | "New Booking"
  | "Slot Full"
  | "Payment Failed"
  | "Renewal Due"
  | "Class Cancelled"
  | "Seat Available";

export interface AppNotification {
  id: string; // stable id, e.g. "slotfull-2" or "payfail-b7"
  type: NotificationType;
  title: string; // "Slot is full"
  message: string; // "7:00 AM batch has reached 10/10 seats"
  link: string; // "/slots", "/bookings" etc.
}

export interface WaitlistEntry {
  id: string;
  name: string;
  email: string;
  phone: string;
  slotId: string;
  plan: "30-Day" | "7-Day";
  addedAt: string; // "2026-09-29"
  notified?: boolean; // "seat available" message sent or not
}

export interface Coupon {
  id: string;
  code: string; // "YOGA20" (always uppercase)
  type: "Percent" | "Flat";
  value: number; // 20 (%) or 500 (Rs.)
  applicablePlan: "All" | "30-Day" | "7-Day";
  validTill: string; // "2026-10-31"
  usageLimit: number;
  usedCount: number;
  active: boolean;
}

export interface Feedback {
  id: string;
  bookingId: string;
  slotId: string;
  rating: number; // 1 to 5
  comment: string;
  date: string; // "2026-09-28"
  reply?: string; // admin reply
}



