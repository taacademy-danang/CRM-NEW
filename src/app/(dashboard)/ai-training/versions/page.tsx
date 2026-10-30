"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { CheckCircle2, RotateCcw, Clock, Sparkles, Layers } from "lucide-react";

export default function AiVersionsPage() {
  const [activeVersion, setActiveVersion] = useState("v2.2.0");

  const versions = [
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
  ];

  const handleRollback = (v: string) => {
    setActiveVersion(v);
    alert(`Đã rollback thành công về phiên bản ${v} trong vòng 2 giây!`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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
          Vòng đời phiên bản an toàn: Draft &gt; Test &gt; Active. Hỗ trợ khôi phục (Rollback) về phiên bản trước đó ngay lập tức khi phát hiện bất thường.
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
                  : "bg-white border-slate-200"
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
                <span className="text-slate-400 font-mono">Phát hành: {ver.releaseDate}</span>
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
    </div>
  );
}
