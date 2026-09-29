// Modal dialog for manually creating subscriber bookings with coupon code discounts or adding to waitlist if slot is full

"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { Slot, PaymentStatus, Coupon } from "@/types";
import { useAdmin } from "@/context/AdminContext";
import {
  isValidEmail,
  isValidPhone,
  getPlanPrice,
  getEndDate,
  formatRupees,
  validateCoupon,
  calculateDiscount,
} from "@/lib/utils";

interface AddBookingModalProps {
  isOpen: boolean;
  slots: Slot[];
  onSave: (data: {
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
  onAddToWaitlist?: (data: {
    name: string;
    email: string;
    phone: string;
    slotId: string;
    plan: "30-Day" | "7-Day";
  }) => string | null;
  onClose: () => void;
}

export default function AddBookingModal({
  isOpen,
  slots,
  onSave,
  onAddToWaitlist,
  onClose,
}: AddBookingModalProps) {
  const { coupons } = useAdmin();

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [slotId, setSlotId] = useState("");
  const [plan, setPlan] = useState<"30-Day" | "7-Day">("30-Day");
  const [startDate, setStartDate] = useState("2026-09-29");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Paid");
  const [paymentMethod, setPaymentMethod] = useState<
    "UPI" | "Cash" | "Card" | "Bank Transfer"
  >("Cash");

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Validation & Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName("");
      setPhone("");
      setEmail("");
      const availableSlot = slots.find((s) => s.filled < s.capacity);
      setSlotId(availableSlot ? availableSlot.id : slots[0]?.id || "");
      setPlan("30-Day");
      setStartDate("2026-09-29");
      setPaymentStatus("Paid");
      setPaymentMethod("Cash");
      setCouponInput("");
      setAppliedCoupon(null);
      setCouponError(null);
      setErrors({});
      setServerError(null);
    }
  }, [isOpen, slots]);

  if (!isOpen) return null;

  // Check if selected slot is full
  const selectedSlot = slots.find((s) => s.id === slotId);
  const isSlotFull = Boolean(
    selectedSlot &&
      selectedSlot.capacity > 0 &&
      selectedSlot.filled >= selectedSlot.capacity
  );

  // Pricing calculations
  const basePrice = getPlanPrice(plan);
  const discountAmount = appliedCoupon
    ? calculateDiscount(appliedCoupon, plan)
    : 0;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  // Calculate summary pricing and expiration date
  const calculatedEndDate = getEndDate({
    id: "temp",
    name,
    email,
    phone,
    slotId,
    plan,
    paymentStatus,
    status: "Active",
    startDate,
    couponCode: appliedCoupon?.code,
    discountAmount,
  });

  // Handle Plan change with automatic coupon re-validation
  const handlePlanChange = (newPlan: "30-Day" | "7-Day") => {
    setPlan(newPlan);
    if (appliedCoupon) {
      const revalidation = validateCoupon(
        coupons,
        appliedCoupon.code,
        newPlan,
        "2026-09-29"
      );
      if (!revalidation.valid || !revalidation.coupon) {
        setAppliedCoupon(null);
        setCouponError(revalidation.error || "Coupon not valid for this plan");
      } else {
        setCouponError(null);
      }
    }
  };

  // Handle Apply Coupon
  const handleApplyCoupon = () => {
    setCouponError(null);
    if (!couponInput.trim()) {
      setCouponError("Please enter a coupon code");
      setAppliedCoupon(null);
      return;
    }

    const result = validateCoupon(
      coupons,
      couponInput,
      plan,
      "2026-09-29"
    );

    if (!result.valid || !result.coupon) {
      setAppliedCoupon(null);
      setCouponError(result.error || "Invalid coupon code");
    } else {
      setAppliedCoupon(result.coupon);
      setCouponError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Please enter name";
    }

    if (!isValidPhone(phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!isValidEmail(email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!slotId) {
      newErrors.slotId = "Please select a slot";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    if (isSlotFull) {
      // Add to waitlist flow
      if (onAddToWaitlist) {
        const result = onAddToWaitlist({
          name,
          email,
          phone,
          slotId,
          plan,
        });
        if (result) {
          setServerError(result);
        } else {
          onClose();
        }
      }
      return;
    }

    // Normal booking add flow
    const result = onSave({
      name,
      email,
      phone,
      slotId,
      plan,
      paymentStatus,
      paymentMethod: paymentStatus === "Paid" ? paymentMethod : undefined,
      startDate,
      couponCode: appliedCoupon ? appliedCoupon.code : undefined,
    });

    if (result) {
      setServerError(result);
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-sand w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative custom-scrollbar animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-warmgray hover:text-charcoal p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-forest font-serif">
            {isSlotFull ? "Add to Waitlist" : "Add Booking"}
          </h2>
          <p className="text-xs md:text-sm text-warmgray mt-0.5">
            {isSlotFull
              ? "Batch is full. Register subscriber on the waitlist"
              : "Manually add a subscriber (offline payment)"}
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-[#F8E1DE] text-[#A3382B] border border-[#F8E1DE] text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Full Name <span className="text-terracotta">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  setServerError(null);
                }}
                placeholder="e.g. Priya Sharma"
                className={`w-full px-3 py-2 text-xs md:text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-sage transition ${
                  errors.name ? "border-terracotta bg-[#F8E1DE]/20" : "border-sand"
                }`}
              />
              {errors.name && (
                <p className="text-terracotta text-[11px] mt-1 font-medium">
                  {errors.name}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Phone Number <span className="text-terracotta">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                  setServerError(null);
                }}
                placeholder="10-digit mobile"
                maxLength={10}
                className={`w-full px-3 py-2 text-xs md:text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-sage transition font-mono ${
                  errors.phone ? "border-terracotta bg-[#F8E1DE]/20" : "border-sand"
                }`}
              />
              {errors.phone && (
                <p className="text-terracotta text-[11px] mt-1 font-medium">
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Email Address (full width) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Email Address <span className="text-terracotta">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                  setServerError(null);
                }}
                placeholder="name@example.com"
                className={`w-full px-3 py-2 text-xs md:text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-sage transition ${
                  errors.email ? "border-terracotta bg-[#F8E1DE]/20" : "border-sand"
                }`}
              />
              {errors.email && (
                <p className="text-terracotta text-[11px] mt-1 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Slot Dropdown (Non-disabled options for full slots) */}
            <div className={isSlotFull ? "md:col-span-2" : ""}>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Yoga Batch Slot <span className="text-terracotta">*</span>
              </label>
              <select
                value={slotId}
                onChange={(e) => {
                  setSlotId(e.target.value);
                  if (errors.slotId) setErrors((prev) => ({ ...prev, slotId: "" }));
                  setServerError(null);
                }}
                className={`w-full px-3 py-2 text-xs md:text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-sage transition cursor-pointer ${
                  errors.slotId ? "border-terracotta" : "border-sand"
                }`}
              >
                {slots.map((s) => {
                  const isFull = s.capacity > 0 && s.filled >= s.capacity;
                  return (
                    <option key={s.id} value={s.id}>
                      {s.time} ({s.filled}/{s.capacity} seats{isFull ? " - Full" : ""})
                    </option>
                  );
                })}
              </select>
              {errors.slotId && (
                <p className="text-terracotta text-[11px] mt-1 font-medium">
                  {errors.slotId}
                </p>
              )}
            </div>

            {/* Plan Dropdown */}
            <div className={isSlotFull ? "md:col-span-2" : ""}>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Subscription Plan
              </label>
              <select
                value={plan}
                onChange={(e) =>
                  handlePlanChange(e.target.value as "30-Day" | "7-Day")
                }
                className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-sage transition cursor-pointer"
              >
                <option value="30-Day">30-Day - Rs. 2,999</option>
                <option value="7-Day">7-Day - Rs. 999</option>
              </select>
            </div>

            {/* Coupon Code Section (Hidden if full slot) */}
            {!isSlotFull && (
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Coupon Code (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => {
                      setCouponInput(e.target.value.toUpperCase());
                      setCouponError(null);
                    }}
                    placeholder="e.g. YOGA20"
                    className="flex-1 px-3 py-2 text-xs md:text-sm rounded-lg border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-sage font-mono uppercase tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 rounded-lg bg-forest hover:bg-forest/90 text-white text-xs md:text-sm font-medium transition cursor-pointer shrink-0"
                  >
                    Apply
                  </button>
                </div>

                {/* Coupon Feedback Messages */}
                {couponError && (
                  <p className="text-terracotta text-[11px] mt-1 font-medium">
                    {couponError}
                  </p>
                )}
                {appliedCoupon && !couponError && (
                  <p className="text-[#2F6B3D] text-[11px] mt-1 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      Coupon applied: -{formatRupees(discountAmount)} (
                      {appliedCoupon.code})
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* Start Date (Hidden if full slot) */}
            {!isSlotFull && (
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-sage transition cursor-pointer"
                />
              </div>
            )}

            {/* Payment Status (Hidden if full slot) */}
            {!isSlotFull && (
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Payment Status
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) =>
                    setPaymentStatus(e.target.value as PaymentStatus)
                  }
                  className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-sage transition cursor-pointer"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            )}

            {/* Payment Method (Hidden if full slot) */}
            {!isSlotFull && (
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-charcoal mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  disabled={paymentStatus === "Pending"}
                  onChange={(e) =>
                    setPaymentMethod(
                      e.target.value as "UPI" | "Cash" | "Card" | "Bank Transfer"
                    )
                  }
                  className={`w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-sage transition ${
                    paymentStatus === "Pending"
                      ? "bg-sand/30 text-warmgray/60 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <option value="Cash">Cash (Offline)</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            )}
          </div>

          {/* If Full Slot: Amber notice banner */}
          {isSlotFull ? (
            <div className="p-3.5 rounded-lg bg-[#FBF0D9] text-[#8A6414] border border-[#FBF0D9] flex items-center gap-2.5 text-xs font-medium">
              <Info className="w-4 h-4 shrink-0 text-[#8A6414]" />
              <span>
                This slot is full. You can add this person to the waitlist instead.
              </span>
            </div>
          ) : (
            /* Pricing & End Date Summary Box */
            <div className="bg-cream/40 border border-sand rounded-lg p-3.5 space-y-1.5 text-xs font-semibold text-charcoal">
              <div className="flex items-center justify-between">
                <span className="text-warmgray font-normal">Plan Price:</span>
                <span>{formatRupees(basePrice)}</span>
              </div>
              {appliedCoupon && discountAmount > 0 && (
                <div className="flex items-center justify-between text-[#2F6B3D]">
                  <span className="font-normal">Discount ({appliedCoupon.code}):</span>
                  <span>-{formatRupees(discountAmount)}</span>
                </div>
              )}
              <div className="pt-1 border-t border-sand/60 flex items-center justify-between">
                <span>
                  Total Payable:{" "}
                  <strong className="text-forest text-sm font-bold">
                    {formatRupees(finalPrice)}
                  </strong>
                </span>
                <span className="text-warmgray font-normal">
                  Ends on:{" "}
                  <strong className="text-charcoal font-semibold">
                    {calculatedEndDate}
                  </strong>
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs md:text-sm font-medium border border-sand text-charcoal hover:bg-sand/30 transition cursor-pointer"
            >
              Cancel
            </button>
            {isSlotFull ? (
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs md:text-sm font-medium bg-terracotta hover:bg-[#8F3225] text-white transition shadow-xs cursor-pointer"
              >
                Add to Waitlist
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs md:text-sm font-medium bg-sage hover:bg-forest text-white transition shadow-xs cursor-pointer"
              >
                Add Booking
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
