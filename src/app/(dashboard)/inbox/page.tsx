"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  Search,
  Filter,
  Facebook,
  Bot,
  UserCheck,
  Send,
  Paperclip,
  Sparkles,
  Phone,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  Edit3,
} from "lucide-react";
import { AiConversationMode } from "@/types/inbox";

interface MockConversation {
  id: string;
  name: string;
  avatar: string;
  channel: "facebook" | "zalo";
  lastMessage: string;
  time: string;
  unread: number;
  aiMode: AiConversationMode;
  agentName?: string;
  phone?: string;
  course: string;
  status: string;
}

const mockConversations: MockConversation[] = [
  {
    id: "conv-1",
    name: "Phạm Thu Hương",
    avatar: "H",
    channel: "facebook",
    lastMessage: "Bé nhà em 7 tuổi hơi nhút nhát, bên mình có lớp Model Kids học thử không ạ?",
    time: "14:32",
    unread: 2,
    aiMode: "ai_auto",
    phone: "0988123456",
    course: "Model Kids (Mẫu Nhí Tài Năng)",
    status: "Đang tư vấn",
  },
  {
    id: "conv-2",
    name: "Nguyễn Hoàng Nam",
    avatar: "N",
    channel: "zalo",
    lastMessage: "Em gửi giúp anh học phí chi tiết khóa Phong thái Doanh nhân nhé.",
    time: "13:15",
    unread: 0,
    aiMode: "human_takeover",
    agentName: "Lê Minh Trang",
    phone: "0912345888",
    course: "Phong Thái Doanh Nhân",
    status: "Hẹn gọi lại",
  },
  {
    id: "conv-3",
    name: "Hoàng Kiều Trinh",
    avatar: "T",
    channel: "facebook",
    lastMessage: "Dạ em đã nhận được lịch học thử sáng thứ 7 rồi, cảm ơn học viện ạ!",
    time: "10:40",
    unread: 0,
    aiMode: "ai_auto",
    phone: "0909555666",
    course: "Catwalk Chuyên Nghiệp",
    status: "Hẹn học thử",
  },
];

