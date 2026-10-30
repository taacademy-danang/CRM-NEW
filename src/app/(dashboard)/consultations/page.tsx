"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CallLogModal from "@/components/dashboard/CallLogModal";
import {
  Users,
  Search,
  Plus,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  X,
  UserPlus,
  GraduationCap,
  Bot,
  RefreshCw,
  Check,
} from "lucide-react";
import { Customer } from "@/types/crm";

export interface CustomerConsultationRow {
  stt: number;
  id: string;
  customerName: string;
  phone: string | null;
  phoneAutoExtracted: boolean;
  courseRef: "model_kids" | "phong_thai" | "catwalk" | "giao_tiep";
  courseRefLabel: string;
  aiExtractedNeed: string;
  careStatus: "consulting" | "called" | "uncalled" | "trial_scheduled" | "registered" | "lost";
  elearningStatus: "synced" | "pending" | "not_enrolled";
  elearningClass?: string;
  receivedAt: string;
  source?: string;
}

export default function ConsultationCustomerManagementPage() {
  const [data, setData] = useState<CustomerConsultationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal tiếp nhận khách mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCourse, setNewCourse] = useState<"model_kids" | "phong_thai" | "catwalk" | "giao_tiep">("model_kids");
  const [newNeed, setNewNeed] = useState("");

  // Modal Call Log
  const [selectedCustomerForCall, setSelectedCustomerForCall] = useState<Customer | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (filterCourse !== "all") params.set("course", filterCourse);
      if (filterStatus !== "all") params.set("status", filterStatus);

      const res = await fetch(`/api/consultations?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      }
    } catch (err) {
      console.error("Lỗi tải danh sách tư vấn:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [filterCourse, filterStatus]);

  // Đổi trạng thái chăm sóc trực tiếp trên bảng
  const handleStatusChange = async (id: string, newStatus: CustomerConsultationRow["careStatus"]) => {
    try {
      const res = await fetch("/api/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, careStatus: newStatus }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Lỗi cập nhật trạng thái");
      }

      setData((prev) =>
        prev.map((row) => (row.id === id ? { ...row, ...json.data } : row))
      );

      if (newStatus === "registered") {
        showToast("Đã đồng bộ sang E-learning & Tự động xếp lớp cho học viên!");
      } else {
        showToast("Đã cập nhật tình trạng chăm sóc thành công");
      }
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra");
    }
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: newName.trim(),
          phone: newPhone.trim() ? newPhone.trim() : null,
          courseRef: newCourse,
          aiExtractedNeed: newNeed.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Lỗi tạo hồ sơ tư vấn");
      }

      setData([json.data, ...data]);
      setIsAddModalOpen(false);
      setNewName("");
      setNewPhone("");
      setNewNeed("");
      showToast("Đã tiếp nhận hồ sơ khách hàng tư vấn mới thành công!");
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra");
    }
  };

  const handleOpenCall = (row: CustomerConsultationRow) => {
    setSelectedCustomerForCall({
      id: row.id,
      customer_code: `KH-${row.stt}`,
      full_name: row.customerName,
      phone: row.phone,
      source: "facebook",
      status: "consulting",
      call_status: "pending",
      first_phone_received_at: new Date().toISOString(),
      sla_alert_level: "none",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsCallModalOpen(true);
  };

  const handleCallSuccess = (updated: Customer) => {
    handleStatusChange(updated.id, "called");
  };

  const filteredData = data.filter((row) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      row.customerName.toLowerCase().includes(q) ||
      (row.phone && row.phone.includes(q)) ||
      row.aiExtractedNeed.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#DC2626] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: "Tổng quan", href: "/" }, { label: "Quản lý khách hàng tư vấn" }]} />
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#DC2626]" />
            <span>QUẢN LÝ KHÁCH HÀNG TƯ VẤN</span>
          </h1>
          <p className="text-xs text-slate-500">
            Theo dõi hành trình tư vấn: Tự động cập nhật SĐT, AI phân tích nhu cầu từ tin nhắn, quản lý chăm sóc và tự động đồng bộ sang E-learning xếp lớp khi đã đăng ký.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchConsultations}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs"
            title="Làm mới"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tiếp Nhận Khách Hàng Mới
          </button>
        </div>
      </div>

      {/* 2. Thanh Lọc Dropdowns & Tìm Kiếm */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên khách, SĐT, nhu cầu..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
            />
          </div>

          {/* Dropdown Khóa học tham khảo */}
          <div className="relative">
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
            >
              <option value="all">Tất cả khóa học</option>
              <option value="model_kids">Model Kids</option>
              <option value="phong_thai">Phong Thái</option>
              <option value="catwalk">Catwalk</option>
              <option value="giao_tiep">Giao Tiếp</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Dropdown Tình trạng chăm sóc */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
            >
              <option value="all">Tất cả tình trạng</option>
              <option value="consulting">Đang tư vấn</option>
              <option value="called">Đã gọi tư vấn</option>
              <option value="uncalled">Chưa gọi (Cần liên hệ)</option>
              <option value="trial_scheduled">Hẹn học thử</option>
              <option value="registered">Đã đăng ký (E-learning)</option>
              <option value="lost">Không tiếp tục</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <span className="font-bold text-[#DC2626]">
          Tổng cộng: {filteredData.length} khách hàng
        </span>
      </div>

      {/* 3. BẢNG CHUẨN: STT - KHÁCH HÀNG - SDT - KHÓA HỌC THAM KHẢO - NHU CẦU - TÌNH TRẠNG CHĂM SÓC - ELEARNING */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-3 py-3 text-center w-12">STT</th>
                <th className="px-4 py-3">Khách hàng</th>
                <th className="px-4 py-3">Số điện thoại (Tự động cập nhật)</th>
                <th className="px-4 py-3">Khóa học tham khảo</th>
                <th className="px-5 py-3 min-w-[280px]">Nhu cầu (AI tự động trích xuất từ chat)</th>
                <th className="px-4 py-3">Tình trạng chăm sóc</th>
                <th className="px-4 py-3">E-Learning (Xếp lớp tự động)</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Không tìm thấy khách hàng tư vấn nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* CỘT 1: STT */}
                    <td className="px-3 py-4 text-center font-bold text-slate-500">
                      {index + 1}
                    </td>

                    {/* CỘT 2: KHÁCH HÀNG */}
                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {row.customerName}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Tiếp nhận: {row.receivedAt}
                      </span>
                    </td>

                    {/* CỘT 3: SDT (TỰ ĐỘNG CẬP NHẬT TRONG QUÁ TRÌNH TƯ VẤN) */}
                    <td className="px-4 py-4">
                      {row.phone ? (
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-slate-900 text-sm block">
                            {row.phone}
                          </span>
                          {row.phoneAutoExtracted ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                              AI tự động lưu từ chat
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-400">Đã xác thực</span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          AI đang xin số...
                        </span>
                      )}
                    </td>

                    {/* CỘT 4: KHÓA HỌC THAM KHẢO */}
                    <td className="px-4 py-4">
                      <span className="px-2.5 py-1 bg-red-50 text-[#DC2626] font-bold rounded-lg border border-red-100 text-xs inline-block">
                        {row.courseRefLabel}
                      </span>
                    </td>

                    {/* CỘT 5: NHU CẦU (TỰ ĐỘNG XÁC ĐỊNH TỪ ĐOẠN TIN NHẮN) */}
                    <td className="px-5 py-4">
                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#DC2626]">
                          <Bot className="w-3 h-3 text-[#DC2626]" />
                          <span>AI Nhận Diện Nhu Cầu:</span>
                        </div>
                        <p className="text-slate-800 leading-relaxed font-medium">
                          "{row.aiExtractedNeed}"
                        </p>
                      </div>
                    </td>

                    {/* CỘT 6: TÌNH TRẠNG CHĂM SÓC */}
                    <td className="px-4 py-4">
                      <select
                        value={row.careStatus}
                        onChange={(e) => handleStatusChange(row.id, e.target.value as any)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          row.careStatus === "registered"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-300"
                            : row.careStatus === "trial_scheduled"
                            ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                            : row.careStatus === "uncalled"
                            ? "bg-red-50 text-[#DC2626] border-red-200 font-black animate-pulse"
                            : "bg-white text-slate-800 border-slate-200"
                        }`}
                      >
                        <option value="consulting">Đang tư vấn</option>
                        <option value="called">Đã gọi tư vấn</option>
                        <option value="uncalled">Chưa gọi (Cần liên hệ)</option>
                        <option value="trial_scheduled">Hẹn học thử</option>
                        <option value="registered">Đã đăng ký</option>
                        <option value="lost">Không tiếp tục</option>
                      </select>
                    </td>

                    {/* CỘT 7: ELEARNING (TỰ ĐỘNG CHUYỂN KHI ĐÃ ĐĂNG KÝ) */}
                    <td className="px-4 py-4">
                      {row.elearningStatus === "synced" ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Đã chuyển E-learning
                          </span>
                          <div className="text-[10px] text-slate-600 font-semibold flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-emerald-700" />
                            <span>{row.elearningClass || "Chờ xếp lớp K26"}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-400 text-[11px]">
                          <span>Chưa chuyển</span>
                          <div className="text-[10px] text-slate-400">
                            (Tự động chuyển khi Đã đăng ký)
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="px-4 py-4 text-right space-x-1.5">
                      {row.phone && (
                        <button
                          type="button"
                          onClick={() => handleOpenCall(row)}
                          className="px-2.5 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-2xs"
                          title="Gọi tư vấn"
                        >
                          <Phone className="w-3 h-3" /> Gọi
                        </button>
                      )}
                      <a
                        href="/inbox"
                        className="p-1.5 text-slate-500 hover:text-[#DC2626] hover:bg-red-50 rounded-lg inline-flex items-center"
                        title="Mở chat tư vấn"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tiếp Nhận Khách Hàng */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">
                  Tiếp Nhận Khách Hàng Tư Vấn Mới
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tên khách hàng / Phụ huynh <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nguyễn Thu Trang"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Số điện thoại (nếu có)</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="0988xxxxxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Khóa học tham khảo</label>
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                >
                  <option value="model_kids">Model Kids (Mẫu Nhí Tài Năng)</option>
                  <option value="phong_thai">Phong Thái Quý Cô &amp; Doanh Nhân</option>
                  <option value="catwalk">Catwalk Chuyên Nghiệp</option>
                  <option value="giao_tiep">Nghệ Thuật Giao Tiếp &amp; Thuyết Trình</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nhu cầu học viên ban đầu</label>
                <textarea
                  rows={3}
                  value={newNeed}
                  onChange={(e) => setNewNeed(e.target.value)}
                  placeholder="Ví dụ: Bé 6 tuổi tính tình rụt rè, đi gù lưng, muốn tham gia lớp trải nghiệm cuối tuần..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-xl shadow-md"
                >
                  Lưu Khách Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Xác nhận cuộc gọi */}
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
