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
  Edit2,
  Trash2,
  Calendar,
  Layers,
  Award,
} from "lucide-react";
import { Customer } from "@/types/crm";
import {
  CustomerConsultationRow,
  CenterStudent,
  COURSE_CATALOG_MAP,
} from "@/lib/services/consultationService";

export default function CustomerManagementPage() {
  const [activeTab, setActiveTab] = useState<"consulting" | "center">("consulting");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- TAB 1: KHÁCH HÀNG ĐANG TƯ VẤN ---
  const [consultingList, setConsultingList] = useState<CustomerConsultationRow[]>([]);
  const [loadingConsulting, setLoadingConsulting] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal Tiếp nhận khách hàng tư vấn mới
  const [isAddConsultingModalOpen, setIsAddConsultingModalOpen] = useState(false);
  const [newConsultingName, setNewConsultingName] = useState("");
  const [newConsultingPhone, setNewConsultingPhone] = useState("");
  const [newConsultingDob, setNewConsultingDob] = useState("");
  const [newConsultingCourse, setNewConsultingCourse] = useState<CustomerConsultationRow["courseRef"]>("model_kids");
  const [newConsultingNeed, setNewConsultingNeed] = useState("");

  // Modal Sửa khách hàng tư vấn
  const [isEditConsultingModalOpen, setIsEditConsultingModalOpen] = useState(false);
  const [editingConsulting, setEditingConsulting] = useState<CustomerConsultationRow | null>(null);

  // Modal Call Log
  const [selectedCustomerForCall, setSelectedCustomerForCall] = useState<Customer | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  // --- TAB 2: KHÁCH HÀNG TRUNG TÂM (HỌC VIÊN CHÍNH THỨC) ---
  const [studentsList, setStudentsList] = useState<CenterStudent[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [searchStudent, setSearchStudent] = useState("");

  // Modal Thêm học viên trung tâm
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");
  const [newStudentDob, setNewStudentDob] = useState("");
  const [newStudentCourseCode, setNewStudentCourseCode] = useState("MK-01");
  const [newStudentSessions, setNewStudentSessions] = useState(12);
  const [newStudentNotes, setNewStudentNotes] = useState("");

  // Modal Sửa học viên trung tâm
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<CenterStudent | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Fetch danh sách khách hàng đang tư vấn
  const fetchConsultations = async () => {
    try {
      setLoadingConsulting(true);
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (filterCourse !== "all") params.set("course", filterCourse);
      if (filterStatus !== "all") params.set("status", filterStatus);

      const res = await fetch(`/api/consultations?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setConsultingList(json.data);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách tư vấn:", err);
    } finally {
      setLoadingConsulting(false);
    }
  };

  // 2. Fetch danh sách khách hàng trung tâm
  const fetchCenterStudents = async () => {
    try {
      setLoadingStudents(true);
      const params = new URLSearchParams();
      if (searchStudent) params.set("search", searchStudent);

      const res = await fetch(`/api/center-students?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) setStudentsList(json.data);
      }
    } catch (err) {
      console.error("Lỗi tải học viên trung tâm:", err);
    } finally {
      setLoadingStudents(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, [filterCourse, filterStatus]);

  useEffect(() => {
    fetchCenterStudents();
  }, [searchStudent]);

  // --- ACTIONS CHO KHÁCH HÀNG ĐANG TƯ VẤN ---
  const handleStatusChange = async (id: string, newStatus: CustomerConsultationRow["careStatus"]) => {
    try {
      const res = await fetch("/api/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, careStatus: newStatus }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      setConsultingList((prev) =>
        prev.map((row) => (row.id === id ? { ...row, ...json.data } : row))
      );

      // Nếu chuyển thành registered -> Tự động chuyển qua Khách hàng trung tâm & refresh tab trung tâm
      if (newStatus === "registered") {
        fetchCenterStudents();
        showToast("Khách hàng đã chuyển trạng thái 'Đã đăng ký' & Tự động chuyển qua 'Khách Hàng Trung Tâm'!");
      } else {
        showToast("Đã cập nhật tình trạng chăm sóc thành công!");
      }
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra");
    }
  };

  const handleCreateConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConsultingName.trim()) return;

    try {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: newConsultingName.trim(),
          phone: newConsultingPhone.trim() ? newConsultingPhone.trim() : null,
          courseRef: newConsultingCourse,
          aiExtractedNeed: newConsultingNeed.trim() || undefined,
          dob: newConsultingDob.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      setConsultingList([json.data, ...consultingList]);
      setIsAddConsultingModalOpen(false);
      setNewConsultingName("");
      setNewConsultingPhone("");
      setNewConsultingDob("");
      setNewConsultingNeed("");
      showToast("Đã tiếp nhận khách hàng tư vấn mới thành công!");
    } catch (err: any) {
      alert(err.message || "Lỗi tạo hồ sơ tư vấn");
    }
  };

  const handleOpenEditConsulting = (row: CustomerConsultationRow) => {
    setEditingConsulting({ ...row });
    setIsEditConsultingModalOpen(true);
  };

  const handleSaveEditConsulting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingConsulting) return;

    try {
      const res = await fetch("/api/consultations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingConsulting.id,
          customerName: editingConsulting.customerName,
          phone: editingConsulting.phone,
          courseRef: editingConsulting.courseRef,
          aiExtractedNeed: editingConsulting.aiExtractedNeed,
          careStatus: editingConsulting.careStatus,
          dob: editingConsulting.dob,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      setConsultingList((prev) =>
        prev.map((c) => (c.id === editingConsulting.id ? json.data : c))
      );
      if (editingConsulting.careStatus === "registered") {
        fetchCenterStudents();
      }
      setIsEditConsultingModalOpen(false);
      showToast("Đã cập nhật thông tin khách hàng tư vấn thành công!");
    } catch (err: any) {
      alert(err.message || "Lỗi cập nhật khách hàng");
    }
  };

  const handleDeleteConsulting = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khách hàng "${name}" khỏi danh sách tư vấn?`)) return;
    try {
      const res = await fetch(`/api/consultations?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      setConsultingList(consultingList.filter((c) => c.id !== id));
      showToast(`Đã xóa khách hàng "${name}" thành công!`);
    } catch (err: any) {
      alert(err.message || "Lỗi xóa khách hàng");
    }
  };

  // --- ACTIONS CHO KHÁCH HÀNG TRUNG TÂM ---
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentPhone.trim()) return;

    try {
      const res = await fetch("/api/center-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: newStudentName.trim(),
          phone: newStudentPhone.trim(),
          dob: newStudentDob.trim() || "15/06/2018",
          courseCode: newStudentCourseCode,
          sessions: Number(newStudentSessions),
          notes: newStudentNotes.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      setStudentsList([json.data, ...studentsList]);
      setIsAddStudentModalOpen(false);
      setNewStudentName("");
      setNewStudentPhone("");
      setNewStudentDob("");
      setNewStudentNotes("");
      showToast(`Đã thêm học viên trung tâm "${json.data.fullName}" (${json.data.studentCode})!`);
    } catch (err: any) {
      alert(err.message || "Lỗi thêm học viên");
    }
  };

  const handleOpenEditStudent = (s: CenterStudent) => {
    setEditingStudent({ ...s });
    setIsEditStudentModalOpen(true);
  };

  const handleSaveEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    try {
      const res = await fetch("/api/center-students", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingStudent.id,
          fullName: editingStudent.fullName,
          phone: editingStudent.phone,
          dob: editingStudent.dob,
          courseCode: editingStudent.courseCode,
          sessions: Number(editingStudent.sessions),
          notes: editingStudent.notes,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      setStudentsList((prev) =>
        prev.map((s) => (s.id === editingStudent.id ? json.data : s))
      );
      setIsEditStudentModalOpen(false);
      showToast(`Đã cập nhật học viên "${json.data.fullName}" (${json.data.studentCode})!`);
    } catch (err: any) {
      alert(err.message || "Lỗi cập nhật học viên");
    }
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa học viên "${name}" khỏi danh sách khách hàng trung tâm?`)) return;
    try {
      const res = await fetch(`/api/center-students?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      setStudentsList(studentsList.filter((s) => s.id !== id));
      showToast(`Đã xóa học viên "${name}" thành công!`);
    } catch (err: any) {
      alert(err.message || "Lỗi xóa học viên");
    }
  };

  // Call modal handler
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
          <Breadcrumb items={[{ label: "Tổng quan", href: "/" }, { label: "Quản lý khách hàng" }]} />
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-[#DC2626]" />
            <span>QUẢN LÝ KHÁCH HÀNG</span>
          </h1>
          <p className="text-xs text-slate-500">
            Hệ thống quản lý 2 giai đoạn: Khách hàng đang tư vấn từ Fanpage và Khách hàng trung tâm (học viên chính thức đã cấp E-learning).
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "consulting" ? (
            <button
              type="button"
              onClick={() => setIsAddConsultingModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Tiếp Nhận Khách Hàng Mới
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsAddStudentModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Thêm Học Viên Trung Tâm
            </button>
          )}
        </div>
      </div>

      {/* 2. Hai Ô Nhỏ Chuyển Qua Lại (Tabs Toggle) */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-2 max-w-xl border border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("consulting")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === "consulting"
              ? "bg-[#DC2626] text-white shadow-md shadow-red-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>KHÁCH HÀNG ĐANG TƯ VẤN ({consultingList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("center")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === "center"
              ? "bg-[#DC2626] text-white shadow-md shadow-red-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>KHÁCH HÀNG TRUNG TÂM ({studentsList.length})</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: KHÁCH HÀNG ĐANG TƯ VẤN (TỪ FANPAGE ĐỔ VỀ)         */}
      {/* ========================================================= */}
      {activeTab === "consulting" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Thanh lọc */}
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
                  <option value="registered">Đã đăng ký (Chuyển E-learning)</option>
                  <option value="lost">Không tiếp tục</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-3 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <button
              type="button"
              onClick={fetchConsultations}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingConsulting ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </button>
          </div>

          {/* BẢNG KHÁCH HÀNG ĐANG TƯ VẤN (Có nút Sửa & Xóa) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-3 py-3 text-center w-12">STT</th>
                    <th className="px-4 py-3">Khách hàng</th>
                    <th className="px-4 py-3">Số điện thoại</th>
                    <th className="px-4 py-3">Khóa học tham khảo</th>
                    <th className="px-5 py-3 min-w-[260px]">Nhu cầu (AI trích xuất từ chat)</th>
                    <th className="px-4 py-3">Tình trạng chăm sóc</th>
                    <th className="px-4 py-3">E-Learning</th>
                    <th className="px-4 py-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {consultingList.map((row, index) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3 py-4 text-center font-bold text-slate-500">
                        {index + 1}
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {row.customerName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Sinh: {row.dob || "Chưa có"} • Tiếp nhận: {row.receivedAt}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        {row.phone ? (
                          <div className="space-y-1">
                            <span className="font-mono font-bold text-slate-900 text-sm block">
                              {row.phone}
                            </span>
                            {row.phoneAutoExtracted ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                                AI tự động lưu
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

                      <td className="px-4 py-4">
                        <span className="px-2.5 py-1 bg-red-50 text-[#DC2626] font-bold rounded-lg border border-red-100 text-xs inline-block">
                          {row.courseRefLabel}
                        </span>
                      </td>

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

                      <td className="px-4 py-4">
                        <select
                          value={row.careStatus}
                          onChange={(e) => handleStatusChange(row.id, e.target.value as any)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                            row.careStatus === "registered"
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-300 font-extrabold"
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
                          <option value="registered">Đã đăng ký (Chuyển sang TT)</option>
                          <option value="lost">Không tiếp tục</option>
                        </select>
                      </td>

                      <td className="px-4 py-4">
                        {row.elearningStatus === "synced" ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Đã chuyển sang TT
                            </span>
                            <div className="text-[10px] text-slate-600 font-semibold flex items-center gap-1">
                              <GraduationCap className="w-3 h-3 text-emerald-700" />
                              <span>{row.elearningClass}</span>
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

                      {/* CÁC THAO TÁC: GỌI, SỬA, XÓA */}
                      <td className="px-4 py-4 text-right space-x-1.5 whitespace-nowrap">
                        {row.phone && (
                          <button
                            type="button"
                            onClick={() => handleOpenCall(row)}
                            className="px-2.5 py-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-2xs"
                            title="Gọi tư vấn"
                          >
                            <Phone className="w-3 h-3" /> Gọi
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleOpenEditConsulting(row)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg inline-flex items-center"
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteConsulting(row.id, row.customerName)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg inline-flex items-center"
                          title="Xóa khách hàng"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: KHÁCH HÀNG TRUNG TÂM (HỌC VIÊN CHÍNH THỨC)         */}
      {/* ========================================================= */}
      {activeTab === "center" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative flex-1 min-w-[280px]">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchStudent}
                onChange={(e) => setSearchStudent(e.target.value)}
                placeholder="Tìm theo Mã học viên, Họ tên, SĐT, Khóa đăng ký..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
              />
            </div>

            <button
              type="button"
              onClick={fetchCenterStudents}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingStudents ? "animate-spin" : ""}`} />
              <span>Làm mới</span>
            </button>
          </div>

          {/* BẢNG KHÁCH HÀNG TRUNG TÂM */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3.5">MÃ HỌC VIÊN</th>
                    <th className="px-5 py-3.5">HỌ TÊN</th>
                    <th className="px-4 py-3.5">SỐ ĐIỆN THOẠI</th>
                    <th className="px-4 py-3.5">NGÀY THÁNG NĂM SINH</th>
                    <th className="px-5 py-3.5">KHÓA ĐĂNG KÝ (Mã - Số buổi)</th>
                    <th className="px-4 py-3.5">LỚP E-LEARNING</th>
                    <th className="px-4 py-3.5 text-right">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentsList.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Chưa có học viên nào trong danh sách khách hàng trung tâm.
                      </td>
                    </tr>
                  ) : (
                    studentsList.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-4">
                          <span className="font-mono font-black text-sm text-[#DC2626] bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                            {st.studentCode}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900 text-sm">
                            {st.fullName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            Ngày ghi danh: {st.enrolledAt}
                          </div>
                        </td>

                        <td className="px-4 py-4 font-mono font-bold text-slate-800 text-sm">
                          {st.phone}
                        </td>

                        <td className="px-4 py-4 font-semibold text-slate-700">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{st.dob}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                            {st.displayCourse}
                          </span>
                          <p className="text-[10px] text-slate-500 mt-1">{st.courseTitle}</p>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            {st.elearningClass || "Đã cấp E-learning K26"}
                          </span>
                        </td>

                        {/* Nút Sửa & Xóa cho Khách hàng trung tâm */}
                        <td className="px-4 py-4 text-right space-x-2 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleOpenEditStudent(st)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                            title="Chỉnh sửa thông tin học viên"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(st.id, st.fullName)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#DC2626] font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                            title="Xóa học viên"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: TIẾP NHẬN KHÁCH HÀNG TƯ VẤN MỚI */}
      {isAddConsultingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">Tiếp Nhận Khách Hàng Tư Vấn Mới</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddConsultingModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateConsultation} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tên phụ huynh / Khách <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newConsultingName}
                    onChange={(e) => setNewConsultingName(e.target.value)}
                    placeholder="Nguyễn Thu Trang"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Số điện thoại (nếu có)</label>
                  <input
                    type="text"
                    value={newConsultingPhone}
                    onChange={(e) => setNewConsultingPhone(e.target.value)}
                    placeholder="0988xxxxxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Ngày sinh học viên</label>
                  <input
                    type="text"
                    value={newConsultingDob}
                    onChange={(e) => setNewConsultingDob(e.target.value)}
                    placeholder="15/06/2018"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Khóa học tham khảo</label>
                  <select
                    value={newConsultingCourse}
                    onChange={(e) => setNewConsultingCourse(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="model_kids">Model Kids (Mẫu Nhí Tài Năng)</option>
                    <option value="phong_thai">Phong Thái Quý Cô &amp; Doanh Nhân</option>
                    <option value="catwalk">Catwalk Chuyên Nghiệp</option>
                    <option value="giao_tiep">Nghệ Thuật Giao Tiếp &amp; Thuyết Trình</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nhu cầu ban đầu (AI phân tích từ chat)</label>
                <textarea
                  rows={3}
                  value={newConsultingNeed}
                  onChange={(e) => setNewConsultingNeed(e.target.value)}
                  placeholder="Ví dụ: Bé 7 tuổi nhút nhát, phụ huynh muốn con tự tin trước đám đông..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddConsultingModalOpen(false)}
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

      {/* MODAL 2: CHỈNH SỬA KHÁCH HÀNG TƯ VẤN */}
      {isEditConsultingModalOpen && editingConsulting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">Chỉnh Sửa Khách Hàng Tư Vấn</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditConsultingModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditConsulting} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tên khách hàng <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={editingConsulting.customerName}
                    onChange={(e) => setEditingConsulting({ ...editingConsulting, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Số điện thoại</label>
                  <input
                    type="text"
                    value={editingConsulting.phone || ""}
                    onChange={(e) => setEditingConsulting({ ...editingConsulting, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Khóa học tham khảo</label>
                  <select
                    value={editingConsulting.courseRef}
                    onChange={(e) => setEditingConsulting({ ...editingConsulting, courseRef: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="model_kids">Model Kids</option>
                    <option value="phong_thai">Phong Thái</option>
                    <option value="catwalk">Catwalk</option>
                    <option value="giao_tiep">Giao Tiếp</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tình trạng chăm sóc</label>
                  <select
                    value={editingConsulting.careStatus}
                    onChange={(e) => setEditingConsulting({ ...editingConsulting, careStatus: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="consulting">Đang tư vấn</option>
                    <option value="called">Đã gọi tư vấn</option>
                    <option value="uncalled">Chưa gọi (Cần liên hệ)</option>
                    <option value="trial_scheduled">Hẹn học thử</option>
                    <option value="registered">Đã đăng ký (Tự động chuyển sang TT)</option>
                    <option value="lost">Không tiếp tục</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nhu cầu học viên</label>
                <textarea
                  rows={3}
                  value={editingConsulting.aiExtractedNeed}
                  onChange={(e) => setEditingConsulting({ ...editingConsulting, aiExtractedNeed: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditConsultingModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-xl shadow-md"
                >
                  Cập Nhật Thông Tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: THÊM HỌC VIÊN TRUNG TÂM */}
      {isAddStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">Thêm Khách Hàng Trung Tâm (Học Viên)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddStudentModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Họ tên học viên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Nguyễn Gia Hân"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
                    placeholder="0912xxxxxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Ngày sinh <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newStudentDob}
                    onChange={(e) => setNewStudentDob(e.target.value)}
                    placeholder="15/06/2018"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Mã khóa học <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={newStudentCourseCode}
                    onChange={(e) => setNewStudentCourseCode(e.target.value.toUpperCase())}
                    placeholder="MK-01"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-[#DC2626]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Số buổi học <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newStudentSessions}
                    onChange={(e) => setNewStudentSessions(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ghi chú học viên</label>
                <input
                  type="text"
                  value={newStudentNotes}
                  onChange={(e) => setNewStudentNotes(e.target.value)}
                  placeholder="Ghi chú lớp học, lịch học, thông tin phụ huynh..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddStudentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-xl shadow-md"
                >
                  Lưu &amp; Cấp Mã Học Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: CHỈNH SỬA HỌC VIÊN TRUNG TÂM */}
      {isEditStudentModalOpen && editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">
                  Chỉnh Sửa Học Viên ({editingStudent.studentCode})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditStudentModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStudent} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Họ tên học viên <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={editingStudent.fullName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Số điện thoại <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Ngày sinh</label>
                  <input
                    type="text"
                    value={editingStudent.dob}
                    onChange={(e) => setEditingStudent({ ...editingStudent, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Mã khóa học</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.courseCode}
                    onChange={(e) => setEditingStudent({ ...editingStudent, courseCode: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-[#DC2626]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Số buổi học</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={editingStudent.sessions}
                    onChange={(e) => setEditingStudent({ ...editingStudent, sessions: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Ghi chú</label>
                <input
                  type="text"
                  value={editingStudent.notes || ""}
                  onChange={(e) => setEditingStudent({ ...editingStudent, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditStudentModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-xl shadow-md"
                >
                  Cập Nhật Học Viên
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
