// Modal dialog for adding a subscriber to a yoga batch waitlist with validation

"use client";

import { useState, useEffect } from "react";
import { X, AlertCircle } from "lucide-react";
import { Slot } from "@/types";
import { isValidEmail, isValidPhone } from "@/lib/utils";

interface AddWaitlistModalProps {
  isOpen: boolean;
  slots: Slot[];
  onSave: (data: {
    name: string;
    email: string;
    phone: string;
    slotId: string;
    plan: "30-Day" | "7-Day";
  }) => string | null;
  onClose: () => void;
}

export default function AddWaitlistModal({
  isOpen,
  slots,
  onSave,
  onClose,
}: AddWaitlistModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [slotId, setSlotId] = useState("");
  const [plan, setPlan] = useState<"30-Day" | "7-Day">("30-Day");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setPhone("");
      setEmail("");
      setSlotId(slots[0]?.id || "");
      setPlan("30-Day");
      setErrors({});
      setServerError(null);
    }
  }, [isOpen, slots]);

  if (!isOpen) return null;

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

    const result = onSave({
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
        <div className="mb-5">
          <h2 className="text-xl font-bold text-forest font-serif">
            Add to Waitlist
          </h2>
          <p className="text-xs text-warmgray mt-0.5">
            Register subscriber for queue position in a batch
          </p>
        </div>

        {/* Error Alert */}
        {serverError && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-[#F8E1DE] text-[#A3382B] border border-[#F8E1DE] text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="e.g. Siddharth Malhotra"
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
              placeholder="10-digit mobile number"
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

          {/* Email Address */}
          <div>
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

          {/* Slot Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Target Yoga Batch <span className="text-terracotta">*</span>
            </label>
            <select
              value={slotId}
              onChange={(e) => {
                setSlotId(e.target.value);
                if (errors.slotId) setErrors((prev) => ({ ...prev, slotId: "" }));
                setServerError(null);
              }}
              className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-sage transition cursor-pointer"
            >
              {slots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.time} ({s.filled}/{s.capacity} seats {s.filled >= s.capacity ? "- Full" : ""})
                </option>
              ))}
            </select>
          </div>

          {/* Plan Duration */}
          <div>
            <label className="block text-xs font-semibold text-charcoal mb-1">
              Desired Plan
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as "30-Day" | "7-Day")}
              className="w-full px-3 py-2 text-xs md:text-sm rounded-lg border border-sand bg-white focus:outline-none focus:ring-2 focus:ring-sage transition cursor-pointer"
            >
              <option value="30-Day">30-Day Pass (Rs. 2,999)</option>
              <option value="7-Day">7-Day Pass (Rs. 999)</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
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
              Add to Waitlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
