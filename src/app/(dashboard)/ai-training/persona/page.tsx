"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Sparkles, Save, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AiPersonaPage() {
  const [assistantName, setAssistantName] = useState("Trợ lý An An");
  const [addressingStyle, setAddressingStyle] = useState("Em - Mẹ bé / Ba bé (hoặc Em - Chị / Anh)");
  const [tone, setTone] = useState("Quý phái, ân cần, chuyên nghiệp, thấu cảm");
  const [maxTokens, setMaxTokens] = useState(350);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Trung tâm đào tạo AI", href: "/ai-training" },
              { label: "Nhân cách AI (Persona)" },
            ]}
          />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Thiết Lập Nhân Cách AI Tư Vấn Tuyển Sinh
          </h1>
          <p className="text-xs text-slate-500">
            Xác định phong cách giao tiếp, xưng hô lịch thiệp và ranh giới nghiệp vụ của Trợ lý AI T.A Academy
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#8B1D2C] hover:bg-[#721422] rounded-xl shadow-md transition-colors"
        >
          <Save className="w-4 h-4" />
          Lưu Nhân Cách AI
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Đã lưu cập nhật Nhân cách AI thành công!
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Tên Trợ lý AI</label>
            <input
              type="text"
              value={assistantName}
              onChange={(e) => setAssistantName(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Quy tắc xưng hô</label>
            <input
              type="text"
              value={addressingStyle}
              onChange={(e) => setAddressingStyle(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Phong cách &amp; Giọng điệu giao tiếp</label>
            <input
              type="text"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700">Độ dài câu trả lời tối đa (tokens)</label>
            <input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(Number(e.target.value))}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
            />
          </div>
        </div>

        {/* System Prompt Core */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#8B1D2C]" />
            System Prompt Lõi (Chỉ thị hành vi cốt lõi)
          </label>
          <textarea
            rows={8}
            defaultValue={`Bạn là Trợ lý tư vấn tuyển sinh An An của Học viện T.A Academy - Học viện chuyên đào tạo Phong thái, Catwalk và Model Kids hàng đầu.
Phong thái của bạn: Quý phái, nhã nhặn, tôn trọng, ân cần và thấu cảm sâu sắc nỗi trăn trở của cha mẹ về sự tự tin của con.
Quy tắc bất biến:
1. Mỗi câu chỉ hỏi 1 câu hỏi dẫn dắt (độ tuổi của bé, mong muốn của mẹ), không hỏi dồn dập.
2. Tuyệt đối không tự bịa đặt giá học phí hoặc đưa ra cam kết vượt thẩm quyền.
3. Khi phụ huynh đề cập đến lịch học đặc biệt hoặc muốn gặp trực tiếp ban giám đốc, hãy kích hoạt bàn giao cho tư vấn viên.`}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]/20"
          />
        </div>

        {/* Guardrails notice */}
        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-start gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Quy tắc bảo vệ thương hiệu bất biến:</div>
            <p className="mt-0.5 text-amber-800 leading-relaxed">
              AI tuyệt đối không được giả danh nhân viên người thật khi khách hỏi trực tiếp. AI phải giới thiệu mình là trợ lý tuyển sinh thông minh của học viện, sẵn sàng kết nối giảng viên chuyên trách bất cứ lúc nào.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
