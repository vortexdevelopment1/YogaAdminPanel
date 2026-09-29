// Table component displaying coupons with discount values, usage progress bars, status badges, and actions

"use client";

import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Coupon } from "@/types";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { getCouponStatus, formatRupees } from "@/lib/utils";

interface CouponsTableProps {
  coupons: Coupon[];
  onToggle: (id: string) => void;
  onDelete: (coupon: Coupon) => void;
}

export default function CouponsTable({
  coupons,
  onToggle,
  onDelete,
}: CouponsTableProps) {
  if (coupons.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-sand p-12 text-center">
        <p className="text-base font-semibold text-charcoal">No coupons found</p>
        <p className="text-sm text-warmgray mt-1">
          Click "+ Create Coupon" to add your first discount code.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-sand shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-cream border-b border-sand text-xs font-semibold text-warmgray uppercase tracking-wider">
              <th className="py-3.5 px-4 md:px-6">Code</th>
              <th className="py-3.5 px-4">Discount</th>
              <th className="py-3.5 px-4">Plan</th>
              <th className="py-3.5 px-4">Valid Till</th>
              <th className="py-3.5 px-4 min-w-[140px]">Usage</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 md:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand/60 text-sm text-charcoal">
            {coupons.map((coupon) => {
              const status = getCouponStatus(coupon, "2026-09-29");
              const usagePercent =
                coupon.usageLimit > 0
                  ? Math.round((coupon.usedCount / coupon.usageLimit) * 100)
                  : 0;

              const discountText =
                coupon.type === "Percent"
                  ? `${coupon.value}% off`
                  : `${formatRupees(coupon.value)} off`;

              return (
                <tr
                  key={coupon.id}
                  className="hover:bg-cream/40 transition-colors"
                >
                  {/* Code */}
                  <td className="py-3.5 px-4 md:px-6 font-mono font-bold text-forest text-xs md:text-sm tracking-wide">
                    {coupon.code}
                  </td>

                  {/* Discount */}
                  <td className="py-3.5 px-4 font-semibold text-charcoal">
                    {discountText}
                  </td>

                  {/* Plan */}
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-sand/60 text-charcoal">
                      {coupon.applicablePlan === "All"
                        ? "All Plans"
                        : coupon.applicablePlan}
                    </span>
                  </td>

                  {/* Valid Till */}
                  <td className="py-3.5 px-4 text-warmgray text-xs md:text-sm font-mono">
                    {coupon.validTill}
                  </td>

                  {/* Usage */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium text-warmgray">
                        <span>
                          {coupon.usedCount} / {coupon.usageLimit}
                        </span>
                        <span className="font-mono text-[11px]">
                          {usagePercent}%
                        </span>
                      </div>
                      <ProgressBar percent={usagePercent} />
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <Badge label={status} />
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 md:px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Toggle Active / Inactive Button */}
                      <button
                        type="button"
                        onClick={() => onToggle(coupon.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                          coupon.active
                            ? "border-sand bg-white text-forest hover:bg-cream/70"
                            : "border-sand/60 bg-sand/30 text-warmgray hover:bg-sand/50"
                        }`}
                        title={
                          coupon.active
                            ? "Click to disable coupon"
                            : "Click to enable coupon"
                        }
                      >
                        {coupon.active ? (
                          <>
                            <ToggleRight className="w-4 h-4 text-sage" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="w-4 h-4 text-warmgray" />
                            <span>Disabled</span>
                          </>
                        )}
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => onDelete(coupon)}
                        className="p-1.5 rounded-lg text-warmgray hover:text-[#A3382B] hover:bg-[#F8E1DE]/50 transition cursor-pointer"
                        title={`Delete coupon ${coupon.code}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
