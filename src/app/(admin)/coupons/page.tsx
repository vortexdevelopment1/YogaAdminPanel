// Coupons page for managing discount codes, redemption analytics, and promotional campaign controls

"use client";

import { useState } from "react";
import { Tag, Sparkles, IndianRupee, Plus, Check } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import StatCard from "@/components/ui/StatCard";
import CouponsTable from "@/components/ui/CouponsTable";
import CouponModal from "@/components/ui/CouponModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { getCouponStatus, formatRupees } from "@/lib/utils";
import { Coupon } from "@/types";

export default function CouponsPage() {
  const { coupons, bookings, addCoupon, toggleCoupon, deleteCoupon } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Stat metrics
  const activeCouponsCount = coupons.filter(
    (c) => getCouponStatus(c, "2026-09-29") === "Active"
  ).length;

  const totalRedemptions = coupons.reduce((sum, c) => sum + c.usedCount, 0);

  const totalDiscountGiven = bookings.reduce(
    (sum, b) => sum + (b.discountAmount || 0),
    0
  );

  // Handle Save
  const handleSaveCoupon = (data: {
    code: string;
    type: "Percent" | "Flat";
    value: number;
    applicablePlan: "All" | "30-Day" | "7-Day";
    validTill: string;
    usageLimit: number;
  }) => {
    const error = addCoupon(data);
    if (!error) {
      showToast(`Coupon ${data.code} created successfully.`);
    }
    return error;
  };

  // Handle Toggle
  const handleToggleCoupon = (id: string) => {
    const target = coupons.find((c) => c.id === id);
    if (!target) return;
    toggleCoupon(id);
    showToast(`Coupon ${target.code} ${!target.active ? "enabled" : "disabled"}.`);
  };

  // Handle Confirm Delete
  const handleConfirmDelete = () => {
    if (!couponToDelete) return;
    deleteCoupon(couponToDelete.id);
    showToast(`Coupon ${couponToDelete.code} deleted.`);
    setCouponToDelete(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-forest text-white shadow-lg text-sm font-medium animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-sage" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-forest font-serif">
            Coupons
          </h1>
          <p className="text-xs md:text-sm text-warmgray mt-1">
            Create and manage discount codes
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sage hover:bg-forest text-white text-sm font-medium transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* 3 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Coupons"
          value={activeCouponsCount}
          icon={Tag}
          hint="Coupons currently valid & redeemable"
        />
        <StatCard
          title="Total Redemptions"
          value={totalRedemptions}
          icon={Sparkles}
          hint="Times promo codes were used"
        />
        <StatCard
          title="Discount Given"
          value={formatRupees(totalDiscountGiven)}
          icon={IndianRupee}
          hint="Total subscriber savings"
        />
      </div>

      {/* Coupons Table */}
      <CouponsTable
        coupons={coupons}
        onToggle={handleToggleCoupon}
        onDelete={(coupon) => setCouponToDelete(coupon)}
      />

      {/* Create Coupon Modal */}
      <CouponModal
        isOpen={isModalOpen}
        onSave={handleSaveCoupon}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(couponToDelete)}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon "${couponToDelete?.code}"? This cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCouponToDelete(null)}
      />
    </div>
  );
}
