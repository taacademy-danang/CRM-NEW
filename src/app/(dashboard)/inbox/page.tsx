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
  AlertCircle,
  Lock,
  Unlock,
  Smile,
  MoreVertical,
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
  studentName: string;
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
    course: "Model Kids Nâng Cao",
    studentName: "Bé Gia Hân (7 tuổi)",
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
    course: "Phong thái Doanh Nhân",
    studentName: "Nguyễn Hoàng Nam (Phụ huynh)",
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
    studentName: "Bé Trâm Anh (9 tuổi)",
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

    // Tự động chuyển human_takeover nếu nhân viên chủ động gửi tin
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
          {/* Header & Filter */}
          <div className="p-3.5 border-b border-slate-200 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Hội thoại tư vấn</h2>
              <span className="px-2 py-0.5 text-[11px] font-bold bg-rose-100 text-rose-800 rounded-full">
                {conversations.length} cuộc gọi/chat
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên, SĐT..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#8B1D2C]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setFilterChannel("all")}
                className={`px-2.5 py-1 rounded-lg font-semibold ${
                  filterChannel === "all"
                    ? "bg-[#8B1D2C] text-white"
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

          {/* List of items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((c) => {
              const isActive = c.id === activeConvId;
              return (
                <div
                  key={c.id}
                  onClick={() => setActiveConvId(c.id)}
                  className={`p-3 cursor-pointer transition-colors relative ${
                    isActive ? "bg-rose-50/70 border-l-4 border-[#8B1D2C]" : "hover:bg-slate-100/70"
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Avatar */}
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

                    {/* Content preview */}
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

                      {/* State Tags */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        {c.aiMode === "ai_auto" ? (
                          <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold rounded flex items-center gap-1">
                            <Bot className="w-2.5 h-2.5" /> AI đang chat
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-semibold rounded flex items-center gap-1">
                            <UserCheck className="w-2.5 h-2.5" /> Nhân viên tiếp quản
                          </span>
                        )}

                        {c.unread > 0 && (
                          <span className="ml-auto px-1.5 py-0.2 bg-red-600 text-white rounded-full text-[10px] font-bold">
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
          {/* Header Cửa Sổ Chat & Bộ Điều Khiển 5 Chế Độ AI */}
          <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#8B1D2C] text-white font-bold flex items-center justify-center text-xs shadow-xs">
                {activeConv.avatar}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">{activeConv.name}</h3>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded">
                    {activeConv.course}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2">
                  <span>SĐT: <strong className="text-slate-800">{activeConv.phone}</strong></span>
                  <span>•</span>
                  <span>Kênh: <strong className="capitalize">{activeConv.channel}</strong></span>
                </div>
              </div>
            </div>

            {/* AI CONTROLLER BUTTONS (5 CHẾ ĐỘ) */}
            <div className="flex items-center gap-2">
              {activeConv.aiMode === "ai_auto" ? (
                <button
                  type="button"
                  onClick={() => handleSetAiMode("human_takeover")}
                  className="px-3 py-1.5 bg-[#8B1D2C] hover:bg-[#721422] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
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

          {/* Lịch Sử Tin Nhắn */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8FAFC]">
            {/* Status notification bar */}
            <div className="flex justify-center">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-500 font-medium shadow-2xs">
                {activeConv.aiMode === "ai_auto"
                  ? "🤖 AI đang tự động tư vấn 24/7 theo Kho kiến thức T.A Academy"
                  : `🔒 Nhân viên ${activeConv.agentName || "Nguyễn Thị Lan"} đã tiếp quản hội thoại lúc 14:30`}
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
                      {isAi && <span className="font-bold text-rose-700 flex items-center gap-1"><Bot className="w-3 h-3" /> Trợ lý AI T.A</span>}
                      {isMe && <span className="font-bold text-slate-700 flex items-center gap-1"><UserCheck className="w-3 h-3" /> Tư vấn viên (Bạn)</span>}
                      {isCustomer && <span className="font-bold text-slate-600">{activeConv.name}</span>}
                      <span>• {m.time}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                        isMe
                          ? "bg-[#8B1D2C] text-white rounded-br-xs"
                          : isAi
                          ? "bg-gradient-to-r from-rose-900 to-[#721422] text-white rounded-br-xs border border-[#D4AF37]/30"
                          : "bg-white text-slate-800 rounded-bl-xs border border-slate-200"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* AI Copilot Suggestion Box (khi ở chế độ nhân viên tiếp quản) */}
            {activeConv.aiMode === "human_takeover" && (
              <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    AI Gợi ý câu trả lời nội bộ (Khách không nhìn thấy)
                  </span>
                  <button
                    type="button"
                    onClick={() => setInputMessage("Dạ học viện có lớp trải nghiệm miễn phí vào 9h sáng thứ 7 tuần này ạ. Em đăng ký cho bé Gia Hân tham gia nha Chị?")}
                    className="text-[11px] text-[#8B1D2C] font-bold hover:underline"
                  >
                    Dán vào khung chat
                  </button>
                </div>
                <p className="text-xs text-purple-950 italic bg-white p-2.5 rounded-xl border border-purple-100">
                  "Dạ học viện có lớp trải nghiệm miễn phí vào 9h sáng thứ 7 tuần này ạ. Em đăng ký cho bé Gia Hân tham gia nha Chị?"
                </p>
              </div>
            )}
          </div>

          {/* Form Nhập Tin Nhắn */}
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
                className="flex-1 py-2 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#8B1D2C]/20 focus:border-[#8B1D2C]"
              />

              <button
                type="submit"
                className="px-4 py-2 bg-[#8B1D2C] hover:bg-[#721422] text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Gửi
              </button>
            </div>
          </form>
        </div>

        {/* CỘT 3: HỒ SƠ KHÁCH HÀNG & HỌC VIÊN (W-72) */}
        <div className="w-72 border-l border-slate-200 flex flex-col shrink-0 bg-white p-4 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
              Hồ sơ phụ huynh
            </h3>
            <button
              type="button"
              className="p-1 text-slate-400 hover:text-slate-700"
              title="Chỉnh sửa hồ sơ"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Customer basic info */}
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-400 text-[11px]">Họ tên phụ huynh:</span>
              <p className="font-bold text-slate-800">{activeConv.name}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Số điện thoại:</span>
              <p className="font-mono font-bold text-slate-800">{activeConv.phone}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Học viên (Bé):</span>
              <p className="font-bold text-[#8B1D2C]">{activeConv.studentName}</p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Khóa học quan tâm:</span>
              <p className="font-semibold text-slate-800 bg-rose-50 text-[#8B1D2C] p-2 rounded-lg mt-0.5 border border-rose-100">
                {activeConv.course}
              </p>
            </div>
            <div>
              <span className="text-slate-400 text-[11px]">Trạng thái tuyển sinh:</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-purple-50 text-purple-700 font-semibold rounded text-[11px] border border-purple-200">
                {activeConv.status}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <a
              href={`/customers/${activeConv.id}`}
              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              Xem đầy đủ hồ sơ (6 khu vực)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
