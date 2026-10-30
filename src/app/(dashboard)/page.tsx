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
  ChevronRight,
  Calendar,
  ArrowUpRight,
  TrendingUp,
  UserCheck,
  Bot,
  ExternalLink,
} from "lucide-react";
import { formatTimeVN } from "@/lib/utils";

// Initial state with leads adhering to Master Prompt requirements
const initialUncalledLeads: Customer[] = [
  {
    id: "lead-01",
    customer_code: "TA-2026-0891",
    full_name: "Phạm Thu Hương",
    phone: "0988123456",
    source: "facebook",
    status: "uncalled",
    call_status: "pending",
    first_phone_received_at: new Date(Date.now() - 65 * 60 * 1000).toISOString(), // 65 phút trước (>60m: Danger Red)
    sla_alert_level: "danger_60m",
    assigned_to_name: "Trần Văn Bình",
    interested_course_title: "Model Kids Nâng Cao",
    waiting_minutes: 65,
    students: [
      {
        id: "st-01",
        parent_id: "lead-01",
        full_name: "Bé Gia Hân (7 tuổi)",
        hobby_and_traits: "Nhút nhát, muốn rèn sự tự tin",
        created_at: new Date().toISOString(),
      },
    ],
    created_at: new Date(Date.now() - 70 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "lead-02",
    customer_code: "TA-2026-0892",
    full_name: "Nguyễn Hoàng Nam",
    phone: "0912345888",
    source: "zalo",
    status: "uncalled",
    call_status: "pending",
    first_phone_received_at: new Date(Date.now() - 25 * 60 * 1000).toISOString(), // 25 phút trước (>15m: Warning Yellow)
    sla_alert_level: "warning_15m",
    assigned_to_name: "Lê Minh Trang",
    interested_course_title: "Phong thái Doanh Nhân",
    waiting_minutes: 25,
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "lead-03",
    customer_code: "TA-2026-0893",
    full_name: "Hoàng Kiều Trinh",
    phone: "0909555666",
    source: "facebook",
    status: "uncalled",
    call_status: "pending",
    first_phone_received_at: new Date(Date.now() - 6 * 60 * 1000).toISOString(), // 6 phút trước (Bình thường)
    sla_alert_level: "none",
    assigned_to_name: "Trần Văn Bình",
    interested_course_title: "Catwalk Chuyên Nghiệp",
    waiting_minutes: 6,
    created_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function DashboardPage() {
  const [uncalledLeads, setUncalledLeads] = useState<Customer[]>(initialUncalledLeads);
  const [selectedCustomerForCall, setSelectedCustomerForCall] = useState<Customer | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Xử lý khi xác nhận cuộc gọi thành công -> Loại khỏi danh sách Khách chưa gọi
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
            Bảng Điều Hành Tuyển Sinh & Chăm Sóc Khách Hàng
          </h1>
          <p className="text-xs text-slate-500">
            Học viện Đào tạo Phong thái - Catwalk - Model Kids T.A Academy
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Hôm nay: {new Date().toLocaleDateString("vi-VN")}</span>
          </div>
        </div>
      </div>

      {/* 2. 6 Tổng Quan Thẻ Thống Kê (Realtime Metrics) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Thẻ 1: Tổng khách hàng */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Tổng khách hàng</span>
            <div className="p-2 bg-slate-50 rounded-xl text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">1.280</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" /> +14% tháng này
          </div>
        </div>

        {/* Thẻ 2: Khách mới hôm nay */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Khách mới hôm nay</span>
            <div className="p-2 bg-blue-50 rounded-xl text-blue-700">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-blue-700">42</div>
          <div className="text-[11px] text-slate-500 mt-1">Từ FB, Zalo & Hotline</div>
        </div>

        {/* Thẻ 3: Khách chưa gọi (ƯU TIÊN CAO NHẤT) */}
        <div className="bg-gradient-to-br from-rose-50 to-red-50 p-4 rounded-2xl border-2 border-red-300 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold text-red-900">Khách chưa gọi (SLA)</span>
            <div className="p-2 bg-red-600 rounded-xl text-white shadow-xs animate-pulse">
              <PhoneCall className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-red-700">{uncalledLeads.length}</div>
          <div className="text-[11px] text-red-700 font-semibold mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-red-600" /> Cần liên hệ ngay
          </div>
        </div>

        {/* Thẻ 4: Đang tư vấn */}
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

        {/* Thẻ 5: Khách cần chăm sóc */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Khách cần chăm sóc</span>
            <div className="p-2 bg-amber-50 rounded-xl text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-amber-700">34</div>
          <div className="text-[11px] text-slate-500 mt-1">Lịch gọi lại hôm nay</div>
        </div>

        {/* Thẻ 6: Khách đã đăng ký */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Khách đã đăng ký</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">145</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Tỷ lệ chốt: 28.5%</div>
        </div>
      </div>

      {/* 3. KHU VỰC KHÁCH CHƯA GỌI – CHỨC NĂNG ƯU TIÊN CAO NHẤT (PRIORITY QUEUE) */}
      <div className="bg-white rounded-2xl border-2 border-[#8B1D2C]/40 shadow-sm overflow-hidden">
        {/* Header hàng đợi */}
        <div className="p-4 bg-gradient-to-r from-[#8B1D2C] via-[#9B2232] to-[#721422] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-xs">
              <PhoneCall className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold tracking-tight">
                  DANH SÁCH KHÁCH CHƯA GỌI – ƯU TIÊN CAO NHẤT
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-white text-[#8B1D2C] shadow-xs">
                  {uncalledLeads.length} khách chờ
                </span>
              </div>
              <p className="text-xs text-[#F3ECD7]">
                Khách hàng đã cung cấp số điện thoại. Quy tắc SLA: Cảnh báo vàng sau 15 phút, báo đỏ nguy cấp sau 60 phút.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 bg-amber-500/30 px-2.5 py-1 rounded-lg text-amber-100 border border-amber-300/30">
              <span className="w-2 h-2 rounded-full bg-amber-400" /> &gt; 15 phút (Cảnh báo)
            </span>
            <span className="flex items-center gap-1 bg-red-500/40 px-2.5 py-1 rounded-lg text-red-100 border border-red-300/40">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" /> &gt; 60 phút (Ưu tiên cao)
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
                Không còn khách hàng nào có số điện thoại đang chờ cuộc gọi. Các tư vấn viên hãy tiếp tục chăm sóc các cuộc hẹn học thử tiếp theo.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Mức độ SLA</th>
                  <th className="px-4 py-3">Phụ huynh &amp; Học viên</th>
                  <th className="px-4 py-3">Số điện thoại</th>
                  <th className="px-4 py-3">Khóa học quan tâm</th>
                  <th className="px-4 py-3">Nguồn</th>
                  <th className="px-4 py-3">Thời gian chờ</th>
                  <th className="px-4 py-3">Nhân viên phụ trách</th>
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
                        isDanger
                          ? "bg-red-50/40"
                          : isWarning
                          ? "bg-amber-50/30"
                          : ""
                      }`}
                    >
                      {/* Cột 1: Cảnh báo SLA */}
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

                      {/* Cột 2: Phụ huynh & Học viên */}
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 text-sm">
                          {lead.full_name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {lead.students && lead.students.length > 0
                            ? lead.students[0].full_name
                            : "Chưa cập nhật thông tin bé"}
                        </div>
                      </td>

                      {/* Cột 3: Số điện thoại + nút sao chép */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                          <span>{lead.phone}</span>
                          <button
                            type="button"
                            onClick={() => copyPhoneNumber(lead.phone || "", lead.id)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-800 transition-colors"
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

                      {/* Cột 4: Khóa học quan tâm */}
                      <td className="px-4 py-3.5 font-semibold text-slate-800">
                        <span className="px-2.5 py-1 bg-rose-50 text-[#8B1D2C] rounded-lg border border-rose-100 text-xs">
                          {lead.interested_course_title}
                        </span>
                      </td>

                      {/* Cột 5: Nguồn */}
                      <td className="px-4 py-3.5 text-slate-600 capitalize">
                        {lead.source}
                      </td>

                      {/* Cột 6: Thời gian chờ */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`font-mono font-bold ${
                            isDanger
                              ? "text-red-700 text-sm"
                              : isWarning
                              ? "text-amber-700 font-semibold"
                              : "text-slate-600"
                          }`}
                        >
                          {lead.waiting_minutes} phút
                        </span>
                      </td>

                      {/* Cột 7: Nhân viên phụ trách */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
                            {lead.assigned_to_name ? lead.assigned_to_name[0] : "?"}
                          </div>
                          <span className="font-medium text-slate-800">
                            {lead.assigned_to_name || "Chưa giao"}
                          </span>
                        </div>
                      </td>

                      {/* Cột 8: Thao tác */}
                      <td className="px-4 py-3.5 text-right space-x-1.5">
                        {/* Nút Gọi & Xác nhận cuộc gọi */}
                        <button
                          type="button"
                          onClick={() => handleOpenCallModal(lead)}
                          className="px-3 py-1.5 bg-[#8B1D2C] hover:bg-[#721422] text-white rounded-xl font-bold shadow-xs transition-colors inline-flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          Xác nhận cuộc gọi
                        </button>

                        {/* Mở chi tiết */}
                        <a
                          href={`/customers/${lead.id}`}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg inline-flex items-center"
                          title="Mở hồ sơ chi tiết"
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

      {/* 4. 2-Column Grid: Công việc hôm nay & Nhật ký hoạt động */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột 1: Công việc hôm nay */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8B1D2C]" />
              <span>Công Việc Cần Xử Lý Hôm Nay</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
              4 nhiệm vụ
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-amber-50/60 border border-amber-200/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500 text-white rounded-lg">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Gọi lại cho Mẹ bé Tuệ Nhi
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Hẹn gọi lại lúc 15:30 trao đổi về học phí Model Kids
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 rounded-lg"
              >
                Gọi ngay
              </button>
            </div>

            <div className="p-3 bg-indigo-50/60 border border-indigo-200/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-lg">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Đón tiếp 2 phụ huynh đến học thử
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Sáng thứ Bảy (09:00) tại Cơ sở 1 T.A Academy
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="px-2.5 py-1 text-xs font-semibold text-indigo-800 bg-indigo-100 hover:bg-indigo-200 rounded-lg"
              >
                Xem danh sách
              </button>
            </div>

            <div className="p-3 bg-rose-50/60 border border-rose-200/60 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-600 text-white rounded-lg">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    AI vừa chuyển tiếp 1 hội thoại cần hỗ trợ
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Phụ huynh hỏi chính sách bảo lưu khóa Phong thái
                  </div>
                </div>
              </div>
              <a
                href="/inbox"
                className="px-2.5 py-1 text-xs font-semibold text-rose-800 bg-rose-100 hover:bg-rose-200 rounded-lg"
              >
                Tiếp quản chat
              </a>
            </div>
          </div>
        </div>

        {/* Cột 2: Báo cáo nhanh tỷ lệ tuyển sinh */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Hiệu Quả Tuyển Sinh Tháng Này</span>
            </h3>
            <a
              href="/reports"
              className="text-xs font-semibold text-[#8B1D2C] hover:underline flex items-center gap-0.5"
            >
              Xem báo cáo chi tiết →
            </a>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Khóa Model Kids (Mẫu nhí)</span>
                <span className="text-slate-900">68 học viên (48%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#8B1D2C] h-2 rounded-full w-[48%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Khóa Phong Thái Quý Cô &amp; Doanh Nhân</span>
                <span className="text-slate-900">42 học viên (30%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-[#D4AF37] h-2 rounded-full w-[30%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Khóa Catwalk Chuyên Nghiệp</span>
                <span className="text-slate-900">22 học viên (15%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-600 h-2 rounded-full w-[15%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-600">Khóa Giao Tiếp - Thuyết Trình</span>
                <span className="text-slate-900">13 học viên (7%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full w-[7%]" />
              </div>
            </div>
          </div>
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
