// Topbar navigation header displaying current page title, mobile toggle, and admin user profile

"use client";

import { usePathname } from "next/navigation";
import { Menu, Sun, Moon } from "lucide-react";
import NotificationBell from "@/components/layout/NotificationBell";
import { useTheme } from "@/context/ThemeContext";

interface TopbarProps {
  onToggleSidebar: () => void;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/bookings": "Bookings",
  "/renewals": "Renewals",
  "/revenue": "Revenue",
  "/coupons": "Coupons",
  "/slots": "Slots",
  "/waitlist": "Waitlist",
  "/zoom": "Zoom Sessions",
  "/analytics": "Analytics",
  "/attendance": "Attendance",
  "/feedback": "Feedback",
  "/whatsapp": "WhatsApp",
  "/reports": "Reports",
};

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const currentTitle = pageTitles[pathname] || "Admin Panel";

  return (
    <header className="h-16 bg-white border-b border-sand px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Left side: Mobile menu toggle button + Desktop page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-charcoal hover:bg-sand/40 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-forest font-serif">
          {currentTitle}
        </h2>
      </div>

      {/* Right side: Theme Toggle, Notification Bell & User avatar/details */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-xl text-charcoal hover:bg-sand/40 transition-colors cursor-pointer"
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 text-[#E0B45A]" />
          ) : (
            <Moon className="w-5 h-5 text-charcoal" />
          )}
        </button>

        {/* Notification Bell Dropdown */}
        <NotificationBell />

        {/* User profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-sand/60">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-sage text-white flex items-center justify-center font-semibold text-sm shadow-sm">
            AJ
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-semibold text-charcoal leading-tight">
              Avani Jain
            </span>
            <span className="text-xs text-warmgray font-medium">
              Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
