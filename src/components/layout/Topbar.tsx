"use client";

import React, { useState, useEffect } from "react";
import { Search, Bell, Sparkles, LogOut, ShieldCheck, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Topbar() {
  const router = useRouter();
  const [userName, setUserName] = useState("Nguyễn Thị Lan");
  const [userRole, setUserRole] = useState("admin");
  const [roleTitle, setRoleTitle] = useState("Quản trị hệ thống");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedAuth = localStorage.getItem("ta_crm_auth");
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          if (parsed.name) setUserName(parsed.name);
          if (parsed.role) setUserRole(parsed.role);
          if (parsed.roleTitle) setRoleTitle(parsed.roleTitle);
          else setRoleTitle(parsed.role === "admin" ? "Quản trị hệ thống" : "Lễ tân / Tư vấn viên");
        }
      } catch (e) {
        console.error("Error parsing auth", e);
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ta_crm_auth");
    }
    router.push("/login");
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* 1. Global Search Bar */}
      <div className="relative w-96 max-w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Tìm kiếm tư vấn, số điện thoại, khách hàng..."
          className="w-full pl-10 pr-12 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626] transition-all"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded shadow-xs">
            ⌘ K
          </kbd>
        </div>
      </div>

      {/* 2. Right-side Status & User Profile */}
      <div className="flex items-center gap-4">
        {/* AI Quick Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-xs text-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            AI Tuyển sinh: Hoạt động 24/7
          </span>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Thông báo"
          className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#DC2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* User Profile dropdown info */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-[#DC2626] text-white font-bold flex items-center justify-center text-xs shadow-xs">
            {getInitials(userName)}
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">
              {userName}
            </span>
            <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
              {userRole === "admin" ? (
                <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
              ) : (
                <UserCheck className="w-3 h-3 text-amber-600 inline" />
              )}
              {roleTitle}
            </span>
          </div>

          {/* Nút Đăng Xuất */}
          <button
            type="button"
            onClick={handleLogout}
            title="Đăng xuất"
            className="p-1.5 text-slate-400 hover:text-[#DC2626] hover:bg-red-50 rounded-lg transition-colors ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
