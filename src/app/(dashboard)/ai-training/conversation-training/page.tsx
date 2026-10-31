"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { MessageSquare, Check, X, Pencil, Trash2, CheckCircle2 } from "lucide-react";

interface TrainingSample {
  id: string;
  customerName: string;
  source: string;
  statusLabel: string;
  question: string;
  oldAiReply: string;
  humanCorrection: string;
  agentName: string;
}

export default function AiConversationTrainingPage() {
  const [samples, setSamples] = useState<TrainingSample[]>([
    {
      id: "train-1",
      customerName: "Lê Mai Phương",
      source: "Fanpage Facebook",
      statusLabel: "Chưa tự nhiên (Nhân viên đã sửa)",
      question: "Con chị 5 tuổi có tham gia khóa Catwalk được không em?",
      oldAiReply: "Dạ khóa Catwalk dành cho người lớn từ 15 tuổi trở lên ạ, bé 5 tuổi không học được đâu Chị.",
      humanCorrection:
        "Dạ đối với các bé 5 tuổi, T.A Academy có khóa Model Kids (Mẫu nhí tài năng) được thiết kế riêng với các bài tập giải phóng hình thể và bước đi catwalk phù hợp thể chất lứa tuổi của con ạ. Em giới thiệu chi tiết khóa Model Kids cho Mẹ nha?",
      agentName: "Nguyễn Thị Lan",
    },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSample, setEditingSample] = useState<TrainingSample | null>(null);
  const [correctionText, setCorrectionText] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenEdit = (s: TrainingSample) => {
    setEditingSample(s);
    setCorrectionText(s.humanCorrection);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSample) return;
    setSamples(
      samples.map((s) =>
        s.id === editingSample.id ? { ...s, humanCorrection: correctionText.trim() } : s
      )
    );
    setIsEditModalOpen(false);
    setEditingSample(null);
    showToast("Đã cập nhật câu trả lời mẫu của tư vấn viên!");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa mẫu hội thoại này?")) return;
    setSamples(samples.filter((s) => s.id !== id));
    showToast("Đã xóa mẫu hội thoại!");
  };

  const handleApprove = (id: string) => {
    showToast("Đã phê duyệt và nạp vào dữ liệu huấn luyện AI Tiểu Mỹ thành công!");
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

      <div>
        <Breadcrumb
          items={[
            { label: "Trung tâm đào tạo AI", href: "/ai-training" },
            { label: "Đào tạo từ hội thoại thực tế" },
          ]}
        />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-[#DC2626]" />
          <span>Đào Tạo &amp; Tinh Chỉnh AI Từ Hội Thoại Thực Tế</span>
        </h1>
        <p className="text-xs text-slate-500">
          Các tin nhắn AI được nhân viên gắn nhãn: Tốt, Chưa tự nhiên, Sai kiến thức, Nhân viên đã sửa. Quản trị viên xét duyệt hoặc chỉnh sửa để đưa vào dữ liệu huấn luyện mới.
        </p>
      </div>

      <div className="space-y-4">
        {samples.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            Hiện chưa có mẫu hội thoại nào cần gắn nhãn.
          </div>
        ) : (
          samples.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  Hội thoại với Phụ huynh: {s.customerName} ({s.source})
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 text-[11px]">
                    {s.statusLabel}
                  </span>
                  <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(s)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa câu trả lời mẫu"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa mẫu hội thoại"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400">Câu hỏi của khách:</span>
                <p className="text-slate-700 italic">"{s.question}"</p>
              </div>

              <div className="p-3 bg-rose-50/50 rounded-xl text-xs border border-rose-100 space-y-1">
                <span className="text-[10px] font-bold text-[#DC2626]">Câu trả lời cũ của AI:</span>
                <p className="text-slate-800">"{s.oldAiReply}"</p>
              </div>

              <div className="p-3 bg-emerald-50/50 rounded-xl text-xs border border-emerald-100 space-y-1">
                <span className="text-[10px] font-bold text-emerald-700">Câu sửa lại của Tư vấn viên ({s.agentName}):</span>
                <p className="text-slate-800 font-semibold leading-relaxed">
                  "{s.humanCorrection}"
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleApprove(s.id)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Duyệt Thành Mẫu Đào Tạo AI
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Edit Training Sample */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">
                  Chỉnh Sửa Câu Trả Lời Mẫu Đào Tạo
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

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Câu trả lời chuẩn của tư vấn viên để AI học theo
                </label>
                <textarea
                  required
                  rows={4}
                  value={correctionText}
                  onChange={(e) => setCorrectionText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed"
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
