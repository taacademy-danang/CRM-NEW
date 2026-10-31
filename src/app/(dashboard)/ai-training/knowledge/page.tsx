"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { BookOpen, Upload, CheckCircle2, Clock, FileText, Check, Plus, X, Sparkles } from "lucide-react";
import { KnowledgeDocument } from "@/lib/services/aiTrainingService";

export default function AiKnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<KnowledgeDocument["category"]>("Model Kids");
  const [newSummary, setNewSummary] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchDocs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ai/knowledge");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setDocs(json.data);
      }
    } catch (err) {
      console.error("Lỗi tải tài liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch("/api/ai/knowledge", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, approverName: "Nguyễn Thị Lan (Admin)" }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setDocs((prev) => prev.map((d) => (d.id === id ? json.data : d)));
        showToast(json.message);
      }
    } catch (err) {
      alert("Lỗi phê duyệt tài liệu");
    }
  };

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch("/api/ai/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          category: newCategory,
          contentSummary: newSummary.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setDocs([json.data, ...docs]);
        setIsAddModalOpen(false);
        setNewTitle("");
        setNewSummary("");
        showToast("Tải lên tài liệu mới thành công!");
      }
    } catch (err) {
      alert("Lỗi tải lên tài liệu");
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
              { label: "Kho kiến thức & RAG" },
            ]}
          />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#DC2626]" />
            <span>Kho Kiến Thức Nghiệp Vụ &amp; RAG (Retrieval-Augmented Generation)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Tài liệu nghiệp vụ tuyển sinh. Chỉ các tài liệu đã được Phê duyệt mới được đưa vào Vector Index để AI tham chiếu tư vấn.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-all active:scale-95"
        >
          <Upload className="w-4 h-4" />
          Tải Tài Liệu Mới (PDF / Word)
        </button>
      </div>

      {/* Docs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Tài liệu kiến thức</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3">Phiên bản</th>
              <th className="px-4 py-3">Số phân đoạn (Chunks)</th>
              <th className="px-4 py-3">Trạng thái RAG</th>
              <th className="px-4 py-3">Người phê duyệt</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#DC2626]" />
                    <span>{doc.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{doc.contentSummary}</p>
                  <span className="text-[10px] text-slate-400">Cập nhật: {doc.updatedAt}</span>
                </td>
                <td className="px-4 py-3.5 font-semibold text-slate-700">
                  {doc.category}
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-600">
                  {doc.version}
                </td>
                <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                  {doc.chunksCount} chunks
                </td>
                <td className="px-4 py-3.5">
                  {doc.isApproved ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã duyệt (Active)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3.5 h-3.5" /> Chờ duyệt (Draft)
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-slate-600">
                  {doc.approvedBy || "--"}
                </td>
                <td className="px-4 py-3.5 text-right">
                  {!doc.isApproved ? (
                    <button
                      type="button"
                      onClick={() => handleApprove(doc.id)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors inline-flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Phê Duyệt RAG
                    </button>
                  ) : (
                    <span className="text-emerald-700 text-xs font-semibold">Đang lập chỉ mục</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Add Document */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">
                  Tải Lên Tài Liệu Kiến Thức Mới
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

            <form onSubmit={handleAddDoc} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tên tài liệu / Giáo trình <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Chính sách học phí ưu đãi Khóa Catwalk 2026..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Khóa học / Danh mục</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  <option value="Model Kids">Model Kids</option>
                  <option value="Phong thái">Phong thái</option>
                  <option value="Catwalk">Catwalk</option>
                  <option value="Giao tiếp">Giao tiếp</option>
                  <option value="Học phí & Chính sách">Học phí &amp; Chính sách</option>
                  <option value="Ưu đãi">Ưu đãi</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tóm tắt nội dung tài liệu</label>
                <textarea
                  rows={4}
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Nhập nội dung tóm tắt để hệ thống phân tách phân đoạn (chunks) và nhúng vector index..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
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
                  Lưu &amp; Phân Đoạn Chunks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
