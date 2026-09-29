// Slots management page displaying batch occupancy metrics, capacity stats, and interactive slot cards with central AdminContext synchronization

"use client";

import { useState, useEffect } from "react";
import { Users, CalendarCheck, Clock, Plus, CheckCircle, AlertCircle } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import SlotCard from "@/components/ui/SlotCard";
import SlotModal from "@/components/ui/SlotModal";
import CancelClassModal from "@/components/ui/CancelClassModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useAdmin } from "@/context/AdminContext";
import { getBookingsForSlot } from "@/lib/utils";
import { Slot } from "@/types";

export default function SlotsPage() {
  const {
    slots,
    bookings,
    cancelledClasses,
    addSlot,
    editSlot,
    deleteSlot,
    cancelClass,
    undoCancelClass,
  } = useAdmin();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<Slot | null>(null);

  // Class cancellation state
  const [slotToCancel, setSlotToCancel] = useState<Slot | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Computed summary metrics
  const totalCapacity = slots.reduce((acc, slot) => acc + slot.capacity, 0);
  const seatsFilled = slots.reduce((acc, slot) => acc + slot.filled, 0);
  const seatsAvailable = Math.max(0, totalCapacity - seatsFilled);

  // Open Add Slot Modal
  const handleOpenAddModal = () => {
    setModalMode("add");
    setSelectedSlot(null);
    setIsModalOpen(true);
  };

  // Open Edit Slot Modal
  const handleOpenEditModal = (slot: Slot) => {
    setModalMode("edit");
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  // Save Slot (Add or Edit) via central context functions
  const handleSaveSlot = (
    time24: string,
    capacity: number
  ): { success: boolean; error?: string } => {
    if (modalMode === "add") {
      return addSlot(time24, capacity);
    }

    if (modalMode === "edit" && selectedSlot) {
      return editSlot(selectedSlot.id, time24, capacity);
    }

    return { success: false, error: "Unable to process request" };
  };

  // Open Delete Confirmation
  const handleInitiateDelete = (slot: Slot) => {
    setSlotToDelete(slot);
    setIsDeleteDialogOpen(true);
  };

  // Confirm and Execute Delete
  const handleConfirmDelete = () => {
    if (slotToDelete) {
      deleteSlot(slotToDelete.id);
      setSlotToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  // Class Cancel Confirm Handler
  const handleConfirmCancel = (reason: string, note: string) => {
    if (!slotToCancel) return;

    const activeCount = getBookingsForSlot(slotToCancel.id, bookings).filter(
      (b) => b.status === "Active"
    ).length;

    cancelClass(slotToCancel.id, reason, note);

    setToastMessage(
      `Class cancelled. ${activeCount} ${
        activeCount === 1 ? "subscriber" : "subscribers"
      } notified on WhatsApp.`
    );
    setSlotToCancel(null);
  };

  // Undo Class Cancellation Handler
  const handleUndoCancel = (slot: Slot) => {
    undoCancelClass(slot.id);
    setToastMessage(`Cancellation undone for ${slot.time} class.`);
  };

  // Active subscriber count for the currently cancelling slot
  const cancellingSubscriberCount = slotToCancel
    ? getBookingsForSlot(slotToCancel.id, bookings).filter(
        (b) => b.status === "Active"
      ).length
    : 0;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 bg-[#E3F0E5] text-[#2F6B3D] border border-[#C9E2CC] px-4 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-5 h-5 shrink-0 text-[#2F6B3D]" />
          <span className="text-xs md:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-forest font-serif">
            Slots
          </h1>
          <p className="text-sm text-warmgray mt-1">
            Monitor batch occupancy at a glance
          </p>
        </div>

        {/* Add Slot Button */}
        <button
          onClick={handleOpenAddModal}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 bg-sage hover:bg-forest text-white text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Slot</span>
        </button>
      </div>

      {/* 3 Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard
          title="Total Capacity"
          value={totalCapacity}
          icon={Users}
          hint={`Maximum seats across ${slots.length} batches`}
        />
        <StatCard
          title="Seats Filled"
          value={seatsFilled}
          icon={CalendarCheck}
          hint="Currently booked across all slots"
        />
        <StatCard
          title="Seats Available"
          value={seatsAvailable}
          icon={Clock}
          hint="Remaining open spots today"
        />
      </div>

      {/* Cancelled Classes Notice Banner */}
      {cancelledClasses.length > 0 && (
        <div className="flex items-center gap-2 bg-[#F8E1DE]/60 text-[#A3382B] border border-[#F8E1DE] px-4 py-2.5 rounded-xl text-xs md:text-sm font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#A3382B]" />
          <span>
            <strong className="font-semibold">
              {cancelledClasses.length}{" "}
              {cancelledClasses.length === 1 ? "class" : "classes"} cancelled today
            </strong>{" "}
            (29 Sep 2026). Subscribers have been informed.
          </span>
        </div>
      )}

      {/* Slot Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-forest font-serif">
            Batch Schedules
          </h2>
          <span className="text-xs text-warmgray">
            {slots.length} daily time {slots.length === 1 ? "slot" : "slots"}
          </span>
        </div>

        {slots.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {slots.map((slot) => {
              const cancelledInfo = cancelledClasses.find(
                (c) => c.slotId === slot.id && c.date === "2026-09-29"
              );

              return (
                <SlotCard
                  key={slot.id}
                  slot={slot}
                  bookings={bookings}
                  onEdit={handleOpenEditModal}
                  onDelete={handleInitiateDelete}
                  onCancelClass={(s) => setSlotToCancel(s)}
                  onUndoCancel={handleUndoCancel}
                  cancelledInfo={cancelledInfo}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-sand p-12 text-center">
            <p className="text-base font-semibold text-charcoal">
              No slots yet
            </p>
            <p className="text-sm text-warmgray mt-1">
              Click &apos;Add Slot&apos; to create one.
            </p>
          </div>
        )}
      </div>

      {/* Slot Modal (Add / Edit) */}
      <SlotModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialSlot={selectedSlot}
        onSave={handleSaveSlot}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Cancel Class Modal */}
      <CancelClassModal
        isOpen={Boolean(slotToCancel)}
        slot={slotToCancel}
        subscriberCount={cancellingSubscriberCount}
        onConfirm={handleConfirmCancel}
        onClose={() => setSlotToCancel(null)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Slot"
        message={
          slotToDelete && slotToDelete.filled > 0
            ? `This slot has ${slotToDelete.filled} subscribers. Delete anyway?`
            : slotToDelete
            ? `Are you sure you want to delete the ${slotToDelete.time} slot?`
            : "Are you sure you want to delete this slot?"
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setSlotToDelete(null);
        }}
      />
    </div>
  );
}
