// FilterBar component offering search, slot, status, and payment filters for bookings

"use client";

import { Search } from "lucide-react";
import { Slot } from "@/types";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  slotFilter: string;
  onSlotChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  paymentFilter: string;
  onPaymentChange: (value: string) => void;
  slots: Slot[];
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  slotFilter,
  onSlotChange,
  statusFilter,
  onStatusChange,
  paymentFilter,
  onPaymentChange,
  slots,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 text-warmgray absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by name, email or phone"
          className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-sand rounded-xl text-charcoal placeholder:text-warmgray/60 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition shadow-2xs"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
        {/* Slot Filter */}
        <select
          value={slotFilter}
          onChange={(e) => onSlotChange(e.target.value)}
          className="flex-1 sm:flex-none text-sm bg-white border border-sand rounded-xl px-3 py-2 text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition shadow-2xs cursor-pointer"
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
          onChange={(e) => onStatusChange(e.target.value)}
          className="flex-1 sm:flex-none text-sm bg-white border border-sand rounded-xl px-3 py-2 text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition shadow-2xs cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Upcoming">Upcoming</option>
          <option value="Expired">Expired</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Payment Filter */}
        <select
          value={paymentFilter}
          onChange={(e) => onPaymentChange(e.target.value)}
          className="flex-1 sm:flex-none text-sm bg-white border border-sand rounded-xl px-3 py-2 text-charcoal focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage transition shadow-2xs cursor-pointer"
        >
          <option value="all">All Payments</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
          <option value="Failed">Failed</option>
          <option value="Refunded">Refunded</option>
          <option value="Partial Refund">Partial Refund</option>
        </select>
      </div>
    </div>
  );
}
