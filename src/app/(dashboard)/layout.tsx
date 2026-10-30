"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Tự động khởi tạo phiên demo nếu chưa có để đảm bảo trải nghiệm mượt mà không bị kẹt
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("ta_crm_auth");
      if (!auth) {
        localStorage.setItem(
          "ta_crm_auth",
          JSON.stringify({
            email: "admin@taacademy.vn",
            name: "Nguyễn Thị Lan",
            role: "Quản trị tuyển sinh",
            loginAt: new Date().toISOString(),
          })
        );
      }
      setMounted(true);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-100">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-red-200 border-t-[#DC2626] rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700">Đang tải hệ thống CRM T.A Academy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-100">
      {/* 1. Left Sidebar - Đỏ Tươi Chuẩn */}
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
