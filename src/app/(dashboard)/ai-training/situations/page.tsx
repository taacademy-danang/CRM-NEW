"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  Layers,
  Plus,
  CheckCircle2,
  AlertTriangle,
  BookCheck,
  X,
  Check,
  Pencil,
  Trash2,
} from "lucide-react";
import { SituationRule } from "@/lib/services/aiTrainingService";

export default function AiSituationsPage() {
  const [situations, setSituations] = useState<SituationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSituation, setEditingSituation] = useState<SituationRule | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<SituationRule["category"]>("Tâm lý học viên");
  const [formIdeal, setFormIdeal] = useState("");
  const [formMistake, setFormMistake] = useState("");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchSituations = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ai/situations");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setSituations(json.data);
      }
    } catch (err) {
      console.error("Lỗi tải tình huống:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSituations();
  }, []);

  const handleOpenAdd = () => {
    setFormTitle("");
    setFormCategory("Tâm lý học viên");
    setFormIdeal("");
    setFormMistake("");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (sit: SituationRule) => {
    setEditingSituation(sit);
    setFormTitle(sit.title);
    setFormCategory(sit.category);
    setFormIdeal(sit.idealResponse);
    setFormMistake(sit.mistakeAvoid);
    setIsEditModalOpen(true);
  };

  const handleAddSituation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formIdeal.trim()) return;

    try {
      const res = await fetch("/api/ai/situations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          category: formCategory,
          idealResponse: formIdeal.trim(),
          mistakeAvoid: formMistake.trim() || "Không tranh cãi, không tự ý báo giá sai lệch.",
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSituations([...situations, json.data]);
        setIsAddModalOpen(false);
        showToast("Đã thêm tình huống thực tế và câu trả lời mẫu thành công!");
      }
    } catch (err) {
      alert("Lỗi thêm tình huống");
    }
  };

  const handleUpdateSituation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSituation || !formTitle.trim() || !formIdeal.trim()) return;

    try {
      const res = await fetch("/api/ai/situations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingSituation.id,
          title: formTitle.trim(),
          category: formCategory,
          idealResponse: formIdeal.trim(),
          mistakeAvoid: formMistake.trim(),
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSituations(
          situations.map((s) => (s.id === editingSituation.id ? json.data : s))
        );
        setIsEditModalOpen(false);
        setEditingSituation(null);
        showToast("Đã cập nhật tình huống thành công!");
      } else {
        alert(json.message || "Lỗi cập nhật");
      }
    } catch (err) {
      alert("Lỗi kết nối khi cập nhật");
    }
  };

  const handleDeleteSituation = async (id: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tình huống "${title}"?`)) return;

    try {
      const res = await fetch(`/api/ai/situations?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSituations(situations.filter((s) => s.id !== id));
        showToast(`Đã xóa tình huống thành công!`);
      } else {
        alert(json.message || "Lỗi khi xóa");
      }
    } catch (err) {
      alert("Lỗi kết nối khi xóa");
    }
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Trung tâm đào tạo AI", href: "/ai-training" },
              { label: "Thư viện tình huống" },
            ]}
          />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-[#DC2626]" />
            <span>Thư Viện Tình Huống Thực Tế Đã Phê Duyệt</span>
          </h1>
          <p className="text-xs text-slate-500">
            Tập hợp các câu hỏi hóc búa, lời từ chối của phụ huynh kèm câu trả lời mẫu mực và lỗi tối kỵ cần tránh.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Thêm Tình Huống Mới
        </button>
      </div>

      <div className="space-y-4">
        {situations.map((sit) => (
          <div
            key={sit.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3 hover:border-red-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                {sit.category}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã duyệt vào quy tắc AI
                </span>
                <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(sit)}
                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Chỉnh sửa tình huống"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSituation(sit.id, sit.title)}
                    className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa tình huống"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BookCheck className="w-4 h-4 text-[#DC2626] shrink-0" />
              <span>{sit.title}</span>
            </h3>

            {/* Ideal response */}
            <div className="p-3.5 bg-red-50/50 border border-red-100 rounded-xl">
              <span className="text-[11px] font-bold text-[#DC2626] uppercase tracking-wider block mb-1">
                Câu trả lời chuẩn mẫu (Ideal Response):
              </span>
              <p className="text-xs text-slate-800 leading-relaxed italic">
                "{sit.idealResponse}"
              </p>
            </div>

            {/* Mistake to avoid */}
            <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-start gap-2 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Lỗi tối kỵ cần tránh: </span>
                <span>{sit.mistakeAvoid}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Situation */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">
                  Thêm Tình Huống Thực Tế &amp; Câu Trả Lời Mẫu
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSituation} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Tình huống / Câu hỏi phụ huynh đặt ra <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Phụ huynh thắc mắc: 'Bé 5 tuổi chưa biết nghe lời có học được không?'"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nhóm phân loại</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Tâm lý học viên">Tâm lý học viên</option>
                  <option value="Xử lý học phí">Xử lý học phí</option>
                  <option value="Khai thác thông tin">Khai thác thông tin</option>
                  <option value="Lịch học & Đưa đón">Lịch học &amp; Đưa đón</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Câu trả lời mẫu mực của AI (Ideal Response) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formIdeal}
                  onChange={(e) => setFormIdeal(e.target.value)}
                  placeholder="Nhập câu trả lời mẫu chuẩn mực, tinh tế và chuyên nghiệp..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Lỗi tối kỵ cần tránh</label>
                <input
                  type="text"
                  value={formMistake}
                  onChange={(e) => setFormMistake(e.target.value)}
                  placeholder="Ví dụ: Không chê bai đối thủ, không tự ý báo giảm giá..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl font-bold shadow-md"
                >
                  Thêm Tình Huống
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Situation */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">
                  Chỉnh Sửa Tình Huống Thực Tế
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateSituation} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Tình huống / Câu hỏi phụ huynh đặt ra <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nhóm phân loại</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Tâm lý học viên">Tâm lý học viên</option>
                  <option value="Xử lý học phí">Xử lý học phí</option>
                  <option value="Khai thác thông tin">Khai thác thông tin</option>
                  <option value="Lịch học & Đưa đón">Lịch học &amp; Đưa đón</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Câu trả lời mẫu mực của AI (Ideal Response) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={formIdeal}
                  onChange={(e) => setFormIdeal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Lỗi tối kỵ cần tránh</label>
                <input
                  type="text"
                  value={formMistake}
                  onChange={(e) => setFormMistake(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl font-bold shadow-md"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
