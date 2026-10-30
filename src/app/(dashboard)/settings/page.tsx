"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Settings, Users, Shield, BookOpen, Clock, Key, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [warningMin, setWarningMin] = useState(15);
  const [dangerMin, setDangerMin] = useState(60);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Tổng quan", href: "/" },
              { label: "Cài đặt hệ thống" },
            ]}
          />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#DC2626]" />
            <span>Cài Đặt Hệ Thống Tuyển Sinh T.A Academy</span>
          </h1>
          <p className="text-xs text-slate-500">
            Quản trị tham số tư vấn tuyển sinh, mốc thời gian cảnh báo SLA cuộc gọi, phân quyền RBAC và danh mục khóa học.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-colors"
        >
          <Save className="w-4 h-4" />
          Lưu Cài Đặt Hệ Thống
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Đã lưu cập nhật thông số hệ thống thành công!
        </div>
      )}

      {/* SLA Settings Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#DC2626]" />
          <span>Cấu Hình Mốc Cảnh Báo SLA Khách Chưa Gọi (Priority Queue)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Mốc cảnh báo mức Vàng (phút)</label>
            <input
              type="number"
              value={warningMin}
              onChange={(e) => setWarningMin(Number(e.target.value))}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            />
            <p className="text-[11px] text-slate-500">Mặc định: 15 phút sau khi có SĐT mà chưa có cuộc gọi xác nhận.</p>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Mốc nguy cấp mức Đỏ (phút)</label>
            <input
              type="number"
              value={dangerMin}
              onChange={(e) => setDangerMin(Number(e.target.value))}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-red-600"
            />
            <p className="text-[11px] text-slate-500">Mặc định: 60 phút. Khách hàng sẽ bị đẩy lên đỉnh hàng đợi ưu tiên cao.</p>
          </div>
        </div>
      </div>

      {/* Courses Knowledge Master */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#DC2626]" />
            <span>Danh Mục Khóa Học Chuẩn Tuyển Sinh (Nguồn Chuẩn Cho AI)</span>
          </h3>
          <span className="text-xs text-slate-400">4 khóa học chính thức</span>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Model Kids (Mẫu Nhí Tài Năng)</div>
              <div className="text-[11px] text-slate-500">Độ tuổi 4–12 tuổi • Thời lượng 12 buổi</div>
            </div>
            <div className="font-mono font-bold text-[#DC2626]">6.800.000 ₫</div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Phong Thái Quý Cô &amp; Doanh Nhân</div>
              <div className="text-[11px] text-slate-500">Dành cho phái đẹp &gt; 18 tuổi • Thời lượng 8 buổi chuyên sâu</div>
            </div>
            <div className="font-mono font-bold text-[#DC2626]">12.500.000 ₫</div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Catwalk Chuyên Nghiệp</div>
              <div className="text-[11px] text-slate-500">Trình diễn sân khấu &amp; Giải phóng hình thể • 10 buổi</div>
            </div>
            <div className="font-mono font-bold text-[#DC2626]">8.500.000 ₫</div>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-900">Nghệ Thuật Giao Tiếp &amp; Thuyết Trình</div>
              <div className="text-[11px] text-slate-500">Tự tin truyền cảm hứng trước đám đông • 8 buổi</div>
            </div>
            <div className="font-mono font-bold text-[#DC2626]">5.500.000 ₫</div>
          </div>
        </div>
      </div>
    </div>
  );
}
