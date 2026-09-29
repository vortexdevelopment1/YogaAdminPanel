// Waitlist management page displaying subscribers waiting for seats, slot filtering, stats, and promote/notify actions

"use client";

import { useState } from "react";
import { Users, CheckCircle, MessageCircle, Plus, AlertCircle, Check, Info } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import StatCard from "@/components/ui/StatCard";
import WaitlistTable from "@/components/ui/WaitlistTable";
import AddWaitlistModal from "@/components/ui/AddWaitlistModal";
import { hasSeatAvailable, getWaitlistForSlot } from "@/lib/utils";

export default function WaitlistPage() {
  const {
    waitlist,
    slots,
    addToWaitlist,
    removeFromWaitlist,
    promoteFromWaitlist,
    notifyWaitlistEntry,
  } = useAdmin();

  const [slotFilter, setSlotFilter] = useState<string>("All");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Helper for showing temporary auto-dismissing toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered waitlist based on selected slot dropdown
  const filteredEntries =
    slotFilter === "All"
      ? waitlist
      : waitlist.filter((w) => w.slotId === slotFilter);

  // Stats calculation
  const totalOnWaitlist = waitlist.length;
  const slotsWithSeatsFree = slots.filter(
    (slot) => hasSeatAvailable(slot) && getWaitlistForSlot(waitlist, slot.id).length > 0
  ).length;
  const notifiedCount = waitlist.filter((w) => w.notified).length;

  // Handle promoting a subscriber
  const handlePromote = (id: string) => {
    setErrorMessage(null);
    const targetEntry = waitlist.find((w) => w.id === id);
    const err = promoteFromWaitlist(id);
    if (err) {
      setErrorMessage(err);
      setTimeout(() => setErrorMessage(null), 4000);
    } else {
      showToast(`${targetEntry?.name || "Subscriber"} moved to bookings. Payment is pending.`);
    }
  };

  // Handle notifying a subscriber
  const handleNotify = (id: string) => {
    const targetEntry = waitlist.find((w) => w.id === id);
    notifyWaitlistEntry(id);
    showToast(`Seat available message sent to ${targetEntry?.name || "Subscriber"} on WhatsApp.`);
  };

  // Handle removing a subscriber
  const handleRemove = (id: string) => {
    const targetEntry = waitlist.find((w) => w.id === id);
    removeFromWaitlist(id);
    showToast(`${targetEntry?.name || "Subscriber"} removed from waitlist.`);
  };

  // Handle adding a subscriber to waitlist
  const handleAdd = (data: {
    name: string;
    email: string;
    phone: string;
    slotId: string;
    plan: "30-Day" | "7-Day";
  }) => {
    const result = addToWaitlist(data);
    if (!result) {
      showToast(`${data.name} added to waitlist.`);
    }
    return result;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-forest text-white shadow-lg text-sm font-medium animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-sage" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Heading Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-forest font-serif">
            Waitlist
          </h1>
          <p className="text-xs md:text-sm text-warmgray mt-1">
            People waiting for a seat in full batches
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sage hover:bg-forest text-white text-sm font-medium transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add to Waitlist</span>
        </button>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-2 p-3.5 rounded-xl bg-[#F8E1DE] text-[#A3382B] border border-[#F8E1DE] text-xs md:text-sm font-medium animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 3 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total on Waitlist"
          value={totalOnWaitlist}
          icon={Users}
          hint="Subscribers awaiting an open seat"
        />
        <StatCard
          title="Slots with Seats Free"
          value={slotsWithSeatsFree}
          icon={CheckCircle}
          hint="Batches ready for waitlist promotion"
        />
        <StatCard
          title="Notified"
          value={notifiedCount}
          icon={MessageCircle}
          hint="Alerted subscribers via WhatsApp"
        />
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label htmlFor="slot-filter" className="text-xs font-semibold text-charcoal">
            Filter by Batch:
          </label>
          <select
            id="slot-filter"
            value={slotFilter}
            onChange={(e) => setSlotFilter(e.target.value)}
            className="px-3 py-1.5 text-xs md:text-sm rounded-lg border border-sand bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-sage transition cursor-pointer"
          >
            <option value="All">All Batches ({waitlist.length})</option>
            {slots.map((s) => {
              const count = waitlist.filter((w) => w.slotId === s.id).length;
              return (
                <option key={s.id} value={s.id}>
                  {s.time} ({count} waiting)
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Waitlist Table */}
      <WaitlistTable
        entries={filteredEntries}
        slots={slots}
        fullWaitlist={waitlist}
        onPromote={handlePromote}
        onRemove={handleRemove}
        onNotify={handleNotify}
      />

      {/* Bottom Info Card */}
      <div className="bg-cream/70 border border-sand rounded-xl p-4 md:p-5 flex items-start gap-3">
        <Info className="w-5 h-5 text-forest shrink-0 mt-0.5" />
        <p className="text-xs md:text-sm text-charcoal/90 leading-relaxed">
          Real version mein seat khali hote hi waitlist ke pehle vyakti ko WhatsApp par automatic message jayega.
        </p>
      </div>

      {/* Add to Waitlist Modal */}
      <AddWaitlistModal
        isOpen={isAddOpen}
        slots={slots}
        onSave={handleAdd}
        onClose={() => setIsAddOpen(false)}
      />
    </div>
  );
}
