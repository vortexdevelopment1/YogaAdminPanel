// Revenue dashboard page displaying total earnings, monthly trends, plan-wise breakdown, slot distribution, and payments log synced via AdminContext

"use client";

import { useState } from "react";
import { IndianRupee, TrendingUp, Clock, AlertCircle } from "lucide-react";
import { monthlyRevenue } from "@/lib/mockData";
import { useAdmin } from "@/context/AdminContext";
import {
  getTotalRevenue,
  getPendingAmount,
  getFailedAmount,
  getTotalRefundedAmount,
  getRevenueByPlan,
  getRevenueBySlot,
  formatRupees,
  getMonthGrowth,
} from "@/lib/utils";
import StatCard from "@/components/ui/StatCard";
import RevenueChart from "@/components/charts/RevenueChart";
import PlanSplitChart from "@/components/charts/PlanSplitChart";
import SlotRevenueList from "@/components/ui/SlotRevenueList";
import PaymentsTable from "@/components/ui/PaymentsTable";
import Pagination from "@/components/ui/Pagination";

const PAGE_SIZE = 8;

export default function RevenuePage() {
  const { bookings, slots } = useAdmin();

  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Revenue metrics calculations based on live context store
  const totalRevenue = getTotalRevenue(bookings);
  const pendingAmount = getPendingAmount(bookings);
  const failedAmount = getFailedAmount(bookings);
  const refundedAmount = getTotalRefundedAmount(bookings);

  const lastMonthItem = monthlyRevenue[monthlyRevenue.length - 1];
  const thisMonthRevenue = lastMonthItem ? lastMonthItem.revenue : 0;
  const growth = getMonthGrowth(monthlyRevenue);

  const planRevenueData = getRevenueByPlan(bookings);
  const slotRevenueData = getRevenueBySlot(bookings, slots);

  // Filter payments table data
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "All") return true;
    return b.paymentStatus === statusFilter;
  });

  const totalPages = Math.ceil(filteredBookings.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedBookings = filteredBookings.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-forest font-serif">
          Revenue
        </h1>
        <p className="text-sm text-warmgray mt-1">
          Track earnings from subscriptions
        </p>
      </div>

      {/* 2. Key Revenue Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <StatCard
          title="Total Revenue"
          value={formatRupees(totalRevenue)}
          icon={IndianRupee}
          hint={refundedAmount > 0 ? `Net after ${formatRupees(refundedAmount)} refunds` : "From all completed payments"}
        />
        <StatCard
          title="This Month"
          value={formatRupees(thisMonthRevenue)}
          icon={TrendingUp}
          hint={`${growth >= 0 ? `+${growth}%` : `${growth}%`} vs last month`}
        />
        <StatCard
          title="Pending Amount"
          value={formatRupees(pendingAmount)}
          icon={Clock}
          hint="Awaiting payment confirmation"
        />
        <StatCard
          title="Failed Amount"
          value={formatRupees(failedAmount)}
          icon={AlertCircle}
          hint={refundedAmount > 0 ? `Refunded: ${formatRupees(refundedAmount)}` : "Unsuccessful transactions"}
        />
      </div>

      {/* 3. Charts: Monthly Trend & Plan Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-sand p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-forest font-serif mb-1">
              Monthly Revenue
            </h3>
            <p className="text-xs text-warmgray mb-4">
              6-month revenue trend (Sep highlighted)
            </p>
          </div>
          <RevenueChart data={monthlyRevenue} />
        </div>

        <div className="lg:col-span-1 bg-white rounded-xl border border-sand p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-forest font-serif mb-1">
              Revenue by Plan
            </h3>
            <p className="text-xs text-warmgray mb-4">
              30-Day vs 7-Day paid subscriptions
            </p>
          </div>
          <PlanSplitChart data={planRevenueData} />
        </div>
      </div>

      {/* 4. Slot Revenue Distribution */}
      <div className="bg-white rounded-xl border border-sand p-5 shadow-sm">
        <h3 className="text-lg font-bold text-forest font-serif mb-1">
          Revenue by Slot
        </h3>
        <p className="text-xs text-warmgray mb-4">
          Earnings generated per batch timing
        </p>
        <SlotRevenueList data={slotRevenueData} />
      </div>

      {/* 5. Payments Transaction Table */}
      <div className="bg-white rounded-xl border border-sand p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-forest font-serif">
              Payments
            </h3>
            <p className="text-xs text-warmgray mt-0.5">
              Recent subscriber payment transactions ({filteredBookings.length} total)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label
              htmlFor="revenue-status-filter"
              className="text-xs font-semibold text-warmgray"
            >
              Status:
            </label>
            <select
              id="revenue-status-filter"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-sand rounded-lg px-3 py-1.5 text-xs md:text-sm text-charcoal font-medium focus:outline-none focus:ring-2 focus:ring-sage transition cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
              <option value="Partial Refund">Partial Refund</option>
            </select>
          </div>
        </div>

        <PaymentsTable bookings={paginatedBookings} slots={slots} />

        {filteredBookings.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
