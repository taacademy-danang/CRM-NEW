"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { PlayCircle, Send, Sparkles, RefreshCw, Bot, User, BookOpen } from "lucide-react";

export default function AiPlaygroundPage() {
  const [scenario, setScenario] = useState("SCENARIO_MODEL_KIDS");
  const [course, setCourse] = useState("Model Kids Nâng Cao");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Dạ em chào Chị ạ! Em là Trợ lý tuyển sinh tại Học viện T.A Academy. Em có thể hỗ trợ thông tin gì về khóa học cho Chị và bé hôm nay ạ?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let aiReply = "Dạ em cảm ơn Chị đã chia sẻ ạ! Tại T.A Academy, các giảng viên luôn chú trọng tạo môi trường vui vẻ để các con tự tin phát triển thể chất và dáng đi chuẩn. Em xin phép gửi Chị thời khóa biểu chi tiết nhé ạ!";
      if (currentInput.toLowerCase().includes("học phí") || currentInput.toLowerCase().includes("giá")) {
        aiReply = "Dạ học phí niêm yết chính thức của khóa Model Kids tại T.A Academy là 6.800.000 VNĐ cho khóa 12 buổi học tiêu chuẩn. Trong tháng này, học viện đang có chính sách ưu đãi tặng kèm 1 bộ trang phục diễn trị giá 1.500.000 VNĐ cho các bé đăng ký sớm ạ!";
      }

      setMessages((prev) => [...prev, { role: "assistant", text: aiReply }]);
      setIsTyping(false);
    }, 700);
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
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Phòng Thực Hành AI (Interactive Playground)
        </h1>
        <p className="text-xs text-slate-500">
          Môi trường mô phỏng: Quản trị viên đóng vai Phụ huynh để kiểm thử phản xạ và kiểm tra câu trả lời của AI trước khi đưa vào sản xuất.
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
              <option>Phong Thái Quý Cô</option>
              <option>Catwalk Chuyên Nghiệp</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            setMessages([
              {
                role: "assistant",
                text: "Dạ em chào Chị ạ! Em là Trợ lý tuyển sinh tại Học viện T.A Academy. Em có thể hỗ trợ thông tin gì về khóa học cho Chị và bé hôm nay ạ?",
              },
            ])
          }
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới phiên chat
        </button>
      </div>

      {/* Chat Simulation Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[460px]">
        {/* Messages */}
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
                      <Bot className="w-3 h-3 text-[#8B1D2C]" /> Trợ lý AI T.A Academy
                    </>
                  )}
                </div>
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    m.role === "user"
                      ? "bg-slate-800 text-white rounded-br-xs"
                      : "bg-[#8B1D2C] text-white rounded-bl-xs border border-[#D4AF37]/30"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="p-3 bg-white border border-slate-200 rounded-2xl text-xs text-slate-500 italic flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#8B1D2C] animate-spin" />
                AI đang suy nghĩ và truy xuất kho kiến thức RAG...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi thử thách AI (Ví dụ: 'Bé nhà chị 6 tuổi hơi gù lưng học lớp nào?', 'Học phí bao nhiêu?')..."
            className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]/20"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#8B1D2C] hover:bg-[#721422] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Gửi
          </button>
        </form>
      </div>
    </div>
  );
}
