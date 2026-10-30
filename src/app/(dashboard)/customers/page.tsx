"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Calendar,
  ChevronRight,
  ExternalLink,
  Download,
} from "lucide-react";
import { Customer } from "@/types/crm";

const mockCustomers: Customer[] = [
  {
    id: "cust-1",
    customer_code: "TA-2026-0891",
    full_name: "Phạm Thu Hương",
    phone: "0988123456",
    source: "facebook",
    status: "consulting",
    call_status: "contacted",
    first_phone_received_at: "2026-10-30T07:10:00Z",
    sla_alert_level: "none",
    assigned_to_name: "Trần Văn Bình",
    interested_course_title: "Model Kids Nâng Cao",
    students: [
      {
        id: "st-1",
        parent_id: "cust-1",
        full_name: "Bé Gia Hân (7 tuổi)",
        hobby_and_traits: "Nhút nhát, muốn rèn sự tự tin",
        created_at: "2026-10-30",
      },
    ],
    created_at: "2026-10-30",
    updated_at: "2026-10-30",
  },
  {
    id: "cust-2",
    customer_code: "TA-2026-0892",
    full_name: "Nguyễn Hoàng Nam",
    phone: "0912345888",
    source: "zalo",
    status: "uncalled",
    call_status: "pending",
    first_phone_received_at: "2026-10-30T07:20:00Z",
    sla_alert_level: "warning_15m",
    assigned_to_name: "Lê Minh Trang",
    interested_course_title: "Phong thái Doanh Nhân",
    waiting_minutes: 25,
    students: [],
    created_at: "2026-10-30",
    updated_at: "2026-10-30",
  },
  {
    id: "cust-3",
    customer_code: "TA-2026-0880",
    full_name: "Đặng Thị Bích Ngọc",
    phone: "0934111222",
    source: "referral",
    status: "registered",
    call_status: "contacted",
    first_phone_received_at: "2026-10-25T10:00:00Z",
    sla_alert_level: "none",
    assigned_to_name: "Nguyễn Thị Lan",
    interested_course_title: "Phong thái Nữ Hoàng",
    students: [
      {
        id: "st-3a",
        parent_id: "cust-3",
        full_name: "Đặng Thị Bích Ngọc (Học viên chính)",
        created_at: "2026-10-25",
      },
      {
        id: "st-3b",
        parent_id: "cust-3",
        full_name: "Bé Bảo An (6 tuổi)",
        created_at: "2026-10-25",
      },
    ],
    created_at: "2026-10-25",
    updated_at: "2026-10-26",
  },
];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = mockCustomers.filter((c) => {
    const matchSearch =
      c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.phone && c.phone.includes(searchTerm)) ||
      c.customer_code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Tổng quan", href: "/" },
              { label: "Khách hàng & Học viên" },
            ]}
          />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản Lý Khách Hàng & Học Viên
          </h1>
          <p className="text-xs text-slate-500">
            Hồ sơ tuyển sinh phụ huynh và học viên T.A Academy (Mô hình 1 phụ huynh - nhiều học viên)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Xuất Excel
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#8B1D2C] hover:bg-[#721422] rounded-xl transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Thêm Khách Mới
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên phụ huynh, SĐT, mã khách hàng..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]/20"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="uncalled">Chưa gọi</option>
            <option value="consulting">Đang tư vấn</option>
            <option value="trial_scheduled">Hẹn học thử</option>
            <option value="registered">Đã đăng ký</option>
          </select>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          Hiển thị {filtered.length} hồ sơ
        </span>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Mã KH</th>
              <th className="px-4 py-3">Phụ huynh</th>
              <th className="px-4 py-3">Số điện thoại</th>
              <th className="px-4 py-3">Học viên (Bé)</th>
              <th className="px-4 py-3">Khóa học quan tâm</th>
              <th className="px-4 py-3">Nguồn</th>
              <th className="px-4 py-3">Trạng thái</th>
              <th className="px-4 py-3">Nhân viên</th>
              <th className="px-4 py-3 text-right">Chi tiết</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-slate-800">
                  {c.customer_code}
                </td>
                <td className="px-4 py-3 font-bold text-slate-900">
                  {c.full_name}
                </td>
                <td className="px-4 py-3 font-mono text-slate-800 font-medium">
                  {c.phone || "--"}
                </td>
                <td className="px-4 py-3">
                  {c.students && c.students.length > 0 ? (
                    <div className="space-y-0.5">
                      {c.students.map((st) => (
                        <div key={st.id} className="font-semibold text-[#8B1D2C]">
                          • {st.full_name}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400">Chưa có học viên</span>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold text-slate-800">
                  <span className="px-2 py-0.5 bg-rose-50 text-[#8B1D2C] rounded border border-rose-100 text-[11px]">
                    {c.interested_course_title || "Chưa xác định"}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize text-slate-600">
                  {c.source}
                </td>
                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                    {c.status === "consulting"
                      ? "Đang tư vấn"
                      : c.status === "uncalled"
                      ? "Chưa gọi"
                      : "Đã đăng ký"}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium text-slate-700">
                  {c.assigned_to_name || "Chưa giao"}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={`/customers/${c.id}`}
                    className="p-1.5 text-slate-500 hover:text-[#8B1D2C] hover:bg-rose-50 rounded-lg inline-flex items-center"
                    title="Mở hồ sơ 6 khu vực"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
