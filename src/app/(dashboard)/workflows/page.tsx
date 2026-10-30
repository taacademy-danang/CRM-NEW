"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  GitFork,
  Play,
  Plus,
  Trash2,
  ArrowDown,
  Clock,
  Bell,
  Sparkles,
  UserCheck,
  CheckCircle2,
  GripVertical,
  HelpCircle,
  Save,
  RotateCcw,
} from "lucide-react";

interface WorkflowNode {
  id: string;
  type: "trigger" | "condition" | "assign" | "ai_action" | "wait" | "notify" | "transition";
  title: string;
  desc: string;
  config: string;
  color: string;
}

const initialWorkflow: WorkflowNode[] = [
  {
    id: "step-1",
    type: "trigger",
    title: "1. Khối Khởi Động (Trigger)",
    desc: "Tiếp nhận tin nhắn mới từ Facebook Messenger hoặc Zalo OA",
    config: "Kênh: Facebook & Zalo • Điều kiện: Tin nhắn đầu tiên",
    color: "border-blue-500 bg-blue-50/70 text-blue-900",
  },
  {
    id: "step-2",
    type: "condition",
    title: "2. Khối Điều Kiện (Condition)",
    desc: "Kiểm tra khách hàng đã cung cấp Số Điện Thoại hay chưa?",
    config: "Đúng (Có SĐT) -> Nhánh A | Sai (Chưa có SĐT) -> Nhánh B",
    color: "border-purple-500 bg-purple-50/70 text-purple-900",
  },
  {
    id: "step-3",
    type: "assign",
    title: "3. Khối Phân Bổ (Assign)",
    desc: "Tự động phân công cho Tư vấn viên theo cơ chế xoay vòng (Round Robin)",
    config: "Nhóm: Tuyển sinh Phong thái & Model Kids • Phân bổ đều",
    color: "border-indigo-500 bg-indigo-50/70 text-indigo-900",
  },
  {
    id: "step-4",
    type: "wait",
    title: "4. Khối Thời Gian Chờ SLA (Wait)",
    desc: "Bắt đầu đếm ngược thời gian chờ gọi điện: 15 phút (Cảnh báo vàng) & 60 phút (Đỏ)",
    config: "Thời gian: 15 phút & 60 phút • Ràng buộc Call Log",
    color: "border-amber-500 bg-amber-50/70 text-amber-900",
  },
  {
    id: "step-5",
    type: "notify",
    title: "5. Khối Cảnh Báo (Notify)",
    desc: "Nếu sau 15 phút chưa có cuộc gọi xác nhận, kích hoạt chuông cảnh báo Dashboard",
    config: "Kênh: Web Push & Chuông cảnh báo trên Topbar",
    color: "border-red-500 bg-red-50/70 text-red-900",
  },
  {
    id: "step-6",
    type: "transition",
    title: "6. Khối Chuyển Trạng Thái (Transition)",
    desc: "Cập nhật trạng thái khách hàng sang 'Khách Chưa Gọi (Ưu Tiên Cao)'",
    config: "Trạng thái mới: uncalled (Priority Queue)",
    color: "border-emerald-500 bg-emerald-50/70 text-emerald-900",
  },
];

const availablePaletteBlocks: Array<{
  type: WorkflowNode["type"];
  title: string;
  desc: string;
  config: string;
  color: string;
}> = [
  {
    type: "ai_action",
    title: "Khối AI Hành Động (AI Action)",
    desc: "AI tự động trả lời 24/7 theo Kho kiến thức chuẩn",
    config: "Model: Gemini 1.5 Flash • Persona: An An",
    color: "border-rose-500 bg-rose-50/70 text-rose-900",
  },
  {
    type: "condition",
    title: "Khối Điều Kiện (Ngoài Giờ Làm Việc)",
    desc: "Kiểm tra thời gian sau 21:00 hoặc trước 08:00 sáng",
    config: "Giờ: Ngoài 08:00 - 21:00",
    color: "border-purple-500 bg-purple-50/70 text-purple-900",
  },
  {
    type: "notify",
    title: "Khối Báo Chuông Nhân Viên (Notify Staff)",
    desc: "Gửi thông báo âm thanh và pop-up tiếp quản tức thì",
    config: "Âm thanh: Priority Ping",
    color: "border-red-500 bg-red-50/70 text-red-900",
  },
];

