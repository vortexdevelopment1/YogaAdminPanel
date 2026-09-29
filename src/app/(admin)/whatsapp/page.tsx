// WhatsApp notification log page displaying automated message delivery stats, filter controls, and retry triggers synced via AdminContext

"use client";

import { useState } from "react";
import {
  MessageSquare,
  CheckCheck,
  AlertCircle,
  Send,
  Search,
  Info,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import MessagesTable from "@/components/ui/MessagesTable";
import Pagination from "@/components/ui/Pagination";
import { useAdmin } from "@/context/AdminContext";
import { whatsappMessages } from "@/lib/mockData";
import {
  getDeliveryRate,
  getMessageCountByStatus,
  getSentTodayCount,
  getBookingById,
} from "@/lib/utils";

const PAGE_SIZE = 8;

export default function WhatsAppPage() {
  const { bookings } = useAdmin();

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Stat metrics
  const totalMessages = whatsappMessages.length;
  const deliveryRate = getDeliveryRate(whatsappMessages);
  const failedCount = getMessageCountByStatus(whatsappMessages, "Failed");
  const sentTodayCount = getSentTodayCount(whatsappMessages, "2026-09-29");

  // Filtering based on live bookings from context
  const filteredMessages = whatsappMessages.filter((message) => {
    const booking = getBookingById(message.bookingId, bookings);
    const name = booking ? booking.name.toLowerCase() : "";
    const phone = booking ? booking.phone : "";
    const query = searchTerm.toLowerCase().trim();

    const matchesSearch =
      query === "" || name.includes(query) || phone.includes(query);
    const matchesType =
      typeFilter === "all" || message.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || message.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMessages.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedMessages = filteredMessages.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
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
          WhatsApp Messages
        </h1>
        <p className="text-sm text-warmgray mt-1">
          Automated notifications sent via WhatsApp Cloud API
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Messages"
          value={totalMessages}
          icon={MessageSquare}
          hint="All notifications dispatched"
        />
        <StatCard
          title="Delivery Rate"
          value={`${deliveryRate}%`}
          icon={CheckCheck}
          hint="Delivered and read combined"
        />
        <StatCard
          title="Failed"
          value={failedCount}
          icon={AlertCircle}
          hint="Undelivered notifications"
        />
        <StatCard
          title="Sent Today"
          value={sentTodayCount}
          icon={Send}
          hint="Dispatched on Sep 29, 2026"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-warmgray absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name or phone"
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-sand rounded-xl text-charcoal placeholder:text-warmgray/60 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition shadow-2xs"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="flex-1 sm:flex-none text-sm bg-white border border-sand rounded-xl px-3 py-2 text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition shadow-2xs cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="Booking Confirmation">Booking Confirmation</option>
            <option value="Payment Receipt">Payment Receipt</option>
            <option value="Class Reminder">Class Reminder</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="flex-1 sm:flex-none text-sm bg-white border border-sand rounded-xl px-3 py-2 text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition shadow-2xs cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="Sent">Sent</option>
            <option value="Delivered">Delivered</option>
            <option value="Read">Read</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Messages Table & Pagination */}
      <div className="space-y-4">
        <MessagesTable messages={paginatedMessages} bookings={bookings} />

        {filteredMessages.length > PAGE_SIZE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      {/* Meta WhatsApp Integration Info Banner */}
      <div className="bg-sand/40 border border-sand rounded-xl p-4.5 flex items-start gap-3 text-xs md:text-sm text-charcoal/80">
        <Info className="w-5 h-5 text-sage shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Real version mein ye messages booking, payment aur class time par Meta WhatsApp Cloud API se automatically jayenge.
        </p>
      </div>
    </div>
  );
}
