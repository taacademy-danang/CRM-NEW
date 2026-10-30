"use client";

import React from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  BookOpen,
  GitPullRequest,
  CheckCircle2,
  PlayCircle,
  Layers,
  ArrowRight,
} from "lucide-react";

// Đã loại bỏ "Đánh giá AI" theo yêu cầu người dùng
const aiModules = [
  {
    title: "Cấu hình AI Fanpage",
    desc: "Đấu nối API Gemini/OpenAI và Webhooks Facebook Messenger",
    href: "/ai-training/config",
    icon: Bot,
    color: "bg-red-50 text-[#DC2626]",
  },
  {
    title: "Nhân cách AI (Persona)",
    desc: "Thiết lập xưng hô, phong thái và giọng điệu tư vấn",
    href: "/ai-training/persona",
    icon: Sparkles,
    color: "bg-red-50 text-[#DC2626]",
  },
  {
    title: "Kho kiến thức & RAG",
    desc: "Tải tài liệu PDF/DOCX, trích xuất chunks và duyệt dữ liệu",
    href: "/ai-training/knowledge",
    icon: BookOpen,
    color: "bg-red-50 text-[#DC2626]",
  },
  {
    title: "Kịch bản tư vấn chuẩn",
    desc: "Thiết kế luồng State Machine dẫn dắt khách hàng theo khóa học",
    href: "/ai-training/scenarios",
    icon: GitPullRequest,
    color: "bg-red-50 text-[#DC2626]",
  },
  {
    title: "Thư viện tình huống",
    desc: "Tập hợp câu trả lời chuẩn cho phụ huynh chê giá cao, bé nhút nhát",
    href: "/ai-training/situations",
    icon: Layers,
    color: "bg-red-50 text-[#DC2626]",
  },
  {
    title: "Đào tạo từ hội thoại",
    desc: "Tinh chỉnh câu trả lời AI từ tin nhắn thực tế của nhân viên",
    href: "/ai-training/conversation-training",
    icon: CheckCircle2,
    color: "bg-red-50 text-[#DC2626]",
  },
  {
    title: "Phòng thực hành AI (Playground)",
    desc: "Mô phỏng chat trực tiếp giữa Admin và AI trước khi đưa vào sản xuất",
    href: "/ai-training/playground",
    icon: PlayCircle,
    color: "bg-red-50 text-[#DC2626]",
  },
  {
    title: "Quản lý phiên bản AI",
    desc: "Theo dõi bản Draft, Active và hỗ trợ Rollback an toàn",
    href: "/ai-training/versions",
    icon: CheckCircle2,
    color: "bg-red-50 text-[#DC2626]",
  },
];

export default function AiTrainingCenterOverviewPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <Breadcrumb items={[{ label: "Trung tâm đào tạo AI", href: "/ai-training" }, { label: "Tổng quan" }]} />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-[#DC2626]" />
          <span>Trung Tâm Đào Tạo AI Tư Vấn Tuyển Sinh T.A Academy</span>
        </h1>
        <p className="text-xs text-slate-500">
          "Bộ não" tư vấn tự động thông minh: Giao tiếp chuẩn mực, am hiểu tâm lý phụ huynh, dẫn dắt chốt lịch và zero-hallucination về học phí.
        </p>
      </div>

      {/* Modules Grid - Màu đỏ tươi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aiModules.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.title}
              href={m.href}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className={`w-10 h-10 rounded-xl ${m.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#DC2626] transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#DC2626]">
                <span>Truy cập phân hệ</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
