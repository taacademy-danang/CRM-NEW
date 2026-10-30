"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Mail,
  Users,
  Bot,
  GitFork,
  BarChart3,
  Settings,
  ChevronDown,
  Sparkles,
  Diamond,
} from "lucide-react";
import { MAIN_NAVIGATION, BRAND_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Map icon string to Lucide component
const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Mail,
  Users,
  Bot,
  GitFork,
  BarChart3,
  Settings,
};

export default function Sidebar() {
  const pathname = usePathname();
  const [aiSubmenuOpen, setAiSubmenuOpen] = useState(true);

  return (
    <aside className="w-64 bg-gradient-to-b from-[#8B1D2C] via-[#7B1826] to-[#5F0F1B] text-white flex flex-col h-screen shrink-0 shadow-xl border-r border-[#A8242F]/30 select-none overflow-y-auto">
      {/* 1. Header Logo & Brand */}
      <div className="p-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#996515] p-[1.5px] shadow-md shrink-0">
          <div className="w-full h-full bg-[#721422] rounded-[10px] flex items-center justify-center text-[#F3ECD7] font-bold text-lg tracking-wider">
            TA
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold tracking-wider text-base text-white drop-shadow-sm">
            {BRAND_CONFIG.name}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-[#DAC387] font-medium leading-tight">
            {BRAND_CONFIG.tagline}
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Items */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {MAIN_NAVIGATION.map((item) => {
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
                      ? "bg-white/15 text-white shadow-sm backdrop-blur-sm font-semibold"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("w-5 h-5 transition-transform duration-200 group-hover:scale-105", isActive ? "text-[#DAC387]" : "text-white/70")} />
                    <span>{item.name}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-white/60 transition-transform duration-200",
                      aiSubmenuOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* Submenu for AI Training Center */}
                {aiSubmenuOpen && item.subItems && (
                  <div className="pl-9 pr-1 py-1 space-y-0.5 border-l-2 border-white/15 ml-5 mt-1">
                    {item.subItems.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          className={cn(
                            "block px-3 py-1.5 rounded-lg text-xs transition-colors duration-150",
                            isSubActive
                              ? "bg-white/20 text-[#DAC387] font-semibold shadow-xs"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className={cn("w-1.5 h-1.5 rounded-full", isSubActive ? "bg-[#D4AF37]" : "bg-white/40")} />
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
                  ? "bg-white/15 text-white shadow-sm backdrop-blur-sm font-semibold border-l-4 border-[#D4AF37]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-5 h-5 transition-transform duration-200 group-hover:scale-105", isActive ? "text-[#DAC387]" : "text-white/70")} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#EF4444] text-white shadow-xs">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* 3. Bottom Brand Card (Tỏa sáng Phong thái Việt) */}
      <div className="p-3 mt-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#A8242F]/80 to-[#5A0E1A] p-3.5 border border-[#DAC387]/30 shadow-lg text-center">
          <div className="flex items-center justify-center gap-1.5 text-[#DAC387] mb-1">
            <Diamond className="w-3.5 h-3.5 fill-[#DAC387]/30 text-[#DAC387]" />
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/90">
              T.A ACADEMY
            </span>
          </div>
          <p className="text-sm font-serif italic text-[#F3ECD7] drop-shadow-sm font-medium">
            "{BRAND_CONFIG.quote}"
          </p>
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-center gap-1 text-[10px] text-white/60">
            <Sparkles className="w-3 h-3 text-[#DAC387]" />
            <span>Đẳng cấp &amp; Tự tin</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
