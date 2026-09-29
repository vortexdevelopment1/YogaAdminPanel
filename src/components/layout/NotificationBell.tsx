// Notification bell component with unread counter badge, alert dropdown popover, and interactive routing synced via AdminContext

"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCircle,
  UserPlus,
  Users,
  AlertCircle,
  CalendarClock,
  Ban,
} from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { getNotificationStyle } from "@/lib/utils";
import { AppNotification, NotificationType } from "@/types";

// Helper component rendering the matching icon for each notification type
function NotificationIcon({ type }: { type: NotificationType }) {
  const style = getNotificationStyle(type);

  const renderIcon = () => {
    switch (style.iconName) {
      case "UserPlus":
        return <UserPlus className="w-4 h-4" />;
      case "Users":
        return <Users className="w-4 h-4" />;
      case "AlertCircle":
        return <AlertCircle className="w-4 h-4" />;
      case "CalendarClock":
        return <CalendarClock className="w-4 h-4" />;
      case "Ban":
        return <Ban className="w-4 h-4" />;
    }
  };

  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {renderIcon()}
    </div>
  );
}

export default function NotificationBell() {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    readNotificationIds,
    markNotificationRead,
    markAllNotificationsRead,
  } = useAdmin();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or Escape key press
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleNotificationClick = (notification: AppNotification) => {
    markNotificationRead(notification.id);
    setIsOpen(false);
    router.push(notification.link);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-2 rounded-xl text-charcoal hover:bg-cream/70 hover:text-forest transition-colors relative cursor-pointer"
        aria-label="Toggle notifications menu"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-terracotta text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in duration-200">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-sand shadow-xl max-h-96 flex flex-col z-50 animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-3.5 border-b border-sand flex items-center justify-between shrink-0 bg-cream/30 rounded-t-xl">
            <div className="flex items-center gap-2">
              <span className="font-bold text-forest text-sm font-serif">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sand/60 text-charcoal">
                  {unreadCount} new
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={markAllNotificationsRead}
              disabled={unreadCount === 0}
              className={`text-xs font-semibold transition-colors cursor-pointer ${
                unreadCount > 0
                  ? "text-sage hover:text-forest hover:underline"
                  : "text-warmgray/40 cursor-not-allowed"
              }`}
            >
              Mark all as read
            </button>
          </div>

          {/* Notifications List Body */}
          <div className="overflow-y-auto divide-y divide-sand/40 custom-scrollbar flex-1">
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const isUnread = !readNotificationIds.includes(notification.id);

                return (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-3 flex items-start gap-3 text-left transition-colors cursor-pointer ${
                      isUnread
                        ? "bg-cream/40 hover:bg-cream/70"
                        : "bg-white hover:bg-cream/20"
                    }`}
                  >
                    {/* Type Icon */}
                    <NotificationIcon type={notification.type} />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-charcoal truncate">
                          {notification.title}
                        </p>
                        {isUnread && (
                          <span
                            className="w-2 h-2 rounded-full bg-terracotta shrink-0"
                            title="Unread alert"
                          />
                        )}
                      </div>
                      <p className="text-[11px] text-warmgray line-clamp-2 mt-0.5 leading-snug">
                        {notification.message}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-8 text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-sage mx-auto" />
                <p className="text-xs font-semibold text-charcoal">
                  You&apos;re all caught up
                </p>
                <p className="text-[11px] text-warmgray">
                  No active notifications or alerts at this time.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
