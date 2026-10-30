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
  AlertTriangle,
  PlayCircle,
  Award,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

const aiModules = [
  {
    title: "Cấu hình AI Fanpage",
    desc: "Đấu nối API Gemini/OpenAI và Webhooks Facebook Messenger",
    href: "/ai-training/config",
    icon: Bot,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Nhân cách AI (Persona)",
    desc: "Thiết lập xưng hô, phong thái quý phái và giọng điệu tư vấn",
    href: "/ai-training/persona",
    icon: Sparkles,
    color: "bg-rose-50 text-rose-700",
  },
  {
    title: "Kho kiến thức & RAG",
    desc: "Tải tài liệu PDF/DOCX, trích xuất chunks và duyệt dữ liệu",
    href: "/ai-training/knowledge",
    icon: BookOpen,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Kịch bản tư vấn chuẩn",
    desc: "Thiết kế luồng State Machine dẫn dắt khách hàng theo khóa học",
    href: "/ai-training/scenarios",
    icon: GitPullRequest,
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    title: "Thư viện tình huống",
    desc: "Tập hợp câu trả lời chuẩn cho phụ huynh chê giá cao, bé nhút nhát",
    href: "/ai-training/situations",
    icon: Layers,
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "Phòng thực hành AI",
    desc: "Mô phỏng chat trực tiếp giữa Admin và AI trước khi đưa vào sản xuất",
    href: "/ai-training/playground",
    icon: PlayCircle,
    color: "bg-purple-50 text-purple-700",
  },
  {
    title: "Đánh giá năng lực AI",
    desc: "Chấm điểm 5 tiêu chí thang 100 điểm, loại trừ nghiêm ngặt khi sai giá",
    href: "/ai-training/evaluation",
    icon: Award,
    color: "bg-red-50 text-red-700",
  },
  {
    title: "Quản lý phiên bản AI",
    desc: "Theo dõi bản Draft, Active và hỗ trợ Rollback an toàn",
    href: "/ai-training/versions",
    icon: CheckCircle2,
    color: "bg-slate-100 text-slate-700",
  },
];

export default function AiTrainingCenterOverviewPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <Breadcrumb items={[{ label: "Trung tâm đào tạo AI", href: "/ai-training" }, { label: "Tổng quan" }]} />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Trung Tâm Đào Tạo AI Tư Vấn Tuyển Sinh T.A Academy
        </h1>
        <p className="text-xs text-slate-500">
          "Bộ não" tư vấn tự động thông minh: Giao tiếp chuẩn mực, am hiểu tâm lý phụ huynh, dẫn dắt chốt lịch và zero-hallucination về học phí.
        </p>
      </div>

      {/* 9 Modules Grid */}
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
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#8B1D2C] transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#8B1D2C]">
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
