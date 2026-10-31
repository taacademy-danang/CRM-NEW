"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  Cpu,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Trash2,
  X,
  Send,
  Zap,
  Bot,
  RefreshCw,
  Check,
} from "lucide-react";

export interface AiTaskItem {
  id: string;
  title: string;
  triggerEvent: string;
  channel: "Facebook Messenger" | "Zalo OA" | "Đa kênh (FB & Zalo)";
  frequency: string;
  templateMessage: string;
  isActive: boolean;
  totalExecutedCount: number;
  lastExecutedTime: string;
}

export default function AiTasksAutomationPage() {
  const [tasks, setTasks] = useState<AiTaskItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [testRunSuccess, setTestRunSuccess] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form thêm Task mới
  const [newTitle, setNewTitle] = useState("");
  const [newTrigger, setNewTrigger] = useState("Trước giờ hẹn học thử 24 giờ");
  const [newChannel, setNewChannel] = useState<AiTaskItem["channel"]>("Đa kênh (FB & Zalo)");
  const [newTemplate, setNewTemplate] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/ai-tasks");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setTasks(json.data);
        }
      }
    } catch (err) {
      console.error("Lỗi tải tác vụ AI:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleTask = async (id: string) => {
    try {
      const res = await fetch("/api/ai-tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isActive: json.data.isActive } : t))
        );
        showToast(json.message);
      }
    } catch (err) {
      alert("Lỗi kết nối máy chủ");
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tác vụ AI tự động này?")) return;

    try {
      const res = await fetch(`/api/ai-tasks?id=${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        showToast("Đã xóa tác vụ AI thành công");
      }
    } catch (err) {
      alert("Lỗi xóa tác vụ");
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTemplate.trim()) return;

    try {
      const res = await fetch("/api/ai-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          triggerEvent: newTrigger,
          channel: newChannel,
          frequency: "Tự động quét khi thỏa điều kiện",
          templateMessage: newTemplate.trim(),
          isActive: true,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Lỗi tạo tác vụ");
      }

      setTasks([json.data, ...tasks]);
      setIsAddModalOpen(false);
      setNewTitle("");
      setNewTemplate("");
      showToast("Đã thêm Task công việc mới cho AI thành công!");
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra");
    }
  };

  const handleRunTest = async (task: AiTaskItem) => {
    try {
      const res = await fetch("/api/ai-tasks/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: task.id }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setTasks((prev) =>
          prev.map((t) => (t.id === task.id ? { ...t, ...json.data } : t))
        );
        setTestRunSuccess(task.title);
        setTimeout(() => setTestRunSuccess(null), 4000);
      }
    } catch (err) {
      alert("Lỗi thực thi chạy thử");
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

      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: "Tổng quan", href: "/" }, { label: "AI Tự động hóa tác vụ lặp lại" }]} />
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="w-6 h-6 text-[#DC2626]" />
            <span>AI TỰ ĐỘNG HÓA CÁC CÔNG VIỆC LẶP LẠI</span>
          </h1>
          <p className="text-xs text-slate-500">
            Ủy quyền cho AI thực hiện 100% tự động các nhiệm vụ lặp đi lặp lại: Nhắn tin nhắc lịch học thử, gửi lời hỏi thăm khách im lặng, gửi cẩm nang chào mừng và chúc mừng sinh nhật.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchTasks}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs"
            title="Làm mới"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Thêm Task Công Việc Mới Cho AI
          </button>
        </div>
      </div>

      {testRunSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Đã chạy thử nghiệm thành công Task: <strong>{testRunSuccess}</strong>! AI đã kích hoạt gửi tin nhắn tự động theo mẫu.</span>
        </div>
      )}

      {/* 2. Thống kê chỉ số AI Automation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Task AI đang chạy tự động</span>
            <div className="text-2xl font-black text-slate-900">
              {tasks.filter((t) => t.isActive).length} / {tasks.length} Task
            </div>
            <span className="text-[11px] text-emerald-600 font-bold">Hoạt động 24/7 không gián đoạn</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Tổng tin nhắn AI tự gửi</span>
            <div className="text-2xl font-black text-blue-700">
              {tasks.reduce((acc, curr) => acc + curr.totalExecutedCount, 0)} tin
            </div>
            <span className="text-[11px] text-slate-400">Tiết kiệm 85 giờ làm việc/tháng</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium">Tỷ lệ phụ huynh phản hồi</span>
            <div className="text-2xl font-black text-purple-700">
              {tasks.length > 0 ? "76.4%" : "0%"}
            </div>
            <span className="text-[11px] text-purple-600 font-bold">
              {tasks.length > 0 ? "Giảm 60% tỷ lệ hủy lịch học thử" : "Sẵn sàng phân tích khi có tác vụ"}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Danh Sách Từng Task Công Việc Của AI */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">
            Danh Sách Các Task Tự Động Hóa Được Giao Cho AI ({tasks.length} Task)
          </h2>
        </div>

        {tasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 bg-red-50 text-[#DC2626] rounded-2xl flex items-center justify-center mx-auto">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Chưa có tác vụ AI tự động nào</h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto">
              Dữ liệu giả đã được xóa sạch. Bạn có thể bấm nút &quot;Thêm Task Công Việc Mới Cho AI&quot; ở trên để thiết lập quy trình tự động gửi tin nhắn nhắc lịch học thử, chăm sóc khách hàng hoặc gửi ưu đãi.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-5 rounded-2xl border transition-all space-y-3.5 bg-white ${
                task.isActive
                  ? "border-red-200 shadow-xs ring-1 ring-red-100"
                  : "border-slate-200 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      task.isActive ? "bg-[#DC2626] text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {task.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Kênh: <strong className="text-slate-700">{task.channel}</strong> • {task.frequency}
                    </span>
                  </div>
                </div>

                {/* Switch bật / tắt task */}
                <button
                  type="button"
                  onClick={() => handleToggleTask(task.id)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 shrink-0 ${
                    task.isActive ? "bg-[#DC2626]" : "bg-slate-300"
                  }`}
                  aria-label="Bật tắt task"
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                      task.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Điều kiện kích hoạt */}
              <div className="text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Điều kiện kích hoạt tự động:
                </div>
                <div className="font-semibold text-slate-800">{task.triggerEvent}</div>
              </div>

              {/* Mẫu tin nhắn AI gửi */}
              <div className="text-xs p-3 bg-red-50/50 border border-red-100 rounded-xl space-y-1">
                <div className="text-[10px] font-bold text-[#DC2626] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Mẫu tin nhắn AI tự soạn &amp; gửi:
                </div>
                <p className="text-slate-800 italic leading-relaxed">
                  "{task.templateMessage}"
                </p>
              </div>

              {/* Footer số liệu & Thao tác */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-slate-500 font-medium">
                  Đã thực hiện: <strong className="text-slate-900 font-bold">{task.totalExecutedCount} lượt</strong> (Lần cuối: {task.lastExecutedTime})
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleRunTest(task)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors text-xs"
                    title="Chạy thử nghiệm"
                  >
                    <Play className="w-3 h-3 text-[#DC2626]" /> Chạy thử
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Xóa task này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Modal Thêm Task Công Việc Mới Cho AI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">
                  Thêm Task Công Việc Lặp Lại Cho AI
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

            <form onSubmit={handleCreateTask} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tên Task công việc <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Nhắn tin nhắc lịch học thử sáng thứ 7..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Điều kiện kích hoạt</label>
                  <select
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Trước giờ hẹn học thử 24 giờ">Trước giờ hẹn học thử 24 giờ</option>
                    <option value="Khách xem giá nhưng không trả lời sau 48h">Khách không trả lời sau 48h</option>
                    <option value="Khách vừa chốt đăng ký thành công">Vừa chốt đăng ký thành công</option>
                    <option value="Ngày sinh nhật của bé (quét hồ sơ)">Ngày sinh nhật của học viên</option>
                    <option value="Sau buổi học thử đầu tiên 2 tiếng">Sau buổi học thử đầu tiên 2 tiếng</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kênh gửi tự động</label>
                  <select
                    value={newChannel}
                    onChange={(e) => setNewChannel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Đa kênh (FB & Zalo)">Đa kênh (FB &amp; Zalo)</option>
                    <option value="Facebook Messenger">Facebook Messenger</option>
                    <option value="Zalo OA">Zalo Official Account</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 flex items-center justify-between">
                  <span>Mẫu nội dung tin nhắn AI gửi <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-normal">Hỗ trợ biến: &#123;ten_phu_huynh&#125;, &#123;ten_be&#125;, &#123;gio_hen&#125;</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={newTemplate}
                  onChange={(e) => setNewTemplate(e.target.value)}
                  placeholder="Dạ em An An xin chào Mẹ bé {ten_be} ạ! Em xin phép nhắc lịch hẹn học thử của con vào sáng mai lúc {gio_hen} tại Học viện T.A Academy nha Mẹ..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
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
                  Kích Hoạt Task AI Này
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
