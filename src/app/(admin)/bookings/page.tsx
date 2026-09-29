// Client page for viewing, searching, filtering, cancelling, and paginating subscriber bookings with interactive slide-over details drawer synced via AdminContext

"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Plus } from "lucide-react";
import BookingsTable from "@/components/ui/BookingsTable";
import FilterBar from "@/components/ui/FilterBar";
import Pagination from "@/components/ui/Pagination";
import BookingDrawer from "@/components/ui/BookingDrawer";
import CancelBookingModal from "@/components/ui/CancelBookingModal";
import AddBookingModal from "@/components/ui/AddBookingModal";
import { useAdmin } from "@/context/AdminContext";
import { attendance } from "@/lib/mockData";
import { Booking, PaymentStatus } from "@/types";

const PAGE_SIZE = 8;

export default function BookingsPage() {
  const { bookings, slots, cancelBooking, addBooking, addToWaitlist } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [slotFilter, setSlotFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Add Booking modal state
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Drawer state
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Cancellation state
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
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

  // Handle filter changes and reset to page 1
  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
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

  const handlePaymentChange = (val: string) => {
    setPaymentFilter(val);
    setCurrentPage(1);
  };

  // Open drawer handler
  const handleOpenDrawer = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDrawerOpen(true);
  };

  // Open cancellation modal
  const handleInitiateCancel = (booking: Booking) => {
    setBookingToCancel(booking);
  };

  // Confirm booking cancellation via context store
  const handleConfirmCancel = (
    reason: string,
    note: string,
    refundType: "Full" | "Partial" | "None"
  ) => {
    if (!bookingToCancel) return;

    cancelBooking(bookingToCancel.id, reason, note, refundType);

    let toastText = `Booking cancelled. No refund. WhatsApp message sent to ${bookingToCancel.name}.`;
    if (bookingToCancel.paymentStatus === "Paid") {
      if (refundType === "Full") {
        toastText = `Booking cancelled. Full refund initiated. WhatsApp message sent to ${bookingToCancel.name}.`;
      } else if (refundType === "Partial") {
        toastText = `Booking cancelled. Partial refund initiated. WhatsApp message sent to ${bookingToCancel.name}.`;
      }
    }

    setToastMessage(toastText);
    setBookingToCancel(null);
  };

  // Handle adding new manual booking
  const handleSaveNewBooking = (data: {
    name: string;
    email: string;
    phone: string;
    slotId: string;
    plan: "30-Day" | "7-Day";
    paymentStatus: PaymentStatus;
    paymentMethod?: "UPI" | "Cash" | "Card" | "Bank Transfer";
    startDate: string;
  }) => {
    const error = addBooking(data);
    if (error) {
      return error;
    }

    setIsAddOpen(false);
    setCurrentPage(1);
    setToastMessage(`Booking added for ${data.name}. WhatsApp confirmation sent.`);
    return null;
  };

  // Handle adding subscriber to waitlist from booking modal
  const handleAddToWaitlist = (data: {
    name: string;
    email: string;
    phone: string;
    slotId: string;
    plan: "30-Day" | "7-Day";
  }) => {
    const error = addToWaitlist(data);
    if (error) {
      return error;
    }

    setIsAddOpen(false);
    setToastMessage(`${data.name} added to waitlist.`);
    return null;
  };

  // Filter bookings based on active criteria
  const filteredBookings = bookings.filter((booking) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      booking.name.toLowerCase().includes(query) ||
      booking.email.toLowerCase().includes(query) ||
      booking.phone.toLowerCase().includes(query);

    const matchesSlot = slotFilter === "all" || booking.slotId === slotFilter;
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || booking.paymentStatus === paymentFilter;

    return matchesSearch && matchesSlot && matchesStatus && matchesPayment;
  });

  // Calculate pagination bounds
  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // Latest booking data for drawer
  const currentDrawerBooking = selectedBooking
    ? bookings.find((b) => b.id === selectedBooking.id) || selectedBooking
    : null;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 bg-[#E3F0E5] text-[#2F6B3D] border border-[#C9E2CC] px-4 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-5 h-5 shrink-0 text-[#2F6B3D]" />
          <span className="text-xs md:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Subtitle with Add Booking Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-forest font-serif">
            Bookings
          </h1>
          <p className="text-sm text-warmgray mt-1">
            Manage all subscriber bookings
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="self-start sm:self-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sage hover:bg-forest text-white text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Booking</span>
        </button>
      </div>

      {/* Summary count */}
      <div className="flex items-center justify-between text-xs md:text-sm text-warmgray">
        <span>
          Showing <strong className="text-charcoal">{paginatedBookings.length}</strong> of{" "}
          <strong className="text-charcoal">{filteredBookings.length}</strong> bookings (Total: {bookings.length})
        </span>
      </div>

      {/* Filter & Search Bar */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        slotFilter={slotFilter}
        onSlotChange={handleSlotChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        paymentFilter={paymentFilter}
        onPaymentChange={handlePaymentChange}
        slots={slots}
      />

      {/* Bookings Table with Pagination */}
      <div className="space-y-4">
        <BookingsTable
          bookings={paginatedBookings}
          slots={slots}
          onView={handleOpenDrawer}
          onCancel={handleInitiateCancel}
        />

        {filteredBookings.length > PAGE_SIZE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Subscriber Details Slide-over Drawer */}
      <BookingDrawer
        isOpen={isDrawerOpen}
        booking={currentDrawerBooking}
        slots={slots}
        attendance={attendance}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Cancel Booking Modal */}
      <CancelBookingModal
        isOpen={Boolean(bookingToCancel)}
        booking={bookingToCancel}
        onConfirm={handleConfirmCancel}
        onClose={() => setBookingToCancel(null)}
      />

      {/* Add Manual Booking Modal */}
      <AddBookingModal
        isOpen={isAddOpen}
        slots={slots}
        onSave={handleSaveNewBooking}
        onAddToWaitlist={handleAddToWaitlist}
        onClose={() => setIsAddOpen(false)}
      />
    </div>
  );
}
