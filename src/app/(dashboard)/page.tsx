"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CallLogModal from "@/components/dashboard/CallLogModal";
import ReassignModal from "@/components/dashboard/ReassignModal";
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
  ExternalLink,
  UserCheck,
  RefreshCw,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const [uncalledLeads, setUncalledLeads] = useState<Customer[]>([]);
  const [stats, setStats] = useState({
    total_customers: 1280,
    new_today: 42,
    uncalled_count: 3,
    consulting_count: 96,
    need_care_count: 34,
    registered_count: 145,
  });
  const [loading, setLoading] = useState(true);
  const [selectedCustomerForCall, setSelectedCustomerForCall] = useState<Customer | null>(null);
  const [selectedCustomerForReassign, setSelectedCustomerForReassign] = useState<Customer | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [leadsRes, statsRes] = await Promise.all([
        fetch("/api/dashboard/uncalled-leads"),
        fetch("/api/dashboard/stats"),
      ]);

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json();
        if (leadsData.success) {
          setUncalledLeads(leadsData.data);
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCallSuccess = (updatedCustomer: Customer) => {
    setUncalledLeads((prev) => prev.filter((c) => c.id !== updatedCustomer.id));
    setStats((prev) => ({
      ...prev,
      uncalled_count: Math.max(0, prev.uncalled_count - 1),
      consulting_count: prev.consulting_count + 1,
    }));
    showToast(`Đã lưu cuộc gọi thành công cho khách hàng ${updatedCustomer.full_name}`);
  };

  const handleReassignSuccess = (updatedCustomer: Customer) => {
    setUncalledLeads((prev) =>
      prev.map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
    );
    showToast(`Đã chuyển khách hàng cho tư vấn viên ${updatedCustomer.assigned_to_name}`);
  };

  const copyPhoneNumber = (phone: string, id: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#DC2626] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

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
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 shadow-xs transition-colors"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-600 ${loading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
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
          <div className="text-2xl font-extrabold text-slate-900">{stats.total_customers}</div>
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
          <div className="text-2xl font-extrabold text-[#DC2626]">{stats.new_today}</div>
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
          <div className="text-2xl font-extrabold text-purple-700">{stats.consulting_count}</div>
          <div className="text-[11px] text-slate-500 mt-1">Theo dõi chuyên sâu</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Hẹn học thử</span>
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-indigo-700">{stats.need_care_count}</div>
          <div className="text-[11px] text-slate-500 mt-1">Lịch học tuần này</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium text-slate-600">Đã chốt đăng ký</span>
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700">{stats.registered_count}</div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1">Đồng bộ E-learning</div>
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
                  const isWarning =
                    lead.waiting_minutes && lead.waiting_minutes >= 15 && lead.waiting_minutes < 60;

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

                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <span>{lead.assigned_to_name || "Chưa giao"}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCustomerForReassign(lead);
                              setIsReassignModalOpen(true);
                            }}
                            className="p-1 text-slate-400 hover:text-[#DC2626] hover:bg-red-50 rounded"
                            title="Chuyển nhân viên"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3.5 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCustomerForCall(lead);
                            setIsCallModalOpen(true);
                          }}
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

      {/* 4. Hai Cột: Công việc hôm nay & Nhật ký hoạt động */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Công việc hôm nay */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#DC2626]" />
              Công Việc Cần Xử Lý Hôm Nay
            </h3>
            <span className="text-[11px] font-semibold text-slate-500">6 đầu việc</span>
          </div>

          <div className="space-y-2.5">
            {[
              {
                title: "Gọi lại cho phụ huynh bé Hoàng Kiều Trinh (Hẹn 15:30)",
                type: "call",
                urgent: true,
                course: "Catwalk",
              },
              {
                title: "Chăm sóc 3 phụ huynh lớp Model Kids sau buổi học thử hôm qua",
                type: "care",
                urgent: false,
                course: "Model Kids",
              },
              {
                title: "Kiểm tra danh sách 5 học viên đã đăng ký đã xếp lớp E-learning K26",
                type: "elearning",
                urgent: false,
                course: "Phong Thái",
              },
              {
                title: "Xử lý 2 hội thoại AI vừa yêu cầu chuyển nhân viên tư vấn",
                type: "ai_transfer",
                urgent: true,
                course: "Đa khóa học",
              },
            ].map((task, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 hover:bg-red-50/30 rounded-xl border border-slate-200/80 flex items-center justify-between gap-3 text-xs transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{task.title}</span>
                    {task.urgent && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-bold">
                        Gấp
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">Khóa học: {task.course}</span>
                </div>
                <a
                  href="/consultations"
                  className="p-1.5 text-slate-400 hover:text-[#DC2626] rounded"
                >
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Nhật ký hoạt động hệ thống */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#DC2626]" />
              Nhật Ký Tiếp Nhận &amp; Hoạt Động Mới Nhất
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Trực tuyến
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                time: "14:32",
                actor: "AI An An",
                action: "Tự động trích xuất và cập nhật SĐT khách hàng: 0988123456",
                type: "ai",
              },
              {
                time: "14:28",
                actor: "Trần Văn Bình",
                action: "Xác nhận cuộc gọi tư vấn thành công với phụ huynh Nguyễn Hoàng Nam (3m 45s)",
                type: "human",
              },
              {
                time: "14:15",
                actor: "Hệ thống",
                action: "Tự động đồng bộ học viên Vũ Mai Phương sang E-learning lớp Phong Thái K26",
                type: "system",
              },
              {
                time: "13:50",
                actor: "Nguyễn Thị Lan",
                action: "Bàn giao hồ sơ khách hàng Hoàng Kiều Trinh cho nhân viên Lê Minh Trang",
                type: "human",
              },
            ].map((log, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="font-mono text-slate-400 text-[11px] shrink-0 pt-0.5">
                  {log.time}
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                        log.type === "ai"
                          ? "bg-purple-100 text-purple-700"
                          : log.type === "system"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-[#DC2626]"
                      }`}
                    >
                      {log.actor}
                    </span>
                  </div>
                  <p className="text-slate-700 text-xs">{log.action}</p>
                </div>
              </div>
            ))}
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

      {/* Modal chuyển nhân viên phụ trách */}
      <ReassignModal
        customer={selectedCustomerForReassign}
        isOpen={isReassignModalOpen}
        onClose={() => {
          setIsReassignModalOpen(false);
          setSelectedCustomerForReassign(null);
        }}
        onSuccess={handleReassignSuccess}
      />
    </div>
  );
}
