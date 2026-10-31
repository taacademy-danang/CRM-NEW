"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Layers, Plus, CheckCircle2, AlertTriangle, BookCheck, X, Check } from "lucide-react";
import { SituationRule } from "@/lib/services/aiTrainingService";

export default function AiSituationsPage() {
  const [situations, setSituations] = useState<SituationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<SituationRule["category"]>("Tâm lý học viên");
  const [newIdeal, setNewIdeal] = useState("");
  const [newMistake, setNewMistake] = useState("");
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

  const handleAddSituation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newIdeal.trim()) return;

    try {
      const res = await fetch("/api/ai/situations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          idealResponse: newIdeal.trim(),
          mistakeAvoid: newMistake.trim() || "Không tranh cãi, không tự ý báo giá sai lệch.",
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSituations([...situations, json.data]);
        setIsAddModalOpen(false);
        setNewTitle("");
        setNewIdeal("");
        setNewMistake("");
        showToast("Đã thêm tình huống thực tế và câu trả lời mẫu thành công!");
      }
    } catch (err) {
      alert("Lỗi thêm tình huống");
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
          onClick={() => setIsAddModalOpen(true)}
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
              <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã duyệt vào quy tắc AI
              </span>
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
                <label className="font-bold text-slate-700">Tình huống / Câu hỏi phụ huynh đặt ra <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Phụ huynh thắc mắc: 'Bé 5 tuổi chưa biết nghe lời có học được không?'"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nhóm phân loại</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Tâm lý học viên">Tâm lý học viên</option>
                  <option value="Xử lý học phí">Xử lý học phí</option>
                  <option value="Khai thác thông tin">Khai thác thông tin</option>
                  <option value="Lịch học & Đưa đón">Lịch học &amp; Đưa đón</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Câu trả lời mẫu mực của AI (Ideal Response) <span className="text-red-500">*</span></label>
                <textarea
                  rows={4}
                  required
                  value={newIdeal}
                  onChange={(e) => setNewIdeal(e.target.value)}
                  placeholder="Dạ Mẹ yên tâm nhé ạ! Ở độ tuổi này các cô giáo tại T.A Academy có phương pháp dỗ dành và lồng ghép trò chơi vận động giúp con thích thú..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Lỗi tối kỵ AI cần tránh</label>
                <input
                  type="text"
                  value={newMistake}
                  onChange={(e) => setNewMistake(e.target.value)}
                  placeholder="Ví dụ: Không được nói 'bé quậy quá khó dạy'..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
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
                  Duyệt Đưa Vào Quy Tắc AI
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
