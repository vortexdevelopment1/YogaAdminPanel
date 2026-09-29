// Central React Context store managing synchronized state for Bookings, Slots, Zoom sessions, and Cancelled classes

"use client";

import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";
import {
  Booking,
  Slot,
  ZoomSession,
  CancelledClass,
  MeetingStatus,
  AppNotification,
  PaymentStatus,
  SubStatus,
  WaitlistEntry,
  Coupon,
  Feedback,
} from "@/types";
import {
  bookings as initialBookings,
  slots as initialSlots,
  zoomSessions as initialZoomSessions,
  waitlist as initialWaitlist,
  coupons as initialCoupons,
  feedbacks as initialFeedbacks,
} from "@/lib/mockData";
import {
  formatTime24To12,
  sortSlotsChronologically,
  buildNotifications,
  isDuplicateBooking,
  getNextBookingId,
  validateCoupon,
  calculateDiscount,
} from "@/lib/utils";

interface AdminContextType {
  bookings: Booking[];
  slots: Slot[];
  zoomSessions: ZoomSession[];
  cancelledClasses: CancelledClass[];
  notifications: AppNotification[];
  unreadCount: number;
  readNotificationIds: string[];
  waitlist: WaitlistEntry[];
  coupons: Coupon[];
  feedbacks: Feedback[];
  addSlot: (time24: string, capacity: number) => { success: boolean; error?: string };
  editSlot: (slotId: string, time24: string, capacity: number) => { success: boolean; error?: string };
  deleteSlot: (slotId: string) => void;
  addBooking: (data: {
    name: string;
    email: string;
    phone: string;
    slotId: string;
    plan: "30-Day" | "7-Day";
    paymentStatus: PaymentStatus;
    paymentMethod?: "UPI" | "Cash" | "Card" | "Bank Transfer";
    startDate: string;
    couponCode?: string;
  }) => string | null;
  cancelBooking: (
    bookingId: string,
    reason: string,
    note: string,
    refundType: "Full" | "Partial" | "None"
  ) => void;
  cancelClass: (slotId: string, reason: string, note: string) => void;
  undoCancelClass: (slotId: string) => void;
  createZoomMeeting: (sessionId: string) => void;
  sendRenewalReminder: (bookingId: string) => void;
  sendAllReminders: (bookingIds: string[]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addToWaitlist: (data: {
    name: string;
    email: string;
    phone: string;
    slotId: string;
    plan: "30-Day" | "7-Day";
  }) => string | null;
  removeFromWaitlist: (entryId: string) => void;
  promoteFromWaitlist: (entryId: string) => string | null;
  notifyWaitlistEntry: (entryId: string) => void;
  addCoupon: (data: {
    code: string;
    type: "Percent" | "Flat";
    value: number;
    applicablePlan: "All" | "30-Day" | "7-Day";
    validTill: string;
    usageLimit: number;
  }) => string | null;
  toggleCoupon: (id: string) => void;
  deleteCoupon: (id: string) => void;
  replyToFeedback: (id: string, reply: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [slotList, setSlotList] = useState<Slot[]>(initialSlots);
  const [zoomSessions, setZoomSessions] = useState<ZoomSession[]>(initialZoomSessions);
  const [cancelledClasses, setCancelledClasses] = useState<CancelledClass[]>([]);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(initialWaitlist);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(initialFeedbacks);

  // Dynamically calculate filled capacity for each slot based on Active & Upcoming bookings
  const slots: Slot[] = useMemo(() => {
    return slotList.map((slot) => {
      const filled = bookings.filter(
        (b) =>
          b.slotId === slot.id &&
          (b.status === "Active" || b.status === "Upcoming")
      ).length;

      return {
        ...slot,
        filled,
      };
    });
  }, [slotList, bookings]);

  // Keep Zoom sessions synced with actual slot capacity filled counts
  const syncedZoomSessions: ZoomSession[] = useMemo(() => {
    return zoomSessions.map((session) => {
      const foundSlot = slots.find((s) => s.id === session.slotId);
      return {
        ...session,
        registeredCount: foundSlot ? foundSlot.filled : session.registeredCount,
      };
    });
  }, [zoomSessions, slots]);

  // Add a new slot and create corresponding Zoom session
  const addSlot = (
    time24: string,
    capacity: number
  ): { success: boolean; error?: string } => {
    const formattedTime = formatTime24To12(time24);
    const duplicate = slotList.some(
      (s) => s.time.toLowerCase() === formattedTime.toLowerCase()
    );

    if (duplicate) {
      return { success: false, error: "A slot with this time already exists" };
    }

    const newSlotId = "s" + Date.now();
    const newSlot: Slot = {
      id: newSlotId,
      time: formattedTime,
      capacity,
      filled: 0,
    };

    setSlotList((prev) => sortSlotsChronologically([...prev, newSlot]));

    const newSession: ZoomSession = {
      id: "zs-" + newSlotId,
      slotId: newSlotId,
      meetingId: "",
      passcode: "",
      joinUrl: "",
      status: "Not Created",
      emailRestricted: false,
      registeredCount: 0,
      lastCreatedAt: "-",
    };

    setZoomSessions((prev) => [...prev, newSession]);
    return { success: true };
  };

  // Edit slot time and capacity with validation against current filled seats
  const editSlot = (
    slotId: string,
    time24: string,
    capacity: number
  ): { success: boolean; error?: string } => {
    const formattedTime = formatTime24To12(time24);
    const duplicate = slotList.some(
      (s) =>
        s.id !== slotId &&
        s.time.toLowerCase() === formattedTime.toLowerCase()
    );

    if (duplicate) {
      return { success: false, error: "A slot with this time already exists" };
    }

    const currentSlot = slots.find((s) => s.id === slotId);
    const currentFilled = currentSlot ? currentSlot.filled : 0;
    if (capacity < currentFilled) {
      return {
        success: false,
        error: `Capacity cannot be less than filled seats (${currentFilled})`,
      };
    }

    setSlotList((prev) =>
      sortSlotsChronologically(
        prev.map((s) =>
          s.id === slotId ? { ...s, time: formattedTime, capacity } : s
        )
      )
    );

    return { success: true };
  };

  // Delete a slot, removing its zoom session and cancelled class history
  const deleteSlot = (slotId: string) => {
    setSlotList((prev) => prev.filter((s) => s.id !== slotId));
    setZoomSessions((prev) => prev.filter((zs) => zs.slotId !== slotId));
    setCancelledClasses((prev) => prev.filter((c) => c.slotId !== slotId));
  };

  // Add a manual subscriber booking with validation and slot capacity checking
  const addBooking = (data: {
    name: string;
    email: string;
    phone: string;
    slotId: string;
    plan: "30-Day" | "7-Day";
    paymentStatus: PaymentStatus;
    paymentMethod?: "UPI" | "Cash" | "Card" | "Bank Transfer";
    startDate: string;
    couponCode?: string;
  }): string | null => {
    const targetSlot = slots.find((s) => s.id === data.slotId);
    if (!targetSlot) {
      return "Selected slot does not exist";
    }

    if (targetSlot.capacity > 0 && targetSlot.filled >= targetSlot.capacity) {
      return "This slot is full";
    }

    if (isDuplicateBooking(bookings, data.email, data.slotId)) {
      return "This email already has an active booking in this slot";
    }

    let couponCode: string | undefined = undefined;
    let discountAmount: number | undefined = undefined;

    if (data.couponCode && data.couponCode.trim()) {
      const validation = validateCoupon(
        coupons,
        data.couponCode,
        data.plan,
        "2026-09-29"
      );
      if (!validation.valid || !validation.coupon) {
        return validation.error || "Invalid coupon code";
      }

      couponCode = validation.coupon.code;
      discountAmount = calculateDiscount(validation.coupon, data.plan);

      // Increment coupon usage count
      setCoupons((prev) =>
        prev.map((c) =>
          c.id === validation.coupon!.id
            ? { ...c, usedCount: c.usedCount + 1 }
            : c
        )
      );
    }

    const status: SubStatus =
      data.startDate <= "2026-09-29" ? "Active" : "Upcoming";

    const newBooking: Booking = {
      id: getNextBookingId(bookings),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      slotId: data.slotId,
      plan: data.plan,
      paymentStatus: data.paymentStatus,
      status,
      startDate: data.startDate,
      source: "Manual",
      paymentMethod:
        data.paymentMethod ||
        (data.paymentStatus === "Paid" ? "Cash" : undefined),
      couponCode,
      discountAmount,
    };

    setBookings((prev) => [newBooking, ...prev]);
    return null;
  };

  // Cancel a subscriber booking with refund calculation
  const cancelBooking = (
    bookingId: string,
    reason: string,
    note: string,
    refundType: "Full" | "Partial" | "None"
  ) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;

        let newPaymentStatus = b.paymentStatus;
        if (b.paymentStatus === "Paid") {
          if (refundType === "Full") {
            newPaymentStatus = "Refunded";
          } else if (refundType === "Partial") {
            newPaymentStatus = "Partial Refund";
          } else {
            newPaymentStatus = "Paid";
          }
        }

        return {
          ...b,
          status: "Cancelled",
          paymentStatus: newPaymentStatus,
          cancelReason: reason,
          cancelNote: note,
          refundType,
          cancelledAt: "2026-09-29",
        };
      })
    );
  };

  // Cancel a daily class batch and update Zoom session status
  const cancelClass = (slotId: string, reason: string, note: string) => {
    const newEntry: CancelledClass = {
      id: "c" + Date.now(),
      slotId,
      date: "2026-09-29",
      reason,
      note,
    };

    setCancelledClasses((prev) => [...prev, newEntry]);
    setZoomSessions((prev) =>
      prev.map((zs) =>
        zs.slotId === slotId ? { ...zs, status: "Cancelled" } : zs
      )
    );
  };

  // Undo class cancellation and restore Zoom meeting status
  const undoCancelClass = (slotId: string) => {
    setCancelledClasses((prev) => prev.filter((c) => c.slotId !== slotId));
    setZoomSessions((prev) =>
      prev.map((zs) => {
        if (zs.slotId !== slotId) return zs;
        const newStatus: MeetingStatus =
          zs.meetingId && zs.meetingId.trim() !== ""
            ? "Ready"
            : "Not Created";
        return { ...zs, status: newStatus };
      })
    );
  };

  // Generate a Zoom meeting link for a session
  const createZoomMeeting = (sessionId: string) => {
    setZoomSessions((prev) =>
      prev.map((zs) =>
        zs.id === sessionId
          ? {
              ...zs,
              status: "Ready",
              emailRestricted: true,
              meetingId: "512 3478 9021",
              passcode: "yoga26",
              joinUrl: "https://zoom.us/j/51234789021",
              lastCreatedAt: "2026-09-29 12:00",
            }
          : zs
      )
    );
  };

  // Send renewal reminder to a single subscriber
  const sendRenewalReminder = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, reminderSentAt: "2026-09-29" }
          : b
      )
    );
  };

  // Send renewal reminders in batch to multiple subscribers
  const sendAllReminders = (bookingIds: string[]) => {
    const idSet = new Set(bookingIds);
    setBookings((prev) =>
      prev.map((b) =>
        idSet.has(b.id)
          ? { ...b, reminderSentAt: "2026-09-29" }
          : b
      )
    );
  };

  // Add a subscriber to the waitlist
  const addToWaitlist = (data: {
    name: string;
    email: string;
    phone: string;
    slotId: string;
    plan: "30-Day" | "7-Day";
  }): string | null => {
    const normEmail = data.email.trim().toLowerCase();

    const alreadyOnWaitlist = waitlist.some(
      (w) =>
        w.email.trim().toLowerCase() === normEmail && w.slotId === data.slotId
    );
    if (alreadyOnWaitlist) {
      return "This email is already on the waitlist";
    }

    if (isDuplicateBooking(bookings, data.email, data.slotId)) {
      return "This email already has a booking in this slot";
    }

    const newEntry: WaitlistEntry = {
      id: "w" + Date.now(),
      name: data.name.trim(),
      email: normEmail,
      phone: data.phone.trim(),
      slotId: data.slotId,
      plan: data.plan,
      addedAt: "2026-09-29",
      notified: false,
    };

    setWaitlist((prev) => [...prev, newEntry]);
    return null;
  };

  // Remove an entry from the waitlist
  const removeFromWaitlist = (entryId: string) => {
    setWaitlist((prev) => prev.filter((w) => w.id !== entryId));
  };

  // Promote an entry from waitlist to an active booking
  const promoteFromWaitlist = (entryId: string): string | null => {
    const entry = waitlist.find((w) => w.id === entryId);
    if (!entry) return "Waitlist entry not found";

    const targetSlot = slots.find((s) => s.id === entry.slotId);
    if (!targetSlot) return "Slot not found";

    if (targetSlot.capacity > 0 && targetSlot.filled >= targetSlot.capacity) {
      return "No seat available in this slot";
    }

    const newBooking: Booking = {
      id: getNextBookingId(bookings),
      name: entry.name,
      email: entry.email,
      phone: entry.phone,
      slotId: entry.slotId,
      plan: entry.plan,
      paymentStatus: "Pending",
      paymentMethod: "UPI",
      startDate: "2026-09-29",
      status: "Active",
      source: "Manual",
    };

    setBookings((prev) => [newBooking, ...prev]);
    setWaitlist((prev) => prev.filter((w) => w.id !== entryId));
    return null;
  };

  // Add a new coupon
  const addCoupon = (data: {
    code: string;
    type: "Percent" | "Flat";
    value: number;
    applicablePlan: "All" | "30-Day" | "7-Day";
    validTill: string;
    usageLimit: number;
  }): string | null => {
    const upperCode = data.code.trim().toUpperCase();
    if (coupons.some((c) => c.code.toUpperCase() === upperCode)) {
      return "Coupon code already exists";
    }

    const newCoupon: Coupon = {
      id: "cp-" + Date.now(),
      code: upperCode,
      type: data.type,
      value: data.value,
      applicablePlan: data.applicablePlan,
      validTill: data.validTill,
      usageLimit: data.usageLimit,
      usedCount: 0,
      active: true,
    };

    setCoupons((prev) => [newCoupon, ...prev]);
    return null;
  };

  // Toggle active status of a coupon
  const toggleCoupon = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  // Delete a coupon
  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  // Reply to a subscriber feedback review
  const replyToFeedback = (id: string, reply: string) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, reply: reply.trim() } : f))
    );
  };

  // Mark waitlist entry as notified
  const notifyWaitlistEntry = (entryId: string) => {
    setWaitlist((prev) =>
      prev.map((w) => (w.id === entryId ? { ...w, notified: true } : w))
    );
  };

  // Real-time generated notifications derived from live context state
  const notifications: AppNotification[] = useMemo(() => {
    return buildNotifications(
      bookings,
      slots,
      cancelledClasses,
      "2026-09-29",
      waitlist
    );
  }, [bookings, slots, cancelledClasses, waitlist]);

  // Real-time unread notifications count
  const unreadCount: number = useMemo(() => {
    return notifications.filter((n) => !readNotificationIds.includes(n.id)).length;
  }, [notifications, readNotificationIds]);

  // Mark a single notification as read
  const markNotificationRead = (id: string) => {
    setReadNotificationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  // Mark all current notifications as read
  const markAllNotificationsRead = () => {
    setReadNotificationIds(notifications.map((n) => n.id));
  };

  return (
    <AdminContext.Provider
      value={{
        bookings,
        slots,
        zoomSessions: syncedZoomSessions,
        cancelledClasses,
        notifications,
        unreadCount,
        readNotificationIds,
        waitlist,
        coupons,
        feedbacks,
        addSlot,
        editSlot,
        deleteSlot,
        addBooking,
        cancelBooking,
        cancelClass,
        undoCancelClass,
        createZoomMeeting,
        sendRenewalReminder,
        sendAllReminders,
        markNotificationRead,
        markAllNotificationsRead,
        addToWaitlist,
        removeFromWaitlist,
        promoteFromWaitlist,
        notifyWaitlistEntry,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        replyToFeedback,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
