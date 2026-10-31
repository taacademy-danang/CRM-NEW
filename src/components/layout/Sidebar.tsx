"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Users,
  Cpu,
  Bot,
  Settings,
  ChevronDown,
  Sparkles,
  Flame,
} from "lucide-react";
import { MAIN_NAVIGATION, BRAND_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Mail,
  Users,
  Cpu,
  Bot,
  Settings,
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [aiSubmenuOpen, setAiSubmenuOpen] = useState(true);
  const [userRole, setUserRole] = useState<string>("admin");
  const [userName, setUserName] = useState<string>("Quản trị viên");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedAuth = localStorage.getItem("ta_crm_auth");
        if (storedAuth) {
          const parsed = JSON.parse(storedAuth);
          if (parsed.role) {
            setUserRole(parsed.role);
            setUserName(parsed.name || (parsed.role === "admin" ? "Quản trị viên" : "Lễ tân"));
          }
        }
      } catch (e) {
        console.error("Error reading auth state:", e);
      }
    }
  }, []);

  // Bảo vệ route cho Lễ tân: Nếu lễ tân vào /settings hoặc /ai-training thì chuyển về /
  useEffect(() => {
    if (userRole === "receptionist") {
      if (pathname.startsWith("/ai-training") || pathname.startsWith("/settings")) {
        router.replace("/");
      }
    }
  }, [userRole, pathname, router]);

  // Lọc menu theo phân quyền
  const filteredNav = MAIN_NAVIGATION.filter((item) => {
    if (userRole === "receptionist") {
      // Lễ tân chỉ xem được: Tổng quan (/), Hộp thư tư vấn (/inbox), Quản lý khách hàng (/consultations), AI Tự động hóa tác vụ lặp lại (/ai-tasks)
      const allowedPaths = ["/", "/inbox", "/consultations", "/ai-tasks"];
      return allowedPaths.includes(item.href);
    }
    // Admin xem tất cả
    return true;
  });

  return (
    <aside className="w-64 bg-gradient-to-b from-[#DC2626] via-[#C81E2E] to-[#991B1B] text-white flex flex-col h-screen shrink-0 shadow-xl border-r border-red-700 select-none overflow-y-auto">
      {/* 1. Header Logo & Brand - Đỏ tươi & Trắng */}
      <div className="p-5 border-b border-white/15 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white p-[2px] shadow-md shrink-0">
          <div className="w-full h-full bg-[#DC2626] rounded-[9px] flex items-center justify-center text-white font-extrabold text-base tracking-wider">
            TA
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold tracking-wider text-base text-white drop-shadow-xs">
            {BRAND_CONFIG.name}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-white/80 font-medium leading-tight">
            {BRAND_CONFIG.tagline}
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Items */}
      <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
        {filteredNav.map((item) => {
          const Icon = iconMap[item.iconName] || LayoutDashboard;
          const isAiMenu = item.href === "/ai-training";
          const isActive = isAiMenu
            ? pathname.startsWith("/ai-training")
            : pathname === item.href;

          if (isAiMenu) {
            return (
              <div key={item.name} className="space-y-1">
                <button
                  type="button"
                  onClick={() => setAiSubmenuOpen(!aiSubmenuOpen)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                    isActive
                      ? "bg-white text-[#DC2626] shadow-sm font-bold"
                      : "text-white/90 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-5 h-5 transition-transform duration-200 group-hover:scale-105", isActive ? "text-[#DC2626]" : "text-white/80")} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-current transition-transform duration-200",
                      aiSubmenuOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Submenu for AI Training Center */}
                {aiSubmenuOpen && item.subItems && (
                  <div className="pl-9 pr-1 py-1 space-y-0.5 border-l-2 border-white/20 ml-5 mt-1">
                    {item.subItems.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={cn(
                            "block px-3 py-1.5 rounded-lg text-xs transition-colors duration-150",
                            isSubActive
                              ? "bg-white/20 text-white font-bold shadow-xs"
                              : "text-white/80 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className={cn("w-1.5 h-1.5 rounded-full", isSubActive ? "bg-white" : "bg-white/40")} />
                            <span>{sub.name}</span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive
                  ? "bg-white text-[#DC2626] shadow-sm font-bold border-l-4 border-slate-900"
                  : "text-white/90 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5 transition-transform duration-200 group-hover:scale-105", isActive ? "text-[#DC2626]" : "text-white/80")} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={cn(
                  "px-2 py-0.5 text-[11px] font-bold rounded-full shadow-xs",
                  isActive ? "bg-[#DC2626] text-white" : "bg-white text-[#DC2626]"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. Bottom Brand Card */}
      <div className="p-3 mt-auto">
        <div className="rounded-2xl bg-black/20 p-3.5 border border-white/20 shadow-md text-center">
          <div className="flex items-center justify-center gap-1.5 text-white mb-1">
            <Flame className="w-4 h-4 text-white" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">
              T.A ACADEMY
            </span>
          </div>
          <p className="text-sm font-serif italic text-white drop-shadow-xs font-semibold">
            "{BRAND_CONFIG.quote}"
          </p>
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-center gap-1 text-[10px] text-white/80">
            <Sparkles className="w-3 h-3 text-white" />
            <span>Tư vấn tuyển sinh thông minh</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
