"use client";

import React from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { BarChart3, TrendingUp, Users, Phone, Bot, Download, Calendar } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Tổng quan", href: "/" },
              { label: "Báo cáo thống kê" },
            ]}
          />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Báo Cáo Tuyển Sinh &amp; Hiệu Quả Hoạt Động
          </h1>
          <p className="text-xs text-slate-500">
            Dữ liệu phân tích trực tiếp từ database: Hiệu quả nguồn khách, KPI nhân viên tư vấn và năng lực xử lý của AI.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          Xuất Báo Cáo Tuyển Sinh (Excel)
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Tổng doanh thu tuyển sinh</span>
          <div className="text-2xl font-black text-slate-900 mt-1">986.000.000 ₫</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">↑ 22% so với tháng trước</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Tổng cuộc gọi hợp lệ</span>
          <div className="text-2xl font-black text-blue-700 mt-1">452 cuộc</div>
          <div className="text-[11px] text-slate-500 mt-1">Thời lượng TB: 3p 12s</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Tỷ lệ chuyển đổi học thử</span>
          <div className="text-2xl font-black text-purple-700 mt-1">34.8%</div>
          <div className="text-[11px] text-purple-600 font-bold mt-1">112 buổi trải nghiệm</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Hội thoại AI xử lý trọn vẹn</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">88.5%</div>
          <div className="text-[11px] text-slate-500 mt-1">Chỉ 11.5% cần nhân viên can thiệp</div>
        </div>
      </div>

      {/* Staff Leaderboard */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
          Hiệu Quả Nhân Viên Tuyển Sinh Trong Tháng
        </h3>

        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="px-4 py-2.5">Nhân viên tư vấn</th>
              <th className="px-4 py-2.5">Số khách tiếp nhận</th>
              <th className="px-4 py-2.5">Cuộc gọi hợp lệ</th>
              <th className="px-4 py-2.5">Học viên chốt đơn</th>
              <th className="px-4 py-2.5">Doanh thu chốt</th>
              <th className="px-4 py-2.5 text-right">Tỷ lệ chốt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-4 py-3 font-bold text-slate-900">Trần Văn Bình</td>
              <td className="px-4 py-3">142 khách</td>
              <td className="px-4 py-3">128 cuộc</td>
              <td className="px-4 py-3 font-bold text-emerald-700">42 học viên</td>
              <td className="px-4 py-3 font-mono font-bold text-slate-900">285.600.000 ₫</td>
              <td className="px-4 py-3 text-right font-bold text-emerald-700">29.5%</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-bold text-slate-900">Lê Minh Trang</td>
              <td className="px-4 py-3">135 khách</td>
              <td className="px-4 py-3">119 cuộc</td>
              <td className="px-4 py-3 font-bold text-emerald-700">38 học viên</td>
              <td className="px-4 py-3 font-mono font-bold text-slate-900">258.400.000 ₫</td>
              <td className="px-4 py-3 text-right font-bold text-emerald-700">28.1%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
