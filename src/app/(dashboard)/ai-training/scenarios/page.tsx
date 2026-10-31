"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { GitPullRequest, Plus, ArrowRight, CheckCircle2, X, Check, BookOpen } from "lucide-react";
import { GuidedScenario } from "@/lib/services/aiTrainingService";

export default function AiScenariosPage() {
  const [scenarios, setScenarios] = useState<GuidedScenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState("Model Kids");
  const [newGoal, setNewGoal] = useState("");
  const [newSteps, setNewSteps] = useState("");
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

  const handleAddScenario = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const stepsArray = newSteps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/ai/scenarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          course: newCourse,
          goal: newGoal.trim() || undefined,
          steps: stepsArray.length > 0 ? stepsArray : undefined,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setScenarios([...scenarios, json.data]);
        setIsAddModalOpen(false);
        setNewTitle("");
        setNewGoal("");
        setNewSteps("");
        showToast("Tạo kịch bản tư vấn mới thành công!");
      }
    } catch (err) {
      alert("Lỗi tạo kịch bản");
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
          onClick={() => setIsAddModalOpen(true)}
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
                <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
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
              <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                Kích hoạt tự động
              </span>
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
                <label className="font-bold text-slate-700">Tên kịch bản <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Tư vấn lớp Catwalk hoa hậu nhí..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Khóa học áp dụng</label>
                <select
                  value={newCourse}
                  onChange={(e) => setNewCourse(e.target.value)}
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
                <label className="font-bold text-slate-700">Mục tiêu chính của kịch bản</label>
                <input
                  type="text"
                  required
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="Ví dụ: Khai thác mong muốn của phụ huynh và chốt lịch học thử..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Các bước dẫn dắt (Mỗi dòng một bước) <span className="text-red-500">*</span></span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={newSteps}
                  onChange={(e) => setNewSteps(e.target.value)}
                  placeholder="Bước 1: Chào hỏi và khai thác độ tuổi&#10;Bước 2: Tìm hiểu nhu cầu và khó khăn của con&#10;Bước 3: Giới thiệu lớp học thử miễn phí&#10;Bước 4: Xin số điện thoại giữ chỗ"
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
                  Kích Hoạt Kịch Bản Này
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