export default function InboxPage() {
  const [conversations, setConversations] = useState<MockConversation[]>(mockConversations);
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "m-1",
      sender: "customer",
      text: "Chào học viện, em muốn tìm hiểu khóa học cho con gái em ạ.",
      time: "14:28",
    },
    {
      id: "m-2",
      sender: "ai",
      text: "Dạ em chào Chị Hương ạ! Em là trợ lý tư vấn tuyển sinh tại Học viện T.A Academy rất hân hạnh được đồng hành cùng Chị. Bé nhà mình năm nay được mấy tuổi rồi Chị ha, và mong muốn lớn nhất của Chị khi cho bé tham gia khóa học là gì ạ?",
      time: "14:29",
    },
    {
      id: "m-3",
      sender: "customer",
      text: "Bé nhà em 7 tuổi hơi nhút nhát, bên mình có lớp Model Kids học thử không ạ?",
      time: "14:32",
    },
  ]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  // Chuyển đổi 5 chế độ AI & Nhân viên
  const handleSetAiMode = (newMode: AiConversationMode) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConv.id
          ? {
              ...c,
              aiMode: newMode,
              agentName: newMode === "human_takeover" ? "Nguyễn Thị Lan" : c.agentName,
            }
          : c
      )
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: "human_agent",
      text: inputMessage,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");

    if (activeConv.aiMode === "ai_auto") {
      handleSetAiMode("human_takeover");
    }
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-3">
      <Breadcrumb
        items={[
          { label: "Tổng quan", href: "/" },
          { label: "Hộp thư tư vấn đa kênh" },
        ]}
      />

      {/* 3-Column Layout */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs flex overflow-hidden">
        {/* CỘT 1: DANH SÁCH HỘI THOẠI (W-80) */}
        <div className="w-80 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
          <div className="p-3.5 border-b border-slate-200 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Hội thoại tư vấn</h2>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-red-100 text-[#DC2626] rounded-full">
                {conversations.length} hội thoại
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên, SĐT..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#DC2626]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setFilterChannel("all")}
                className={`px-2.5 py-1 rounded-lg font-bold ${
                  filterChannel === "all"
                    ? "bg-[#DC2626] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setFilterChannel("facebook")}
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 ${
                  filterChannel === "facebook"
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Facebook className="w-3 h-3" /> Facebook
              </button>
              <button
                type="button"
                onClick={() => setFilterChannel("zalo")}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  filterChannel === "zalo"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Zalo
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((c) => {
              const isActive = c.id === activeConvId;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`p-3 cursor-pointer transition-colors relative ${
                    isActive ? "bg-red-50/70 border-l-4 border-[#DC2626]" : "hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {c.avatar}
                      </div>
                      <span className="absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full bg-white shadow-xs">
                        {c.channel === "facebook" ? (
                          <Facebook className="w-3 h-3 text-blue-600" />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-blue-500 text-white text-[8px] flex items-center justify-center font-bold">
                            Z
                          </div>
                        )}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {c.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{c.time}</span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {c.lastMessage}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1.5">
                        {c.aiMode === "ai_auto" ? (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold rounded flex items-center gap-1">
                            <Bot className="w-2.5 h-2.5" /> AI đang chat
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-red-50 text-[#DC2626] border border-red-200 text-[10px] font-semibold rounded flex items-center gap-1">
                            <UserCheck className="w-2.5 h-2.5" /> Nhân viên tiếp quản
                          </span>
                        )}

                        {c.unread > 0 && (
                          <span className="ml-auto px-1.5 py-0.2 bg-[#DC2626] text-white rounded-full text-[10px] font-bold">
                            {c.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CỘT 2: CỬA SỔ CHAT CHÍNH (FLEX-1) */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#DC2626] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {activeConv.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">{activeConv.name}</h3>
                  <span className="px-2 py-0.5 bg-red-50 text-[#DC2626] border border-red-100 text-[10px] font-bold rounded">
                    {activeConv.course}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>SĐT: <strong className="text-slate-800 font-mono">{activeConv.phone}</strong></span>
                  <span>•</span>
                  <span>Kênh: <strong className="capitalize">{activeConv.channel}</strong></span>
                </div>
              </div>
            </div>

            {/* AI CONTROLLER BUTTONS */}
            <div className="flex items-center gap-2">
              {activeConv.aiMode === "ai_auto" ? (
                <button
                  type="button"
                  onClick={() => handleSetAiMode("human_takeover")}
                  className="px-3 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Tiếp Quản (Tắt AI Gửi Tự Động)
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSetAiMode("ai_auto")}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  Trả Quyền Cho AI Tư Vấn
                </button>
              )}

              <button
                type="button"
                onClick={() => handleSetAiMode("ai_copilot")}
                className={`px-3 py-1.5 border rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors ${
                  activeConv.aiMode === "ai_copilot"
                    ? "bg-purple-100 border-purple-300 text-purple-800 font-bold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                AI Gợi Ý Nội Bộ
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8FAFC]">
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-500 font-medium shadow-2xs">
                {activeConv.aiMode === "ai_auto"
                  ? "🤖 AI đang tự động tư vấn 24/7 theo Kho kiến thức T.A Academy"
                  : `🔒 Nhân viên ${activeConv.agentName || "Nguyễn Thị Lan"} đã tiếp quản hội thoại`}
              </span>
            </div>

            {messages.map((m) => {
              const isMe = m.sender === "human_agent";
              const isAi = m.sender === "ai";
              const isCustomer = m.sender === "customer";

              return (
                <div
                  key={m.id}
                  className={`flex ${isMe || isAi ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-md space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                      {isAi && <span className="font-bold text-[#DC2626] flex items-center gap-1"><Bot className="w-3 h-3" /> Trợ lý AI T.A</span>}
                      {isMe && <span className="font-bold text-slate-700 flex items-center gap-1"><UserCheck className="w-3 h-3" /> Tư vấn viên (Bạn)</span>}
                      {isCustomer && <span className="font-bold text-slate-600">{activeConv.name}</span>}
                      <span>• {m.time}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? "bg-[#DC2626] text-white rounded-br-xs font-medium"
                          : isAi
                          ? "bg-slate-900 text-white rounded-br-xs border border-slate-800"
                          : "bg-white text-slate-800 rounded-bl-xs border border-slate-200 font-medium"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {activeConv.aiMode === "human_takeover" && (
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    AI Gợi ý câu trả lời nội bộ (Khách không nhìn thấy)
                  </span>
                  <button
                    type="button"
                    onClick={() => setInputMessage("Dạ học viện có lớp trải nghiệm miễn phí vào 9h sáng thứ 7 tuần này ạ. Em đăng ký cho bé tham gia nha Chị?")}
                    className="text-[11px] text-[#DC2626] font-bold hover:underline"
                  >
                    Dán vào khung chat
                  </button>
                </div>
                <p className="text-xs text-purple-950 italic bg-white p-2.5 rounded-xl border border-purple-100">
                  "Dạ học viện có lớp trải nghiệm miễn phí vào 9h sáng thứ 7 tuần này ạ. Em đăng ký cho bé tham gia nha Chị?"
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                title="Đính kèm hình ảnh"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Nhập tin nhắn tư vấn gửi khách hàng..."
                className="flex-1 py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Gửi
              </button>
            </div>
          </form>
        </div>

        {/* CỘT 3: THÔNG TIN TƯ VẤN (W-72) */}
        <div className="w-72 border-l border-slate-200 flex flex-col shrink-0 bg-white p-4 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Thông tin tư vấn
            </h3>
            <button
              type="button"
              className="p-1 text-slate-400 hover:text-slate-700"
              title="Chỉnh sửa thông tin"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400 text-[11px]">Họ tên khách:</span>
              <p className="font-bold text-slate-800">{activeConv.name}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Số điện thoại:</span>
              <p className="font-mono font-bold text-slate-800">{activeConv.phone}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Khóa học quan tâm:</span>
              <p className="font-bold text-[#DC2626] bg-red-50 p-2 rounded-lg mt-0.5 border border-red-100">
                {activeConv.course}
              </p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Trạng thái tư vấn:</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-purple-50 text-purple-700 font-bold rounded text-[11px] border border-purple-200">
                {activeConv.status}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-2">
            <a
              href="/consultations"
              className="w-full py-2 px-3 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-bold text-[#DC2626] flex items-center justify-center gap-1.5 transition-colors"
            >
              Mở danh sách tiếp nhận tư vấn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
