"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Kiểm tra phiên đăng nhập từ localStorage
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem("ta_crm_auth");
      if (!authData) {
        setIsAuthenticated(false);
        router.push("/login");
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [router]);

  // Loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-100">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-red-200 border-t-[#DC2626] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-600">Đang kiểm tra phiên đăng nhập CRM...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null; // Will redirect to /login
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100">
      {/* 1. Left Sidebar - Đỏ Tươi */}
      <Sidebar />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <Topbar />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#F8FAFC]">
          {children}
        </main>
      </div>
    </div>
  );
}
