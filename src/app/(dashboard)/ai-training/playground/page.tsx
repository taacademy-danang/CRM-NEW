"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { PlayCircle, Send, Sparkles, RefreshCw, Bot, User, BookOpen, ShieldCheck } from "lucide-react";

interface PlaygroundMessage {
  role: "user" | "assistant";
  text: string;
  ragSource?: string;
}

export default function AiPlaygroundPage() {
  const [scenario, setScenario] = useState("SCENARIO_MODEL_KIDS");
  const [course, setCourse] = useState("Model Kids Nâng Cao");
  const [messages, setMessages] = useState<PlaygroundMessage[]>([
    {
      role: "assistant",
      text: "Dạ em An An xin chào Chị ạ! Em là Trợ lý tuyển sinh tại Học viện T.A Academy. Em có thể hỗ trợ thông tin gì về khóa học cho Chị và bé hôm nay ạ?",
      ragSource: "System Persona",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sampleQuestions = [
    "Bé nhà chị 7 tuổi hơi nhút nhát, lưng đi hơi gù thì học lớp nào?",
    "Học phí khóa Model Kids là bao nhiêu tiền vậy em?",
    "Học phí bên em cao hơn trung tâm khác nhiều thế?",
    "Chị chưa muốn cho số điện thoại đâu em ơi",
    "Bên mình có lớp học thử trải nghiệm cuối tuần không?",
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMsg: PlaygroundMessage = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/playground", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage: textToSend,
          scenarioCode: scenario,
          course,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: json.data.reply,
            ragSource: "Kho Kiến Thức RAG & Persona Đã Phê Duyệt",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text: "Dạ em An An đang kết nối lại hệ thống dữ liệu, Chị vui lòng nhắn lại giúp em nha!",
            ragSource: "Fallback",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Dạ em An An xin lỗi vì sự gián đoạn mạng, Chị hỏi lại giúp em nhé ạ!",
          ragSource: "Error",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <Breadcrumb
          items={[
            { label: "Trung tâm đào tạo AI", href: "/ai-training" },
            { label: "Phòng thực hành AI (Playground)" },
          ]}
        />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <PlayCircle className="w-6 h-6 text-[#DC2626]" />
          <span>Phòng Thực Hành AI (Interactive Playground)</span>
        </h1>
        <p className="text-xs text-slate-500">
          Môi trường mô phỏng thực chiến: Đóng vai Phụ huynh để thử thách và kiểm tra độ nhạy bén, tính chuẩn xác của AI trước khi kích hoạt ra ngoài Fanpage.
        </p>
      </div>

      {/* Control Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Kịch bản thử nghiệm</label>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
            >
              <option value="SCENARIO_MODEL_KIDS">Tư vấn khóa Model Kids (Mẫu nhí)</option>
              <option value="SCENARIO_PHONG_THAI">Tư vấn Phong Thái Doanh Nhân</option>
              <option value="SCENARIO_TUITION_INQUIRY">Khách hỏi học phí</option>
              <option value="SCENARIO_HIGH_PRICE_OBJECTION">Khách chê giá cao</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Khóa học quan tâm</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
            >
              <option>Model Kids Nâng Cao</option>
              <option>Phong Thái Quý Cô &amp; Doanh Nhân</option>
              <option>Catwalk Chuyên Nghiệp</option>
              <option>Nghệ Thuật Giao Tiếp &amp; Thuyết Trình</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setMessages([
              {
                role: "assistant",
                text: "Dạ em An An xin chào Chị ạ! Em là Trợ lý tuyển sinh tại Học viện T.A Academy. Em có thể hỗ trợ thông tin gì về khóa học cho Chị và bé hôm nay ạ?",
                ragSource: "System Persona",
              },
            ])
          }
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới phiên chat
        </button>
      </div>

      {/* Quick Testing Suggestions */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#DC2626]" /> Thử nhanh:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-lg text-[11px] text-slate-700 hover:text-[#DC2626] font-medium transition-colors shadow-2xs"
          >
            "{q}"
          </button>
        ))}
      </div>

      {/* Chat Simulation Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[480px]">
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/60">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-md space-y-1">
                <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                  {m.role === "user" ? (
                    <>
                      <User className="w-3 h-3 text-slate-600" /> Bạn (Đóng vai Phụ huynh)
                    </>
                  ) : (
                    <>
                      <Bot className="w-3 h-3 text-[#DC2626]" /> AI An An (T.A Academy)
                      {m.ragSource && (
                        <span className="ml-1 px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-semibold flex items-center gap-0.5">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" /> {m.ragSource}
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    m.role === "user"
                      ? "bg-slate-900 text-white rounded-br-xs font-medium"
                      : "bg-[#DC2626] text-white rounded-bl-xs font-medium"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-600 italic flex items-center gap-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#DC2626] animate-spin" />
                AI An An đang đối chiếu Kho kiến thức RAG và Thư viện tình huống...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi thử thách AI (Ví dụ: 'Bé nhà chị 7 tuổi hơi nhút nhát...', 'Học phí bao nhiêu?')..."
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" /> Gửi
          </button>
        </form>
      </div>
    </div>
  );
}
