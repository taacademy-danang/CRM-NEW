"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Sparkles, Save, CheckCircle2, ShieldAlert, Check } from "lucide-react";

export default function AiPersonaPage() {
  const [assistantName, setAssistantName] = useState("Trợ lý An An");
  const [addressingStyle, setAddressingStyle] = useState("Em - Mẹ bé / Ba bé (hoặc Em - Chị / Anh)");
  const [tone, setTone] = useState("Tươi tắn, ân cần, chuyên nghiệp, thấu cảm, đậm chất phong thái");
  const [maxTokens, setMaxTokens] = useState(350);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [rules, setRules] = useState<string[]>([]);
  const [forbidden, setForbidden] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ai/persona")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setAssistantName(json.data.assistantName || "Trợ lý An An");
          setAddressingStyle(json.data.addressingStyle || "");
          setTone(json.data.tone || "");
          setMaxTokens(json.data.maxTokens || 350);
          setSystemPrompt(json.data.systemPrompt || "");
          setRules(json.data.rules || []);
          setForbidden(json.data.forbidden || []);
        }
      })
      .catch((err) => console.error("Lỗi tải persona:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/ai/persona", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assistantName,
          addressingStyle,
          tone,
          maxTokens,
          systemPrompt,
          rules,
          forbidden,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      alert("Không thể lưu nhân cách AI");
    }
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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#DC2626]" />
            <span>Thiết Lập Nhân Cách AI Tư Vấn Tuyển Sinh</span>
          </h1>
          <p className="text-xs text-slate-500">
            Xác định phong cách giao tiếp, xưng hô lịch thiệp và ranh giới nghiệp vụ của Trợ lý AI T.A Academy
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-colors active:scale-95"
        >
          <Save className="w-4 h-4" />
          Lưu Nhân Cách AI
        </button>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Đã lưu cập nhật Nhân cách &amp; Chỉ thị lõi cho AI An An thành công!
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
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
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
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono"
            />
          </div>
        </div>

        {/* System Prompt Core */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <label className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#DC2626]" />
            System Prompt Lõi (Chỉ thị hành vi cốt lõi)
          </label>
          <textarea
            rows={8}
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
          />
        </div>

        {/* Rules & Forbidden */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Quy tắc tư vấn bắt buộc tuân thủ:
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-800/90 list-disc list-inside">
              {rules.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl space-y-2 text-xs text-red-900">
            <h4 className="font-bold flex items-center gap-1.5 text-[#DC2626]">
              <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
              Hành vi tối kỵ (Cấm tuyệt đối):
            </h4>
            <ul className="space-y-1.5 text-xs text-red-800 list-disc list-inside">
              {forbidden.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
