"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CallLogModal from "@/components/dashboard/CallLogModal";
import { Customer } from "@/types/crm";
import {
  Users,
  UserPlus,
  PhoneCall,
  Clock,
  Sparkles,
  Award,
  AlertTriangle,
  Copy,
  Check,
  Phone,
  Calendar,
  TrendingUp,
  Bot,
  ExternalLink,
  UserCheck,
} from "lucide-react";

// Dữ liệu hàng đợi ưu tiên cao
const initialUncalledLeads: Customer[] = [
  {
    id: "lead-01",
    customer_code: "TV-2026-001",
    full_name: "Phạm Thu Hương",
    phone: "0988123456",
    source: "facebook",
    status: "uncalled",
    call_status: "pending",
    first_phone_received_at: new Date(Date.now() - 65 * 60 * 1000).toISOString(), // 65 phút (>60m: Đỏ nguy cấp)
    sla_alert_level: "danger_60m",
    assigned_to_name: "Trần Văn Bình",
    interested_course_title: "Model Kids (Mẫu Nhí Tài Năng)",
    waiting_minutes: 65,
    notes: "Bé 7 tuổi nhút nhát, muốn rèn dáng đi tự tin",
    created_at: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "lead-02",
    customer_code: "TV-2026-002",
    full_name: "Nguyễn Hoàng Nam",
    phone: "0912345888",
    source: "zalo",
    status: "uncalled",
    call_status: "pending",
    first_phone_received_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 phút (>15m: Cảnh báo)
    sla_alert_level: "warning_15m",
    assigned_to_name: "Lê Minh Trang",
    interested_course_title: "Phong Thái Doanh Nhân",
    waiting_minutes: 25,
    notes: "Hỏi lịch học ngoài giờ",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "lead-03",
    customer_code: "TV-2026-003",
    full_name: "Hoàng Kiều Trinh",
    phone: "0909555666",
    source: "facebook",
    status: "uncalled",
    call_status: "pending",
    first_phone_received_at: new Date(Date.now() - 6 * 60 * 1000).toISOString(), // 6 phút
    sla_alert_level: "none",
    assigned_to_name: "Trần Văn Bình",
    interested_course_title: "Catwalk Chuyên Nghiệp",
    waiting_minutes: 6,
    notes: "Quan tâm lớp sân khấu",
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function DashboardPage() {
  const [uncalledLeads, setUncalledLeads] = useState<Customer[]>(initialUncalledLeads);
  const [selectedCustomerForCall, setSelectedCustomerForCall] = useState<Customer | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCallSuccess = (updatedCustomer: Customer) => {
    setUncalledLeads((prev) => prev.filter((c) => c.id !== updatedCustomer.id));
  };

  const copyPhoneNumber = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenCallModal = (lead: Customer) => {
    setSelectedCustomerForCall(lead);
    setIsCallModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: "Tổng quan CRM" }]} />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Bảng Điều Hành Tiếp Nhận &amp; Tư Vấn Tuyển Sinh
          </h1>
          <p className="text-xs text-slate-500">
            Học viện Đào tạo Phong thái - Catwalk - Model Kids T.A Academy
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-[#DC2626]" />
            <span>Hôm nay: {new Date().toLocaleDateString("vi-VN")}</span>
          </div>
        </div>
      </div>

      {/* 2. 6 Thẻ Chỉ Số Tổng Quan - Tone Đỏ Tươi */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Tổng tiếp nhận</span>
            <div className="p-2 bg-slate-50 rounded-xl text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">1.280</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +14% tháng này
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Mới hôm nay</span>
            <div className="p-2 bg-red-50 rounded-xl text-[#DC2626]">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#DC2626]">42</div>
          <div className="text-[11px] text-slate-500 mt-1">Từ FB, Zalo &amp; Hotline</div>
        </div>

        {/* Khách chưa gọi (ƯU TIÊN CAO NHẤT) */}
        <div className="bg-gradient-to-br from-red-50 to-red-100/60 p-4 rounded-2xl border-2 border-red-400 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-red-900">Khách chưa gọi (SLA)</span>
            <div className="p-2 bg-[#DC2626] rounded-xl text-white shadow-xs animate-pulse">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#DC2626]">{uncalledLeads.length}</div>
          <div className="text-[11px] text-red-700 font-semibold mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-600" /> Cần liên hệ ngay
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Đang tư vấn</span>
            <div className="p-2 bg-purple-50 rounded-xl text-purple-700">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-purple-700">96</div>
          <div className="text-[11px] text-slate-500 mt-1">Theo dõi chuyên sâu</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Hẹn học thử</span>
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-700">34</div>
          <div className="text-[11px] text-slate-500 mt-1">Lịch học tuần này</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Đã chốt đăng ký</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">145</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Tỷ lệ chốt: 28.5%</div>
        </div>
      </div>

      {/* 3. KHU VỰC KHÁCH CHƯA GỌI – CHỨC NĂNG ƯU TIÊN CAO NHẤT */}
      <div className="bg-white rounded-2xl border-2 border-[#DC2626]/40 shadow-sm overflow-hidden">
        {/* Header hàng đợi */}
        <div className="p-4 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-xs">
              <PhoneCall className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">
                  DANH SÁCH KHÁCH CHƯA GỌI – ƯU TIÊN CAO NHẤT
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white text-[#DC2626] shadow-xs">
                  {uncalledLeads.length} khách chờ
                </span>
              </div>
              <p className="text-xs text-white/90">
                Khách hàng đã cung cấp số điện thoại. Quy tắc SLA: Cảnh báo vàng sau 15 phút, báo đỏ nguy cấp sau 60 phút.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 bg-white/20 px-2.5 py-1 rounded-lg text-white font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-300" /> &gt; 15 phút (Cảnh báo)
            </span>
            <span className="flex items-center gap-1 bg-black/30 px-2.5 py-1 rounded-lg text-white font-bold">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" /> &gt; 60 phút (Nguy cấp)
            </span>
          </div>
        </div>

        {/* Bảng danh sách khách chưa gọi */}
        <div className="overflow-x-auto">
          {uncalledLeads.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                Xuất sắc! Tất cả khách hàng đều đã được gọi xác nhận.
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Không còn khách hàng nào có số điện thoại đang chờ cuộc gọi. Các tư vấn viên tiếp tục chăm sóc các cuộc hẹn học thử tiếp theo.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Mức độ SLA</th>
                  <th className="px-4 py-3">Khách hàng liên hệ</th>
                  <th className="px-4 py-3">Số điện thoại</th>
                  <th className="px-4 py-3">Khóa học quan tâm</th>
                  <th className="px-4 py-3">Nguồn</th>
                  <th className="px-4 py-3">Thời gian chờ</th>
                  <th className="px-4 py-3">Tư vấn viên</th>
                  <th className="px-4 py-3 text-right">Thao tác xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {uncalledLeads.map((lead) => {
                  const isDanger = lead.waiting_minutes && lead.waiting_minutes >= 60;
                  const isWarning = lead.waiting_minutes && lead.waiting_minutes >= 15 && lead.waiting_minutes < 60;

                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isDanger ? "bg-red-50/50" : isWarning ? "bg-amber-50/40" : ""
                      }`}
                    >
                      <td className="px-4 py-3.5">
                        {isDanger ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-red-100 text-red-800 border border-red-200 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                            Nguy cấp &gt; 60m
                          </span>
                        ) : isWarning ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            Cảnh báo &gt; 15m
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                            Mới tiếp nhận
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 text-sm">
                          {lead.full_name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {lead.notes || "Khách yêu cầu tư vấn"}
                        </div>
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                          <span>{lead.phone}</span>
                          <button
                            type="button"
                            onClick={() => copyPhoneNumber(lead.phone || "", lead.id)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800"
                            title="Sao chép số"
                          >
                            {copiedId === lead.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 font-semibold text-slate-800">
                        <span className="px-2.5 py-1 bg-red-50 text-[#DC2626] rounded-lg border border-red-100 text-xs font-bold">
                          {lead.interested_course_title}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 capitalize">
                        {lead.source}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`font-mono font-bold ${
                            isDanger ? "text-red-700 text-sm" : isWarning ? "text-amber-700 font-semibold" : "text-slate-600"
                          }`}
                        >
                          {lead.waiting_minutes} phút
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        {lead.assigned_to_name || "Chưa giao"}
                      </td>

                      <td className="px-4 py-3.5 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenCallModal(lead)}
                          className="px-3 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl font-bold shadow-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          Xác nhận cuộc gọi
                        </button>

                        <a
                          href="/consultations"
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg inline-flex items-center"
                          title="Xem chi tiết tư vấn"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal ghi nhận cuộc gọi */}
      <CallLogModal
        customer={selectedCustomerForCall}
        isOpen={isCallModalOpen}
        onClose={() => {
          setIsCallModalOpen(false);
          setSelectedCustomerForCall(null);
        }}
        onSuccess={handleCallSuccess}
      />
    </div>
  );
}
