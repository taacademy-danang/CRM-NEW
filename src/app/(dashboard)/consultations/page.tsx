"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CallLogModal from "@/components/dashboard/CallLogModal";
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  X,
  UserPlus,
} from "lucide-react";
import { COURSE_OPTIONS, SOURCE_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import { Customer } from "@/types/crm";

interface ConsultationLead {
  id: string;
  leadCode: string;
  contactName: string;
  phone: string;
  courseId: string;
  courseName: string;
  sourceId: string;
  sourceName: string;
  statusId: string;
  statusName: string;
  assignedTo: string;
  waitingMinutes?: number;
  notes: string;
  receivedAt: string;
}

const mockLeads: ConsultationLead[] = [
  {
    id: "lead-01",
    leadCode: "TV-2026-001",
    contactName: "Phạm Thu Hương",
    phone: "0988123456",
    courseId: "model_kids",
    courseName: "Model Kids (Mẫu Nhí Tài Năng)",
    sourceId: "facebook",
    sourceName: "Facebook Fanpage",
    statusId: "uncalled",
    statusName: "Chưa gọi (SLA)",
    assignedTo: "Trần Văn Bình",
    waitingMinutes: 65,
    notes: "Bé 7 tuổi nhút nhát, mẹ muốn rèn dáng đi tự tin và sửa lưng gù",
    receivedAt: "Hôm nay 14:10",
  },
  {
    id: "lead-02",
    leadCode: "TV-2026-002",
    contactName: "Nguyễn Hoàng Nam",
    phone: "0912345888",
    courseId: "phong_thai_doanh_nhan",
    courseName: "Phong Thái Doanh Nhân",
    sourceId: "zalo",
    sourceName: "Zalo Official Account",
    statusId: "consulting",
    statusName: "Đang tư vấn",
    assignedTo: "Lê Minh Trang",
    waitingMinutes: 20,
    notes: "Cần lịch học linh hoạt vào các buổi tối trong tuần",
    receivedAt: "Hôm nay 13:45",
  },
  {
    id: "lead-03",
    leadCode: "TV-2026-003",
    contactName: "Hoàng Kiều Trinh",
    phone: "0909555666",
    courseId: "catwalk_pro",
    courseName: "Catwalk Chuyên Nghiệp",
    sourceId: "facebook",
    sourceName: "Facebook Fanpage",
    statusId: "trial_scheduled",
    statusName: "Hẹn học thử",
    assignedTo: "Trần Văn Bình",
    notes: "Hẹn 09:00 sáng thứ 7 tuần này tham gia buổi học trải nghiệm",
    receivedAt: "Hôm nay 10:15",
  },
  {
    id: "lead-04",
    leadCode: "TV-2026-004",
    contactName: "Vũ Mai Phương",
    phone: "0934888999",
    courseId: "phong_thai_quy_co",
    courseName: "Phong Thái Quý Cô",
    sourceId: "hotline",
    sourceName: "Hotline Trực Tiếp",
    statusId: "registered",
    statusName: "Đã chốt đăng ký",
    assignedTo: "Nguyễn Thị Lan",
    notes: "Đã thanh toán học phí khóa Phong thái K26",
    receivedAt: "Hôm qua 16:30",
  },
];

export default function ConsultationsPage() {
  const [leads, setLeads] = useState<ConsultationLead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedSource, setSelectedSource] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Modal thêm yêu cầu tư vấn mới
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newContactName, setNewContactName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCourse, setNewCourse] = useState("model_kids");
  const [newSource, setNewSource] = useState("facebook");
  const [newStatus, setNewStatus] = useState("new");
  const [newAssigned, setNewAssigned] = useState("Trần Văn Bình");
  const [newNotes, setNewNotes] = useState("");

  // Modal xác nhận cuộc gọi
  const [selectedCustomerForCall, setSelectedCustomerForCall] = useState<Customer | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  // Lọc theo các thanh dropdown
  const filteredLeads = leads.filter((item) => {
    const matchSearch =
      item.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      item.leadCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchCourse = selectedCourse === "all" || item.courseId === selectedCourse;
    const matchSource = selectedSource === "all" || item.sourceId === selectedSource;
    const matchStatus = selectedStatus === "all" || item.statusId === selectedStatus;

    return matchSearch && matchCourse && matchSource && matchStatus;
  });

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newPhone.trim()) return;

    const courseObj = COURSE_OPTIONS.find((c) => c.id === newCourse);
    const sourceObj = SOURCE_OPTIONS.find((s) => s.id === newSource);
    const statusObj = STATUS_OPTIONS.find((st) => st.id === newStatus);

    const created: ConsultationLead = {
      id: `lead-${Date.now()}`,
      leadCode: `TV-2026-${String(leads.length + 1).padStart(3, "0")}`,
      contactName: newContactName,
      phone: newPhone,
      courseId: newCourse,
      courseName: courseObj ? courseObj.label : "Khóa học",
      sourceId: newSource,
      sourceName: sourceObj ? sourceObj.label : "Facebook",
      statusId: newStatus,
      statusName: statusObj ? statusObj.label : "Khách mới",
      assignedTo: newAssigned,
      notes: newNotes,
      receivedAt: "Vừa xong",
    };

    setLeads([created, ...leads]);
    setIsAddModalOpen(false);
    // Reset form
    setNewContactName("");
    setNewPhone("");
    setNewNotes("");
  };

  const handleOpenCallModal = (lead: ConsultationLead) => {
    setSelectedCustomerForCall({
      id: lead.id,
      customer_code: lead.leadCode,
      full_name: lead.contactName,
      phone: lead.phone,
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

  const handleCallSuccess = (updatedCustomer: Customer) => {
    setLeads((prev) =>
      prev.map((item) =>
        item.id === updatedCustomer.id
          ? {
              ...item,
              statusId: "consulting",
              statusName: "Đang tư vấn (Đã gọi)",
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: "Tổng quan", href: "/" }, { label: "Tiếp nhận tư vấn" }]} />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-[#DC2626]" />
            <span>Tiếp Nhận &amp; Quản Lý Tư Vấn Tuyển Sinh</span>
          </h1>
          <p className="text-xs text-slate-500">
            Tập trung chuyên sâu cho công tác tiếp nhận khách hàng, gọi điện xác nhận và chăm sóc tư vấn các khóa học T.A Academy.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tiếp Nhận Yêu Cầu Tư Vấn Mới
        </button>
      </div>

      {/* 2. Thanh lọc ĐẦY ĐỦ THANH ĐỔ XUỐNG (DROPDOWNS): Khóa học quan tâm, Nguồn, Trạng thái */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-[#DC2626]" /> Bộ lọc tìm kiếm &amp; phân loại tư vấn
          </span>
          <span className="text-xs font-bold text-[#DC2626]">
            Tìm thấy {filteredLeads.length} yêu cầu tư vấn
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Ô tìm kiếm text */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên khách, số điện thoại..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
            />
          </div>

          {/* Thanh đổ xuống 1: KHÓA HỌC QUAN TÂM */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Khóa học quan tâm
            </label>
            <div className="relative">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 pr-8"
              >
                {COURSE_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Thanh đổ xuống 2: NGUỒN TIẾP NHẬN */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Nguồn tiếp nhận
            </label>
            <div className="relative">
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 pr-8"
              >
                {SOURCE_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Thanh đổ xuống 3: TRẠNG THÁI TƯ VẤN */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Trạng thái tư vấn
            </label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 pr-8"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bảng Danh Sách Tiếp Nhận Tư Vấn */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Mã tư vấn</th>
              <th className="px-4 py-3">Khách hàng liên hệ</th>
              <th className="px-4 py-3">Số điện thoại</th>
              <th className="px-4 py-3">Khóa học quan tâm</th>
              <th className="px-4 py-3">Nguồn tiếp nhận</th>
              <th className="px-4 py-3">Trạng thái tư vấn</th>
              <th className="px-4 py-3">Tư vấn viên phụ trách</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLeads.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 font-mono font-bold text-slate-800">
                  {item.leadCode}
                </td>

                <td className="px-4 py-3">
                  <div className="font-bold text-slate-900 text-sm">
                    {item.contactName}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                    {item.notes}
                  </div>
                </td>

                <td className="px-4 py-3 font-mono font-bold text-slate-800">
                  {item.phone}
                </td>

                <td className="px-4 py-3">
                  <span className="px-2.5 py-1 bg-red-50 text-[#DC2626] font-bold rounded-lg border border-red-100">
                    {item.courseName}
                  </span>
                </td>

                <td className="px-4 py-3 font-medium text-slate-600">
                  {item.sourceName}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      item.statusId === "uncalled"
                        ? "bg-red-100 text-red-800 animate-pulse border border-red-200"
                        : item.statusId === "trial_scheduled"
                        ? "bg-indigo-50 text-indigo-800 border border-indigo-200"
                        : item.statusId === "registered"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {item.statusName}
                  </span>
                </td>

                <td className="px-4 py-3 font-semibold text-slate-800">
                  {item.assignedTo}
                </td>

                <td className="px-4 py-3 text-right space-x-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenCallModal(item)}
                    className="px-3 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" /> Gọi tư vấn
                  </button>

                  <a
                    href="/inbox"
                    className="p-1.5 text-slate-500 hover:text-[#DC2626] hover:bg-red-50 rounded-lg inline-flex items-center"
                    title="Mở chat tư vấn"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tiếp Nhận Tư Vấn Mới */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">
                  Tiếp Nhận Yêu Cầu Tư Vấn Mới
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

            <form onSubmit={handleCreateLead} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Họ và tên khách <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    placeholder="Nguyễn Thị Mai"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="0988xxxxxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Dropdowns */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Khóa học quan tâm</label>
                  <select
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    {COURSE_OPTIONS.filter((c) => c.id !== "all").map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nguồn tiếp nhận</label>
                  <select
                    value={newSource}
                    onChange={(e) => setNewSource(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    {SOURCE_OPTIONS.filter((s) => s.id !== "all").map((s) => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Trạng thái ban đầu</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    {STATUS_OPTIONS.filter((st) => st.id !== "all").map((st) => (
                      <option key={st.id} value={st.id}>{st.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tư vấn viên phụ trách</label>
                  <select
                    value={newAssigned}
                    onChange={(e) => setNewAssigned(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Trần Văn Bình">Trần Văn Bình</option>
                    <option value="Lê Minh Trang">Lê Minh Trang</option>
                    <option value="Nguyễn Thị Lan">Nguyễn Thị Lan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ghi chú nhu cầu tư vấn</label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ghi chú về độ tuổi, mong muốn của khách, thời gian học dự kiến..."
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
                  Lưu &amp; Tiếp Nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Call Log Modal */}
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
