// Layout wrapper for authenticated admin routes with AdminProvider, responsive Sidebar, and Topbar

"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";
import { AdminProvider } from "@/context/AdminContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AdminProvider>
      <div className="min-h-screen bg-cream">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Layout Area */}
        <div className="md:ml-64 flex flex-col min-h-screen">
          <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

          <main className="flex-1 p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
