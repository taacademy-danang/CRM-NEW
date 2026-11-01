"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { PlayCircle, Send, Sparkles, RefreshCw, Bot, User, BookOpen, ShieldCheck } from "lucide-react";

interface PlaygroundMessage {
  role: "user" | "assistant";
  text: string;
  ragSource?: string;
}

interface ScenarioOption {
  code: string;
  title: string;
}

export default function AiPlaygroundPage() {
  const [scenariosList, setScenariosList] = useState<ScenarioOption[]>([]);
  const [scenario, setScenario] = useState("");
  const [course, setCourse] = useState("Model Kids (Mẫu Nhí)");
  const [messages, setMessages] = useState<PlaygroundMessage[]>([
    {
      role: "assistant",
      text: "Dạ em Tiểu Mỹ xin chào Chị ạ! Em là Trợ lý AI tại Học viện T.A Academy. Em có thể hỗ trợ thông tin gì về các khóa học cho Chị và bé hôm nay ạ? ✨",
      ragSource: "Nhân cách AI Tiểu Mỹ",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    fetch("/api/ai/scenarios")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && Array.isArray(json.data)) {
          setScenariosList(json.data);
          if (json.data.length > 0) {
            setScenario(json.data[0].code);
          }
        }
      })
      .catch(() => {});
  }, []);

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
            text: "Dạ em Tiểu Mỹ đang kết nối lại hệ thống dữ liệu, Chị vui lòng nhắn lại giúp em nha!",
            ragSource: "Fallback",
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Dạ em Tiểu Mỹ xin lỗi vì sự gián đoạn mạng, Chị hỏi lại giúp em nhé ạ!",
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
          Môi trường mô phỏng thực chiến: Đóng vai Phụ huynh để thử thách và kiểm tra độ nhạy bén, tính chuẩn xác của AI Tiểu Mỹ trước khi kích hoạt ra ngoài Fanpage.
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
              {scenariosList.length === 0 ? (
                <option value="">Chưa có kịch bản (Đào tạo từ đầu)</option>
              ) : (
                scenariosList.map((sc) => (
                  <option key={sc.code} value={sc.code}>
                    {sc.title}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Khóa học quan tâm</label>
            <select
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800"
            >
              <option>Model Kids (Mẫu Nhí Tài Năng)</option>
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
                text: "Dạ em Tiểu Mỹ xin chào Chị ạ! Em là Trợ lý AI tại Học viện T.A Academy. Em có thể hỗ trợ thông tin gì về các khóa học cho Chị và bé hôm nay ạ? ✨",
                ragSource: "Nhân cách AI Tiểu Mỹ",
              },
            ])
          }
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Làm mới phiên chat
        </button>
      </div>

      {/* Quick Testing Suggestions */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-bold whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Thử câu hỏi mẫu:
        </span>
        {sampleQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-3 py-1 rounded-full bg-slate-100 hover:bg-red-50 hover:text-[#DC2626] border border-slate-200 text-slate-600 whitespace-nowrap transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Simulation Area */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px]">
        {/* Chat History */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex gap-3 max-w-[85%] ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  msg.role === "user" ? "bg-slate-800" : "bg-[#DC2626]"
                }`}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-1">
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-slate-900 text-white rounded-tr-xs"
                      : "bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.ragSource && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-400 px-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Nguồn: {msg.ragSource}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-[85%] mr-auto">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#DC2626] text-white shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-100 p-3.5 rounded-2xl rounded-tl-xs border border-slate-200 text-slate-500 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span>Tiểu Mỹ đang tư duy và tra cứu dữ liệu...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleFormSubmit} className="p-4 border-t border-slate-100 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập câu hỏi để thử thách AI Tiểu Mỹ (ví dụ: Bé 7 tuổi nhút nhát học lớp nào?)..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="px-5 py-2.5 bg-[#DC2626] hover:bg-[#b91c1c] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-red-500/20"
          >
            <Send className="w-4 h-4" /> Gửi
          </button>
        </form>
      </div>
    </div>
  );
}
