"use client";

import React from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { MessageSquare, Check, X, ThumbsUp, ThumbsDown, ArrowUpRight } from "lucide-react";

export default function AiConversationTrainingPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <Breadcrumb
          items={[
            { label: "Trung tâm đào tạo AI", href: "/ai-training" },
            { label: "Đào tạo từ hội thoại thực tế" },
          ]}
        />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Đào Tạo &amp; Tinh Chỉnh AI Từ Hội Thoại Thực Tế
        </h1>
        <p className="text-xs text-slate-500">
          Các tin nhắn AI được nhân viên gắn nhãn: Tốt, Chưa tự nhiên, Sai kiến thức, Nhân viên đã sửa. Quản trị viên xét duyệt để đưa vào dữ liệu huấn luyện mới.
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">
              Hội thoại với Phụ huynh: Lê Mai Phương (Fanpage)
            </span>
            <span className="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 text-[11px]">
              Chưa tự nhiên (Nhân viên đã sửa)
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
            <span className="text-[10px] font-bold text-slate-400">Câu hỏi của khách:</span>
            <p className="text-slate-700 italic">"Con chị 5 tuổi có tham gia khóa Catwalk được không em?"</p>
          </div>

          <div className="p-3 bg-rose-50/50 rounded-xl text-xs border border-rose-100 space-y-1">
            <span className="text-[10px] font-bold text-[#8B1D2C]">Câu trả lời cũ của AI:</span>
            <p className="text-slate-800">"Dạ khóa Catwalk dành cho người lớn từ 15 tuổi trở lên ạ, bé 5 tuổi không học được đâu Chị."</p>
          </div>

          <div className="p-3 bg-emerald-50/50 rounded-xl text-xs border border-emerald-100 space-y-1">
            <span className="text-[10px] font-bold text-emerald-700">Câu sửa lại của Tư vấn viên (Nguyễn Thị Lan):</span>
            <p className="text-slate-800 font-semibold">
              "Dạ đối với các bé 5 tuổi, T.A Academy có khóa Model Kids (Mẫu nhí tài năng) được thiết kế riêng với các bài tập giải phóng hình thể và bước đi catwalk phù hợp thể chất lứa tuổi của con ạ. Em giới thiệu chi tiết khóa Model Kids cho Mẹ nha?"
            </p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" /> Duyệt Thành Mẫu Đào Tạo AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