export default function WorkflowsBuilderPage() {
  const [steps, setSteps] = useState<WorkflowNode[]>(initialWorkflow);
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSimIndex, setActiveSimIndex] = useState<number | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Kéo đẩy di chuyển vị trí các khối
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...steps];
    const temp = newSteps[index - 1];
    newSteps[index - 1] = newSteps[index];
    newSteps[index] = temp;
    setSteps(newSteps);
  };

  const handleMoveDown = (index: number) => {
    if (index === steps.length - 1) return;
    const newSteps = [...steps];
    const temp = newSteps[index + 1];
    newSteps[index + 1] = newSteps[index];
    newSteps[index] = temp;
    setSteps(newSteps);
  };

  const handleDeleteStep = (id: string) => {
    setSteps(steps.filter((s) => s.id !== id));
  };

  const handleAddFromPalette = (block: typeof availablePaletteBlocks[0]) => {
    const newBlock: WorkflowNode = {
      id: `step-${Date.now()}`,
      type: block.type,
      title: `${steps.length + 1}. ${block.title}`,
      desc: block.desc,
      config: block.config,
      color: block.color,
    };
    setSteps([...steps, newBlock]);
  };

  // Mô phỏng chạy thử nghiệm các khối quy trình
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setActiveSimIndex(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < steps.length) {
        setActiveSimIndex(current);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSimulating(false);
          setActiveSimIndex(null);
        }, 800);
      }
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Tổng quan", href: "/" },
              { label: "Quy trình tư vấn (Workflow Builder)" },
            ]}
          />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <GitFork className="w-6 h-6 text-[#DC2626]" />
            <span>Quy Trình Tư Vấn Tuyển Sinh Dạng Khối Kéo Đẩy</span>
          </h1>
          <p className="text-xs text-slate-500">
            Tùy biến các khối quy trình tự động: Khởi động (Trigger) &gt; Điều kiện (Condition) &gt; Phân bổ (Assign) &gt; Chờ SLA &gt; Cảnh báo &gt; Chuyển trạng thái.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isSimulating}
            onClick={handleRunSimulation}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current text-emerald-400" />
            {isSimulating ? "Đang chạy thử nghiệm..." : "Chạy Thử Nghiệm Workflow"}
          </button>

          <button
            type="button"
            onClick={() => {
              setSavedSuccess(true);
              setTimeout(() => setSavedSuccess(false), 2500);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            Lưu Quy Trình
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Đã lưu cấu trúc các khối quy trình tư vấn thành công!
        </div>
      )}

      {/* 2. Main 2-Column Canvas: Visual Blocks & Palette */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CỘT TRÁI (8 COLS): KHUNG QUY TRÌNH KÉO ĐẨY (WORKFLOW CANVAS) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <span className="font-bold text-xs text-slate-800">
                Luồng Các Khối Đang Hoạt Động ({steps.length} khối liên kết)
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                Sử dụng mũi tên ↑ ↓ để kéo đẩy thay đổi thứ tự thực thi
              </span>
            </div>

            {/* Sequence of Drag & Drop / Re-orderable Blocks */}
            <div className="space-y-3">
              {steps.map((step, idx) => {
                const isHighlight = activeSimIndex === idx;

                return (
                  <React.Fragment key={step.id}>
                    <div
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 relative ${step.color} ${
                        isHighlight
                          ? "ring-4 ring-emerald-400 scale-[1.02] shadow-lg bg-emerald-50"
                          : "shadow-xs hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Drag indicator & Title */}
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col gap-1 text-slate-400 mt-0.5">
                            <button
                              type="button"
                              onClick={() => handleMoveUp(idx)}
                              disabled={idx === 0}
                              className="hover:text-slate-900 disabled:opacity-20 font-bold text-xs"
                              title="Đẩy lên"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveDown(idx)}
                              disabled={idx === steps.length - 1}
                              className="hover:text-slate-900 disabled:opacity-20 font-bold text-xs"
                              title="Đẩy xuống"
                            >
                              ▼
                            </button>
                          </div>

                          <div className="space-y-1">
                            <h4 className="font-bold text-sm tracking-tight text-slate-900">
                              {step.title}
                            </h4>
                            <p className="text-xs text-slate-700 font-medium">
                              {step.desc}
                            </p>
                            <div className="text-[11px] text-slate-500 font-mono bg-white/70 px-2 py-0.5 rounded-md inline-block border border-slate-200">
                              {step.config}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isHighlight && (
                            <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold animate-pulse">
                              Đang thực thi...
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteStep(step.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                            title="Xóa khối này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Connecting Connector Arrow between blocks */}
                    {idx < steps.length - 1 && (
                      <div className="flex justify-center py-0.5">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-600 shadow-2xs">
                          <ArrowDown className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (4 COLS): KHO KHỐI CÓ THỂ THÊM VÀO (BLOCK PALETTE) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2.5 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#DC2626]" />
              <span>Kho Khối Quy Trình Có Thể Thêm</span>
            </h3>
            <p className="text-xs text-slate-500">
              Bấm vào khối để nối tiếp vào luồng quy trình đang chạy.
            </p>

            <div className="space-y-3 pt-1">
              {availablePaletteBlocks.map((block, idx) => (
                <div
                  key={idx}
                  onClick={() => handleAddFromPalette(block)}
                  className={`p-3.5 rounded-xl border-2 ${block.color} cursor-pointer hover:shadow-md transition-all active:scale-95 space-y-1`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{block.title}</span>
                    <span className="text-[10px] font-bold text-[#DC2626] bg-white px-2 py-0.5 rounded shadow-2xs">
                      + Thêm khối
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{block.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hướng Dẫn Vận Hành */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-[#DC2626]" />
              <span>Nguyên tắc vận hành khối SLA:</span>
            </div>
            <p className="leading-relaxed">
              Khối <strong>Chờ SLA</strong> luôn được liên kết trực tiếp với bảng <code>call_logs</code>. Khi tư vấn viên bấm gọi và xác nhận kết quả, khối này sẽ tự động ngắt chuông cảnh báo và đưa khách ra khỏi hàng đợi ưu tiên.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
