// Modal dialog for creating and validating discount coupons

"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle, Tag } from "lucide-react";

interface CouponModalProps {
  isOpen: boolean;
  onSave: (data: {
    code: string;
    type: "Percent" | "Flat";
    value: number;
    applicablePlan: "All" | "30-Day" | "7-Day";
    validTill: string;
    usageLimit: number;
  }) => string | null;
  onClose: () => void;
}

export default function CouponModal({
  isOpen,
  onSave,
  onClose,
}: CouponModalProps) {
  const [code, setCode] = useState("");
  const [type, setType] = useState<"Percent" | "Flat">("Percent");
  const [value, setValue] = useState<string>("20");
  const [applicablePlan, setApplicablePlan] = useState<"All" | "30-Day" | "7-Day">("All");
  const [validTill, setValidTill] = useState("2026-10-31");
  const [usageLimit, setUsageLimit] = useState<string>("50");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCode("");
      setType("Percent");
      setValue("20");
      setApplicablePlan("All");
      setValidTill("2026-10-31");
      setUsageLimit("50");
      setErrors({});
      setServerError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      newErrors.code = "Please enter coupon code";
    }

    const numValue = Number(value);
    if (!value || isNaN(numValue) || numValue <= 0) {
      newErrors.value = "Enter a valid value greater than 0";
    } else if (type === "Percent" && numValue > 100) {
      newErrors.value = "Percentage cannot exceed 100%";
    }

    if (!validTill) {
      newErrors.validTill = "Select a valid expiry date";
    }

    const numLimit = Number(usageLimit);
    if (!usageLimit || isNaN(numLimit) || numLimit < 1) {
      newErrors.usageLimit = "Usage limit must be at least 1";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const result = onSave({
      code: cleanCode,
      type,
      value: numValue,
      applicablePlan,
      validTill,
      usageLimit: numLimit,
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
        className="bg-white rounded-xl border border-sand w-full max-w-md p-6 max-h-[90vh] overflow-y-auto shadow-2xl relative custom-scrollbar animate-in zoom-in-95 duration-200"
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
        <div className="mb-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage/15 text-sage flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-forest font-serif">
              Create Coupon
            </h2>
            <p className="text-xs text-warmgray">
              Add a new discount code for subscriptions
            </p>
          </div>
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
          {/* Coupon Code */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Coupon Code <span className="text-terracotta">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                if (errors.code) setErrors((prev) => ({ ...prev, code: "" }));
                setServerError(null);
              }}
              placeholder="e.g. YOGA20"
              className={`w-full px-3 py-2 text-xs md:text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-sage transition font-mono tracking-wider uppercase ${
                errors.code ? "border-terracotta bg-[#F8E1DE]/20" : "border-sand"
              }`}
            />
            {errors.code && (
              <p className="text-terracotta text-[11px] mt-1 font-medium">
                {errors.code}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Discount Type */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Discount Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as "Percent" | "Flat")}
                className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-sage transition cursor-pointer"
              >
                <option value="Percent">Percentage (%)</option>
                <option value="Flat">Flat (Rs.)</option>
              </select>
            </div>

            {/* Value */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Value <span className="text-terracotta">*</span>
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (errors.value) setErrors((prev) => ({ ...prev, value: "" }));
                  setServerError(null);
                }}
                placeholder={type === "Percent" ? "20" : "500"}
                className={`w-full px-3 py-2 text-xs md:text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-sage transition ${
                  errors.value ? "border-terracotta bg-[#F8E1DE]/20" : "border-sand"
                }`}
              />
              {errors.value && (
                <p className="text-terracotta text-[11px] mt-1 font-medium">
                  {errors.value}
                </p>
              )}
            </div>
          </div>

          {/* Applicable Plan */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Applicable Plan
            </label>
            <select
              value={applicablePlan}
              onChange={(e) =>
                setApplicablePlan(e.target.value as "All" | "30-Day" | "7-Day")
              }
              className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-sage transition cursor-pointer"
            >
              <option value="All">All Plans</option>
              <option value="30-Day">30-Day Pass Only</option>
              <option value="7-Day">7-Day Pass Only</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Valid Till */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Valid Till <span className="text-terracotta">*</span>
              </label>
              <input
                type="date"
                value={validTill}
                onChange={(e) => {
                  setValidTill(e.target.value);
                  if (errors.validTill)
                    setErrors((prev) => ({ ...prev, validTill: "" }));
                  setServerError(null);
                }}
                className={`w-full px-3 py-2 text-xs md:text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-sage transition cursor-pointer ${
                  errors.validTill ? "border-terracotta bg-[#F8E1DE]/20" : "border-sand"
                }`}
              />
              {errors.validTill && (
                <p className="text-terracotta text-[11px] mt-1 font-medium">
                  {errors.validTill}
                </p>
              )}
            </div>

            {/* Usage Limit */}
            <div>
              <label className="block text-xs font-semibold text-charcoal mb-1">
                Usage Limit <span className="text-terracotta">*</span>
              </label>
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => {
                  setUsageLimit(e.target.value);
                  if (errors.usageLimit)
                    setErrors((prev) => ({ ...prev, usageLimit: "" }));
                  setServerError(null);
                }}
                placeholder="50"
                min={1}
                className={`w-full px-3 py-2 text-xs md:text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-sage transition ${
                  errors.usageLimit ? "border-terracotta bg-[#F8E1DE]/20" : "border-sand"
                }`}
              />
              {errors.usageLimit && (
                <p className="text-terracotta text-[11px] mt-1 font-medium">
                  {errors.usageLimit}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs md:text-sm font-medium border border-sand text-charcoal hover:bg-sand/30 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs md:text-sm font-medium bg-sage hover:bg-forest text-white transition shadow-xs cursor-pointer"
            >
              Create Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
