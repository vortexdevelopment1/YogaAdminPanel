// Sidebar navigation component with active route highlighting and responsive drawer support

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  LayoutDashboard,
  CalendarCheck,
  CalendarClock,
  IndianRupee,
  Tag,
  Clock,
  ListOrdered,
  Video,
  BarChart3,
  UserCheck,
  Star,
  MessageCircle,
  FileDown,
  LogOut,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Bookings", href: "/bookings", icon: CalendarCheck },
  { name: "Renewals", href: "/renewals", icon: CalendarClock },
  { name: "Revenue", href: "/revenue", icon: IndianRupee },
  { name: "Coupons", href: "/coupons", icon: Tag },
  { name: "Slots", href: "/slots", icon: Clock },
  { name: "Waitlist", href: "/waitlist", icon: ListOrdered },
  { name: "Zoom", href: "/zoom", icon: Video },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Attendance", href: "/attendance", icon: UserCheck },
  { name: "Feedback", href: "/feedback", icon: Star },
  { name: "WhatsApp", href: "/whatsapp", icon: MessageCircle },
  { name: "Reports", href: "/reports", icon: FileDown },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-forest text-white flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col min-h-0 flex-1">
          {/* Header & Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sage flex items-center justify-center text-white shadow-sm">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-serif text-lg font-semibold tracking-wide">
                Escape in Yoga
              </span>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="md:hidden text-white/70 hover:text-white p-1 rounded-md"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sage text-white shadow-sm"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <Link
            href="/login"
            className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
