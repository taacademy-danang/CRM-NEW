"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CallLogModal from "@/components/dashboard/CallLogModal";
import { Customer } from "@/types/crm";
import {
  Search,
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
  GraduationCap,
  RefreshCw,
  Check,
  ChevronRight,
  User,
  Zap,
} from "lucide-react";
import { AiConversationMode } from "@/types/inbox";

export interface ConversationItem {
  id: string;
  name: string;
  avatar: string;
  channel: "facebook" | "zalo" | "website";
  lastMessage: string;
  time: string;
  unread: number;
  aiMode: AiConversationMode;
  agentName?: string;
  phone?: string;
  phoneAutoExtracted: boolean;
  course: string;
  courseCategory: "model_kids" | "phong_thai" | "catwalk" | "giao_tiep";
  status: string;
  aiExtractedNeed: string;
  elearningStatus: "synced" | "not_enrolled";
}

interface MessageItem {
  id: string;
  conversation_id: string;
  sender_type: "customer" | "ai" | "human_agent" | "system";
  sender_name?: string | null;
  content: string;
  created_at: string;
}

export default function InboxPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>("conv-1");
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [copilotSuggestion, setCopilotSuggestion] = useState<string | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Call Modal State
  const [selectedCustomerForCall, setSelectedCustomerForCall] = useState<Customer | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Tải danh sách hội thoại
  const fetchConversations = async () => {
    try {
      setLoadingConv(true);
      const params = new URLSearchParams();
      if (filterChannel !== "all") params.set("channel", filterChannel);
      if (searchTerm) params.set("search", searchTerm);

      const res = await fetch(`/api/inbox/conversations?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data.length > 0) {
          setConversations(json.data);
          if (!activeConvId || !json.data.some((c: any) => c.id === activeConvId)) {
            setActiveConvId(json.data[0].id);
          }
        }
      }
    } catch (err) {
      console.error("Lỗi tải hội thoại:", err);
    } finally {
      setLoadingConv(false);
    }
  };

  // 2. Tải tin nhắn của hội thoại đang chọn
  const fetchMessages = async (convId: string) => {
    try {
      setLoadingMessages(true);
      const res = await fetch(`/api/inbox/messages?conversationId=${convId}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setMessages(json.data);
        }
      }
    } catch (err) {
      console.error("Lỗi tải tin nhắn:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(() => {
      fetchConversations();
    }, 6000);
    return () => clearInterval(interval);
  }, [filterChannel]);

  useEffect(() => {
    if (activeConvId) {
      fetchMessages(activeConvId);
      setCopilotSuggestion(null);
      const msgInterval = setInterval(() => {
        fetchMessages(activeConvId);
      }, 5000);
      return () => clearInterval(msgInterval);
    }
  }, [activeConvId]);

  const activeConv = conversations.find((c) => c.id === activeConvId) || conversations[0];

  // 3. Đổi chế độ AI & Nhân viên (Human Takeover, AI Auto, Copilot)
  const handleSetAiMode = async (newMode: AiConversationMode) => {
    if (!activeConv) return;
    try {
      const res = await fetch("/api/inbox/mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          mode: newMode,
          agentName: "Nguyễn Thị Lan (Bạn)",
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConv.id ? { ...c, ...json.data } : c))
        );
        showToast(json.message);
      }
    } catch (err) {
      alert("Lỗi đổi chế độ");
    }
  };

  // 4. Gửi tin nhắn
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeConv) return;

    const messageText = inputMessage.trim();
    setInputMessage("");

    try {
      const res = await fetch("/api/inbox/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          content: messageText,
          senderType: "human_agent",
          senderName: "Nguyễn Thị Lan (Bạn)",
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMessages((prev) => [...prev, json.data.message]);
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConv.id ? { ...c, ...json.data.conversation } : c))
        );
      }
    } catch (err) {
      alert("Lỗi gửi tin nhắn");
    }
  };

  // 5. Yêu cầu AI Copilot gợi ý câu trả lời
  const handleRequestCopilot = async () => {
    if (!activeConv) return;
    try {
      setGeneratingAi(true);
      const res = await fetch("/api/inbox/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          isCopilot: true,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setCopilotSuggestion(json.data.suggestedReply);
        showToast("AI An An đã gợi ý câu trả lời tuyển sinh chuẩn phong thái!");
      }
    } catch (err) {
      alert("Lỗi tạo gợi ý AI");
    } finally {
      setGeneratingAi(false);
    }
  };

  // 6. Gửi câu trả lời Copilot ngay
  const handleSendCopilotDirectly = async () => {
    if (!copilotSuggestion || !activeConv) return;
    const textToSend = copilotSuggestion;
    setCopilotSuggestion(null);

    try {
      const res = await fetch("/api/inbox/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          content: textToSend,
          senderType: "human_agent",
          senderName: "Nguyễn Thị Lan (Duyệt gợi ý AI)",
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMessages((prev) => [...prev, json.data.message]);
        showToast("Đã duyệt và gửi tin nhắn gợi ý AI cho phụ huynh!");
      }
    } catch (err) {
      alert("Lỗi gửi tin nhắn");
    }
  };

  // 7. Kích hoạt AI tự động trả lời ngay
  const handleTriggerAiAutoReply = async () => {
    if (!activeConv) return;
    try {
      setGeneratingAi(true);
      const res = await fetch("/api/inbox/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv.id,
          isCopilot: false,
        }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setMessages((prev) => [...prev, json.data.message]);
        showToast("AI An An đã tự động phản hồi cho phụ huynh!");
      }
    } catch (err) {
      alert("Lỗi kích hoạt AI");
    } finally {
      setGeneratingAi(false);
    }
  };

  // 8. Mở Call Modal xác nhận cuộc gọi
  const handleOpenCallModal = () => {
    if (!activeConv) return;
    setSelectedCustomerForCall({
      id: activeConv.id,
      customer_code: `KH-${activeConv.id}`,
      full_name: activeConv.name,
      phone: activeConv.phone || null,
      source: activeConv.channel,
      status: "consulting",
      call_status: "pending",
      first_phone_received_at: new Date().toISOString(),
      sla_alert_level: "none",
      assigned_to_name: activeConv.agentName || "Nguyễn Thị Lan",
      interested_course_title: activeConv.course,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setIsCallModalOpen(true);
  };

  const handleCallSuccess = (updatedCustomer: Customer) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === updatedCustomer.id ? { ...c, status: "called" } : c
      )
    );
    showToast(`Đã lưu cuộc gọi thành công cho ${updatedCustomer.full_name}!`);
  };

  return (
    <div className="h-[calc(100vh-6.5rem)] flex flex-col space-y-3">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#DC2626] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

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
                {conversations.length} khách
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchConversations()}
                placeholder="Tìm tên khách, SĐT..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#DC2626]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => setFilterChannel("all")}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
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
                className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1 transition-colors ${
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
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  filterChannel === "zalo"
                    ? "bg-blue-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Zalo OA
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {conversations.map((c) => {
              const isActive = c.id === activeConv?.id;
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
                            <Bot className="w-2.5 h-2.5 text-emerald-600" /> AI đang chat
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-red-50 text-[#DC2626] border border-red-200 text-[10px] font-semibold rounded flex items-center gap-1">
                            <UserCheck className="w-2.5 h-2.5" /> Tiếp quản
                          </span>
                        )}

                        {c.phone && (
                          <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 text-[10px] font-mono rounded">
                            {c.phone.slice(-4)}
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
        {activeConv && (
          <div className="flex-1 flex flex-col bg-white">
            {/* Header chat & Bộ điều khiển AI */}
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
                    <span>
                      SĐT:{" "}
                      <strong className="text-slate-800 font-mono">
                        {activeConv.phone || "Chưa có"}
                      </strong>
                    </span>
                    <span>•</span>
                    <span>Kênh: <strong className="capitalize">{activeConv.channel}</strong></span>
                  </div>
                </div>
              </div>

              {/* BỘ NÚT ĐIỀU KHIỂN AI ORCHESTRATOR */}
              <div className="flex items-center gap-2">
                {activeConv.aiMode === "ai_auto" ? (
                  <button
                    type="button"
                    onClick={() => handleSetAiMode("human_takeover")}
                    className="px-3 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                    title="Khóa AI và nhân viên trực tiếp chat"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    Tiếp Quản (Khóa AI)
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSetAiMode("ai_auto")}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                    title="Mở khóa và cho phép AI trả lời tự động 24/7"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    Bật AI Tự Động
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleRequestCopilot}
                  disabled={generatingAi}
                  className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Yêu cầu AI phân tích và gợi ý câu trả lời"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  {generatingAi ? "AI đang nghĩ..." : "AI Gợi Ý (Copilot)"}
                </button>

                {activeConv.aiMode === "ai_auto" && (
                  <button
                    type="button"
                    onClick={handleTriggerAiAutoReply}
                    disabled={generatingAi}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                    title="Kích hoạt AI gửi tin nhắn tự động ngay"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    AI Phản Hồi Ngay
                  </button>
                )}
              </div>
            </div>

            {/* Khung tin nhắn */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#F8FAFC]">
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[11px] text-slate-500 font-medium shadow-2xs">
                  {activeConv.aiMode === "ai_auto"
                    ? "🤖 AI đang tự động tư vấn 24/7 theo Kho kiến thức T.A Academy"
                    : `🔒 Nhân viên ${activeConv.agentName || "Nguyễn Thị Lan"} đã tiếp quản hội thoại`}
                </span>
              </div>

              {messages.map((m) => {
                const isMe = m.sender_type === "human_agent";
                const isAi = m.sender_type === "ai";
                const isCustomer = m.sender_type === "customer";

                return (
                  <div
                    key={m.id}
                    className={`flex ${isMe || isAi ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-md space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        {isAi && (
                          <span className="font-bold text-[#DC2626] flex items-center gap-1">
                            <Bot className="w-3 h-3 text-[#DC2626]" /> {m.sender_name || "AI An An"}
                          </span>
                        )}
                        {isMe && (
                          <span className="font-bold text-slate-700 flex items-center gap-1">
                            <UserCheck className="w-3 h-3" /> {m.sender_name || "Tư vấn viên"}
                          </span>
                        )}
                        {isCustomer && (
                          <span className="font-bold text-slate-600">{activeConv.name}</span>
                        )}
                        <span>• {m.created_at}</span>
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
                        {m.content}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* BANNER GỢI Ý CỦA AI COPILOT */}
              {copilotSuggestion && (
                <div className="p-4 bg-purple-50/90 border border-purple-200 rounded-2xl space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-600" />
                      Gợi Ý Trả Lời Tuyển Sinh Từ AI An An (Khách không nhìn thấy)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setInputMessage(copilotSuggestion)}
                        className="px-2.5 py-1 bg-white hover:bg-purple-100 border border-purple-200 text-purple-800 font-bold rounded-lg text-[11px] transition-colors"
                      >
                        Dán vào khung chat
                      </button>
                      <button
                        type="button"
                        onClick={handleSendCopilotDirectly}
                        className="px-3 py-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-lg text-[11px] shadow-xs transition-colors"
                      >
                        Duyệt &amp; Gửi ngay
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-purple-950 italic bg-white p-3 rounded-xl border border-purple-100 leading-relaxed">
                    "{copilotSuggestion}"
                  </p>
                </div>
              )}
            </div>

            {/* Khung soạn thảo tin nhắn */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                  title="Đính kèm hình ảnh / tài liệu"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Nhập tin nhắn tư vấn gửi phụ huynh..."
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
        )}

        {/* CỘT 3: HỒ SƠ VẮN TẮT & THAO TÁC TUYỂN SINH (W-72) */}
        {activeConv && (
          <div className="w-72 border-l border-slate-200 flex flex-col shrink-0 bg-white p-4 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                Hồ Sơ Tư Vấn Nhanh
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">
                #{activeConv.id}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Phụ huynh / Khách:</span>
                <p className="font-bold text-slate-800 text-sm">{activeConv.name}</p>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Số điện thoại:</span>
                {activeConv.phone ? (
                  <div className="space-y-1">
                    <p className="font-mono font-bold text-slate-900 text-sm">
                      {activeConv.phone}
                    </p>
                    {activeConv.phoneAutoExtracted && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                        AI tự động lưu từ chat
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="inline-block mt-0.5 px-2 py-0.5 bg-amber-50 text-amber-800 font-bold rounded text-[11px] border border-amber-200">
                    Chưa có SĐT (AI đang xin)
                  </span>
                )}
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Khóa học quan tâm:</span>
                <p className="font-bold text-[#DC2626] bg-red-50 p-2 rounded-xl mt-0.5 border border-red-100">
                  {activeConv.course}
                </p>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Nhu cầu do AI phân tích:</span>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl mt-0.5 text-slate-700 leading-relaxed font-medium">
                  "{activeConv.aiExtractedNeed}"
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Tình trạng chăm sóc:</span>
                <span className="inline-block mt-0.5 px-2.5 py-1 bg-red-50 text-[#DC2626] font-bold rounded-lg text-xs border border-red-200 capitalize">
                  {activeConv.status}
                </span>
              </div>

              <div>
                <span className="text-slate-400 text-[11px]">Đồng bộ E-learning:</span>
                {activeConv.elearningStatus === "synced" ? (
                  <div className="mt-0.5 p-2 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-1.5 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Đã xếp lớp E-learning K26</span>
                  </div>
                ) : (
                  <p className="text-slate-400 text-[11px] italic mt-0.5">
                    Tự động đồng bộ khi chốt đăng ký
                  </p>
                )}
              </div>
            </div>

            {/* CÁC THAO TÁC HÀNH ĐỘNG NHANH */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              {activeConv.phone && (
                <button
                  type="button"
                  onClick={handleOpenCallModal}
                  className="w-full py-2.5 px-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  Xác Nhận Cuộc Gọi Tư Vấn
                </button>
              )}

              <a
                href="/consultations"
                className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Xem Bảng Quản Lý Tư Vấn</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Call Log Modal */}
      <CallLogModal
        customer={selectedCustomerForCall}
        isOpen={isCallModalOpen}
        onClose={() => {
          setIsCallModalOpen(false);
          setSelectedCustomerForCall(null);
        }}
        onSuccess={handleCallSuccess}
      />
    </div>
  );
}
