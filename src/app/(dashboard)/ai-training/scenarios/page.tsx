"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  GitPullRequest,
  Plus,
  CheckCircle2,
  X,
  Check,
  Pencil,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { GuidedScenario } from "@/lib/services/aiTrainingService";

export default function AiScenariosPage() {
  const [scenarios, setScenarios] = useState<GuidedScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingScenario, setEditingScenario] = useState<GuidedScenario | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formCourse, setFormCourse] = useState("Model Kids");
  const [formGoal, setFormGoal] = useState("");
  const [formSteps, setFormSteps] = useState("");
  const [formStatus, setFormStatus] = useState("Đang hoạt động");

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchScenarios = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ai/scenarios");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setScenarios(json.data);
      }
    } catch (err) {
      console.error("Lỗi tải kịch bản:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenarios();
  }, []);

  const handleOpenAdd = () => {
    setFormTitle("");
    setFormCourse("Model Kids");
    setFormGoal("");
    setFormSteps("");
    setFormStatus("Đang hoạt động");
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (sc: GuidedScenario) => {
    setEditingScenario(sc);
    setFormTitle(sc.title);
    setFormCourse(sc.course);
    setFormGoal(sc.goal);
    setFormSteps(sc.steps.join("\n"));
    setFormStatus(sc.status);
    setIsEditModalOpen(true);
  };

  const handleAddScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const stepsArray = formSteps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/ai/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle.trim(),
          course: formCourse,
          goal: formGoal.trim() || undefined,
          status: formStatus,
          steps: stepsArray.length > 0 ? stepsArray : undefined,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setScenarios([...scenarios, json.data]);
        setIsAddModalOpen(false);
        showToast("Tạo kịch bản tư vấn mới thành công!");
      }
    } catch (err) {
      alert("Lỗi tạo kịch bản");
    }
  };

  const handleUpdateScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScenario || !formTitle.trim()) return;

    const stepsArray = formSteps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/ai/scenarios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: editingScenario.code,
          title: formTitle.trim(),
          course: formCourse,
          goal: formGoal.trim(),
          status: formStatus,
          steps: stepsArray,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setScenarios(
          scenarios.map((s) => (s.code === editingScenario.code ? json.data : s))
        );
        setIsEditModalOpen(false);
        setEditingScenario(null);
        showToast("Đã cập nhật kịch bản thành công!");
      } else {
        alert(json.message || "Lỗi cập nhật");
      }
    } catch (err) {
      alert("Lỗi kết nối khi cập nhật");
    }
  };

  const handleDeleteScenario = async (code: string, title: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa kịch bản "${title}"?`)) return;

    try {
      const res = await fetch(`/api/ai/scenarios?code=${encodeURIComponent(code)}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setScenarios(scenarios.filter((s) => s.code !== code));
        showToast(`Đã xóa kịch bản "${title}" thành công!`);
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
              { label: "Kịch bản tư vấn chuẩn" },
            ]}
          />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GitPullRequest className="w-6 h-6 text-[#DC2626]" />
            <span>Quản Lý Kịch Bản Tư Vấn Chuẩn (Guided Scenarios)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Các kịch bản dẫn dắt có cấu trúc giúp AI luôn kiểm soát mục tiêu hội thoại, hỏi từng câu và không bị lạc đề.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Tạo Kịch Bản Mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((sc) => (
          <div
            key={sc.code}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:border-red-200 hover:shadow-md transition-all"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {sc.code}
                </span>
                <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {sc.status}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">{sc.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{sc.goal}</p>

              {/* Steps List */}
              <div className="mt-3 p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Các bước thực hiện ({sc.steps.length} bước):
                </span>
                {sc.steps.map((st, idx) => (
                  <p key={idx} className="text-[11px] text-slate-700 font-medium">
                    {st}
                  </p>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-[#DC2626] bg-red-50 px-2 py-0.5 rounded-lg border border-red-100 text-[11px]">
                {sc.course}
              </span>
              
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(sc)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Chỉnh sửa kịch bản"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteScenario(sc.code, sc.title)}
                  className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa kịch bản"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add Scenario */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">
                  Tạo Kịch Bản Tư Vấn Chuẩn Mới
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

            <form onSubmit={handleAddScenario} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Tên kịch bản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ví dụ: Tư vấn lớp Catwalk hoa hậu nhí..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Khóa học áp dụng</label>
                  <select
                    value={formCourse}
                    onChange={(e) => setFormCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Model Kids">Model Kids</option>
                    <option value="Phong Thái">Phong Thái</option>
                    <option value="Catwalk">Catwalk</option>
                    <option value="Giao Tiếp">Giao Tiếp</option>
                    <option value="Đa khóa học">Đa khóa học</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Trạng thái</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Tạm ngưng">Tạm ngưng</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mục tiêu kịch bản</label>
                <input
                  type="text"
                  value={formGoal}
                  onChange={(e) => setFormGoal(e.target.value)}
                  placeholder="Ví dụ: Khai thác tính cách bé, giới thiệu lớp học thử..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Các bước thực hiện (Mỗi dòng là 1 bước)
                </label>
                <textarea
                  rows={4}
                  value={formSteps}
                  onChange={(e) => setFormSteps(e.target.value)}
                  placeholder="Bước 1: Chào hỏi và hỏi tuổi bé&#10;Bước 2: Tìm hiểu mục tiêu học&#10;Bước 3: Chốt hẹn học thử"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
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
                  Tạo Kịch Bản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Scenario */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">
                  Chỉnh Sửa Kịch Bản Tư Vấn ({editingScenario?.code})
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

            <form onSubmit={handleUpdateScenario} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Tên kịch bản <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Khóa học áp dụng</label>
                  <select
                    value={formCourse}
                    onChange={(e) => setFormCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Model Kids (Mẫu Nhí)">Model Kids (Mẫu Nhí)</option>
                    <option value="Phong Thái Doanh Nhân">Phong Thái Doanh Nhân</option>
                    <option value="Catwalk Chuyên Nghiệp">Catwalk Chuyên Nghiệp</option>
                    <option value="Nghệ Thuật Giao Tiếp">Nghệ Thuật Giao Tiếp</option>
                    <option value="Đa khóa học">Đa khóa học</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Trạng thái</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Đang hoạt động">Đang hoạt động</option>
                    <option value="Tạm ngưng">Tạm ngưng</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mục tiêu kịch bản</label>
                <input
                  type="text"
                  value={formGoal}
                  onChange={(e) => setFormGoal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Các bước thực hiện (Mỗi dòng là 1 bước)
                </label>
                <textarea
                  rows={4}
                  value={formSteps}
                  onChange={(e) => setFormSteps(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
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
