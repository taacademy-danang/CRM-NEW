"use client";

import React, { useState, use } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Award,
  Clock,
  Plus,
  Edit2,
  FileText,
  DollarSign,
  CheckCircle2,
  Save,
  MessageSquare,
  Bot,
} from "lucide-react";

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState<"care_history" | "enrollment">("care_history");
  const [status, setStatus] = useState("consulting");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Khách hàng & Học viên", href: "/customers" },
              { label: "Chi tiết hồ sơ: Phạm Thu Hương (TA-2026-0891)" },
            ]}
          />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8B1D2C] to-[#A8242F] text-white font-bold flex items-center justify-center text-sm shadow-md">
              TH
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Phạm Thu Hương</span>
                <span className="font-mono text-xs text-slate-500 font-semibold px-2 py-0.5 bg-slate-100 rounded-md">
                  TA-2026-0891
                </span>
              </h1>
              <p className="text-xs text-slate-500">
                Tiếp nhận ngày 30/10/2026 từ Facebook Fanpage T.A Academy
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#8B1D2C] hover:bg-[#721422] rounded-xl shadow-md transition-colors"
        >
          <Save className="w-4 h-4" />
          Lưu Cập Nhật Hồ Sơ
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Đã lưu cập nhật thông tin hồ sơ phụ huynh và học viên thành công!
        </div>
      )}

      {/* 2. Top Overview: 6 Detailed Areas (A, B, C, D) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Areas A, B, C */}
        <div className="lg:col-span-8 space-y-5">
          {/* KHU VỰC A: THÔNG TIN PHỤ HUYNH */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#8B1D2C]" />
                <span>Khu vực A: Thông Tin Phụ Huynh</span>
              </h3>
              <span className="text-xs text-slate-400">Người liên hệ chính</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-500 font-medium">Họ và tên phụ huynh</label>
                <input
                  type="text"
                  defaultValue="Phạm Thu Hương"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-medium flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> Số điện thoại chính
                </label>
                <input
                  type="text"
                  defaultValue="0988123456"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-medium flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" /> Địa chỉ Email
                </label>
                <input
                  type="email"
                  defaultValue="thuhuong.pham@gmail.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Khu vực sinh sống
                </label>
                <input
                  type="text"
                  defaultValue="Cầu Giấy, Hà Nội"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* KHU VỰC B: THÔNG TIN HỌC VIÊN (1 PHỤ HUYNH - NHIỀU CON) */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8B1D2C]" />
                <span>Khu vực B: Danh Sách Học Viên (Con)</span>
              </h3>
              <button
                type="button"
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#8B1D2C] bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Thêm học viên
              </button>
            </div>

            {/* Danh sách các bé */}
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#8B1D2C] text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="font-bold text-sm text-slate-900">Bé Gia Hân</span>
                    <span className="px-2 py-0.5 bg-rose-100 text-[#8B1D2C] rounded text-[11px] font-semibold">
                      7 tuổi (Nữ)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Ngày sinh:</span>
                    <p className="font-semibold text-slate-800">15/08/2019</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Trường đang học:</span>
                    <p className="font-semibold text-slate-800">Tiểu học Archimedes Academy</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-400">Đặc điểm &amp; Sở thích:</span>
                    <p className="font-semibold text-slate-800">
                      Bé tính tình nhút nhát trước người lạ, đi hơi gù lưng, yêu thích xem thời trang và muốn tự tin biểu diễn sân khấu.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KHU VỰC C: NHU CẦU & MỤC TIÊU ĐÀO TẠO */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8B1D2C]" />
                <span>Khu vực C: Nhu Cầu &amp; Mục Tiêu Đào Tạo</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-slate-500 font-medium">Khóa học quan tâm chính</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-[#8B1D2C]">
                  <option>Model Kids Nâng Cao (4-12 tuổi)</option>
                  <option>Phong Thái Quý Cô</option>
                  <option>Catwalk Chuyên Nghiệp</option>
                  <option>Giao Tiếp - Thuyết Trình</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-medium">Thời gian mong muốn học</label>
                <input
                  type="text"
                  defaultValue="Sáng thứ Bảy & Chủ Nhật hàng tuần"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-slate-500 font-medium">Ghi chú mục tiêu học viện cần lưu ý</label>
                <textarea
                  rows={2}
                  defaultValue="Mẹ bé mong muốn giảng viên kèm chỉnh dáng lưng cho con và rèn cho bé sự tự tin khi đứng trước đám đông."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Area D - Trạng thái tuyển sinh */}
        <div className="lg:col-span-4 space-y-5">
          {/* KHU VỰC D: TRẠNG THÁI TUYỂN SINH & PHÂN BỔ */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-[#8B1D2C]" />
                <span>Khu vực D: Trạng Thái Tuyển Sinh</span>
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-500 font-medium">Giai đoạn tuyển sinh hiện tại</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]/20"
                >
                  <option value="new">Khách mới</option>
                  <option value="uncalled">Chưa gọi</option>
                  <option value="consulting">Đang tư vấn</option>
                  <option value="trial_scheduled">Hẹn học thử</option>
                  <option value="considering">Đang cân nhắc</option>
                  <option value="enrolling">Chờ ghi danh</option>
                  <option value="registered">Đã đăng ký</option>
                  <option value="lost">Không tiếp tục</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 font-medium">Tư vấn viên phụ trách</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800">
                  <option>Trần Văn Bình (Tuyển sinh Nhóm 1)</option>
                  <option>Lê Minh Trang</option>
                  <option>Nguyễn Thị Lan (Quản trị)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 text-[11px]">Trạng thái cuộc gọi:</span>
                <div className="flex items-center gap-1.5 mt-1 font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Đã liên hệ thành công (Cuộc gọi gần nhất: 14:15)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Tabs: Khu vực E (Nhật ký chăm sóc) & Khu vực F (Lịch sử đăng ký) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-5 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab("care_history")}
            className={`pb-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "care_history"
                ? "border-[#8B1D2C] text-[#8B1D2C]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-4 h-4" />
            Khu vực E: Nhật Ký Chăm Sóc &amp; Hoạt Động
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("enrollment")}
            className={`pb-3 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "enrollment"
                ? "border-[#8B1D2C] text-[#8B1D2C]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            Khu vực F: Lịch Sử Đăng Ký &amp; Học Phí
          </button>
        </div>

        {/* Tab 1: Khu vực E */}
        {activeTab === "care_history" && (
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-xs">
                <div className="p-2 bg-rose-50 text-[#8B1D2C] rounded-xl shrink-0 mt-0.5 border border-rose-100">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Cuộc gọi xác nhận – Nhân viên: Trần Văn Bình
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">14:15 - 30/10/2026</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    Thời lượng: 185 giây. Phụ huynh rất hài lòng về lộ trình Model Kids, đã chốt lịch sáng thứ 7 tuần này lúc 09:00 đưa bé Gia Hân đến học viện trải nghiệm.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="p-2 bg-purple-50 text-purple-700 rounded-xl shrink-0 mt-0.5 border border-purple-100">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Tư vấn tự động AI qua Facebook Messenger
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">14:02 - 30/10/2026</span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    AI giải đáp về giáo trình Mẫu nhí và khai thác thành công số điện thoại của phụ huynh.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Khu vực F */}
        {activeTab === "enrollment" && (
          <div className="p-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
              <DollarSign className="w-8 h-8 text-[#8B1D2C] mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">Chưa có bản ghi đăng ký chính thức</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Khách hàng hiện đang ở giai đoạn "Đang tư vấn / Hẹn học thử". Khi phụ huynh đồng ý ghi danh, thông tin khóa học và học phí sẽ được ghi nhận tại đây.
              </p>
              <button
                type="button"
                className="mt-2 px-4 py-2 bg-[#8B1D2C] hover:bg-[#721422] text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Tạo Đăng Ký Khóa Học Mới
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
