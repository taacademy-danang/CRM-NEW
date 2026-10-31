"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { CheckCircle2, RotateCcw, Layers, Pencil, Trash2, X, Plus, Check } from "lucide-react";

interface VersionItem {
  version: string;
  releaseDate: string;
  status: "active" | "archived" | "draft";
  description: string;
  author: string;
}

export default function AiVersionsPage() {
  const [activeVersion, setActiveVersion] = useState("v2.2.0");
  const [versions, setVersions] = useState<VersionItem[]>([
    {
      version: "v2.2.0",
      releaseDate: "28/10/2026",
      status: "active",
      description: "Cập nhật biểu phí ưu đãi mùa thu và bổ sung kịch bản xử lý phụ huynh có con nhút nhát.",
      author: "Nguyễn Thị Lan (Admin)",
    },
    {
      version: "v2.1.0",
      releaseDate: "15/10/2026",
      status: "archived",
      description: "Tích hợp Gemini 1.5 Flash làm model chính thức, tối ưu hóa độ trễ phản hồi dưới 1.2s.",
      author: "Nguyễn Thị Lan (Admin)",
    },
    {
      version: "v2.0.0",
      releaseDate: "01/10/2026",
      status: "archived",
      description: "Phiên bản AI Orchestrator đầu tiên triển khai tại T.A Academy với 4 nhóm kịch bản.",
      author: "Ban Công Nghệ",
    },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVersion, setEditingVersion] = useState<VersionItem | null>(null);
  const [formDesc, setFormDesc] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRollback = (v: string) => {
    setActiveVersion(v);
    setVersions(
      versions.map((item) => ({
        ...item,
        status: item.version === v ? "active" : "archived",
      }))
    );
    showToast(`Đã khôi phục (Rollback) thành công về phiên bản ${v}!`);
  };

  const handleOpenEdit = (ver: VersionItem) => {
    setEditingVersion(ver);
    setFormDesc(ver.description);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVersion) return;
    setVersions(
      versions.map((item) =>
        item.version === editingVersion.version
          ? { ...item, description: formDesc.trim() }
          : item
      )
    );
    setIsEditModalOpen(false);
    setEditingVersion(null);
    showToast(`Đã cập nhật mô tả phiên bản ${editingVersion.version}!`);
  };

  const handleDelete = (v: string) => {
    if (v === activeVersion) {
      alert("Không thể xóa phiên bản đang hoạt động thực tế (Active)!");
      return;
    }
    if (!confirm(`Bạn có chắc chắn muốn xóa lưu trữ phiên bản ${v}?`)) return;
    setVersions(versions.filter((item) => item.version !== v));
    showToast(`Đã xóa phiên bản ${v} khỏi danh sách lưu trữ!`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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
            { label: "Quản lý phiên bản AI" },
          ]}
        />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Layers className="w-6 h-6 text-[#DC2626]" />
          <span>Quản Lý Phiên Bản AI (Versioning &amp; Rollback)</span>
        </h1>
        <p className="text-xs text-slate-500">
          Vòng đời phiên bản an toàn: Draft &gt; Test &gt; Active. Hỗ trợ chỉnh sửa ghi chú, xóa phiên bản cũ và khôi phục (Rollback) về phiên bản trước đó ngay lập tức.
        </p>
      </div>

      <div className="space-y-4">
        {versions.map((ver) => {
          const isActive = ver.version === activeVersion;
          return (
            <div
              key={ver.version}
              className={`p-5 rounded-2xl border transition-all ${
                isActive
                  ? "bg-red-50/50 border-[#DC2626] shadow-sm ring-1 ring-[#DC2626]/30"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {ver.version}
                  </span>
                  {isActive ? (
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đang Chạy Thực Tế (Active)
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600 text-[11px]">
                      Lưu trữ (Archived)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-mono text-[11px]">Phát hành: {ver.releaseDate}</span>
                  <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(ver)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa mô tả"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    {!isActive && (
                      <button
                        type="button"
                        onClick={() => handleDelete(ver.version)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa phiên bản này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{ver.description}</p>
              <div className="text-[11px] text-slate-400 mt-2">Người duyệt: {ver.author}</div>

              {!isActive && (
                <div className="pt-3 mt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRollback(ver.version)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-[#DC2626] bg-white hover:bg-red-50 border border-[#DC2626]/30 rounded-xl transition-colors shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Khôi phục về phiên bản này (Rollback)
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Edit Version Description */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">
                  Chỉnh Sửa Mô Tả Phiên Bản ({editingVersion?.version})
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
                <label className="font-bold text-slate-700">Mô tả cập nhật của phiên bản</label>
                <textarea
                  required
                  rows={4}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
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
