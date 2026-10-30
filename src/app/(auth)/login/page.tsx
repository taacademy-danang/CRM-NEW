"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { BRAND_CONFIG } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@taacademy.vn");
  const [password, setPassword] = useState("12345678");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      if (!email.trim() || !password.trim()) {
        setError("Vui lòng nhập đầy đủ email và mật khẩu.");
        setIsLoading(false);
        return;
      }

      // Lưu trạng thái đăng nhập
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "ta_crm_auth",
          JSON.stringify({
            email,
            name: email.includes("admin") ? "Nguyễn Thị Lan" : "Trần Văn Bình",
            role: email.includes("admin") ? "Quản trị hệ thống" : "Tư vấn viên",
            token: "mock_jwt_session_token",
            loginAt: new Date().toISOString(),
          })
        );
      }

      router.push("/");
    }, 600);
  };

  const handleQuickLogin = (role: "admin" | "consultant") => {
    if (role === "admin") {
      setEmail("admin@taacademy.vn");
      setPassword("12345678");
    } else {
      setEmail("tuvan.binh@taacademy.vn");
      setPassword("12345678");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Top Header Banner - Đỏ Tươi */}
        <div className="bg-gradient-to-r from-[#DC2626] to-[#B91C1C] px-8 py-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="w-14 h-14 bg-white text-[#DC2626] rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-lg">
              TA
            </div>
            <h1 className="text-xl font-black tracking-wider uppercase">
              {BRAND_CONFIG.name}
            </h1>
            <p className="text-xs text-white/90 font-medium tracking-wide">
              HỆ THỐNG CRM &amp; AI TƯ VẤN TUYỂN SINH
            </p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="p-8 space-y-5">
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              Đăng Nhập Hệ Thống
            </h2>
            <p className="text-xs text-slate-500">
              Nhập tài khoản để truy cập bảng điều hành tuyển sinh
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" /> Email làm việc
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ten@taacademy.vn"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
            />
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" /> Mật khẩu
              </label>
              <a href="#" className="text-[11px] font-semibold text-[#DC2626] hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-600">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-slate-300 text-[#DC2626] focus:ring-[#DC2626]"
              />
              <span>Ghi nhớ phiên đăng nhập</span>
            </label>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Đang xác thực...</span>
            ) : (
              <>
                <span>Đăng Nhập Vào CRM</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* 1-Click Quick Demo Login */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Tài khoản Demo thử nghiệm nhanh
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin")}
                className="p-2 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Quản trị (Admin)
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("consultant")}
                className="p-2 rounded-xl border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Tư vấn viên
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="text-center mt-4 text-xs text-white/60">
        © 2026 T.A Academy • Bản quyền thuộc Học viện Phong Thái &amp; Model Kids
      </div>
    </div>
  );
}
