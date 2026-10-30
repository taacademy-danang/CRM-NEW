"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  Sparkles,
  Bot,
  Facebook,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  HelpCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Save,
  MessageSquare,
  Users,
  Send,
  UserCheck,
  Activity,
  ArrowUpRight,
} from "lucide-react";

export default function AiFanpageConfigPage() {
  const [apiKey, setApiKey] = useState("AIzaSyB_dummy_production_gemini_key_for_ta_academy");
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [webhookUrl] = useState("https://crm.taacademy.vn/api/webhooks/meta");
  const [verifyToken, setVerifyToken] = useState("ta_academy_meta_verify_2026");
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [fbToken, setFbToken] = useState("EAAGm0PXq1...mock_valid_page_access_token_ta_academy");
  const [showFbToken, setShowFbToken] = useState(false);
  const [isBotActive, setIsBotActive] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const copyToClipboard = (text: string, type: "webhook" | "token") => {
    navigator.clipboard.writeText(text);
    if (type === "webhook") {
      setCopiedWebhook(true);
      setTimeout(() => setCopiedWebhook(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Trung tâm đào tạo AI", href: "/ai-training" },
              { label: "Cấu hình Chatbot AI Fanpage" },
            ]}
          />
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shadow-xs">
              <Facebook className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Cấu Hình Chatbot AI Fanpage
              </h1>
              <p className="text-xs text-slate-500">
                Kết nối Facebook Messenger với AI (Gemini Flash / OpenAI) để tự động tư vấn khách hàng 24/7
              </p>
            </div>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors shadow-xs"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Hướng dẫn cấu hình
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Tài liệu
          </button>
        </div>
      </div>

      {/* Save Success Alert */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Đã lưu cấu hình AI và đồng bộ Webhook Meta thành công!
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">Đã kích hoạt</span>
        </div>
      )}

      {/* 2. Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Configuration Cards (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          {/* Section 1: Thông tin kết nối AI */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Sparkles className="w-4 h-4 text-[#DC2626]" />
                <span>1. Thông tin kết nối AI</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Đã kết nối
                </span>
                <span className="text-[11px] text-slate-400">
                  Kiểm tra lần cuối: Hôm nay 14:28
                </span>
              </div>
            </div>

            {/* API Key */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700">
                  Google Gemini API Key (Miễn phí tại Google AI Studio)
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full pl-3.5 pr-32 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-28 p-1.5 text-slate-400 hover:text-slate-600"
                  aria-label="Xem khóa bí mật"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  className="absolute right-1.5 px-3 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Kiểm tra kết nối
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Sử dụng Gemini 1.5 Flash hoặc 2.0 Flash. Khuyên dùng tài khoản Google AI Studio chính thức của học viện.
              </p>
            </div>

            {/* Model Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Chọn mô hình AI
                </label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                >
                  <option value="gemini-1.5-flash">Gemini 1.5 Flash (Khuyến nghị)</option>
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                  <option value="gpt-4o-mini">OpenAI GPT-4o-mini</option>
                  <option value="gpt-4o">OpenAI GPT-4o</option>
                </select>
              </div>

              {/* Model benefits card */}
              <div className="p-3 bg-red-50/60 border border-red-200/80 rounded-xl text-xs text-red-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-red-800">
                  <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>Gemini 1.5 Flash</span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] text-red-800/90 pt-0.5">
                  <span className="flex items-center gap-1">✓ Tốc độ phản hồi cực nhanh</span>
                  <span className="flex items-center gap-1">✓ Chi phí tối ưu</span>
                  <span className="flex items-center gap-1">✓ Ngữ cảnh tư vấn phong thái</span>
                  <span className="flex items-center gap-1">✓ Hỗ trợ tiếng Việt tự nhiên</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Thông tin kết nối Facebook Messenger */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>2. Thông tin kết nối Facebook Messenger</span>
              </div>
            </div>

            {/* Webhook URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Meta Webhook URL (Dán vào mục Webhooks trên Facebook Developer)
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  value={webhookUrl}
                  className="w-full pl-3.5 pr-36 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(webhookUrl, "webhook")}
                  className="absolute right-28 p-1.5 text-slate-500 hover:text-slate-800"
                  title="Sao chép"
                >
                  {copiedWebhook ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  className="absolute right-1.5 px-3 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  Kiểm tra Webhook
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Dán URL này vào cấu hình Webhook trong Meta Developer (developers.facebook.com).
              </p>
            </div>

            {/* Verify Token */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Verify Token (Xác minh với Meta)
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                  className="w-full pl-3.5 pr-36 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 font-bold"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(verifyToken, "token")}
                  className="absolute right-28 p-1.5 text-slate-500 hover:text-slate-800"
                  title="Sao chép"
                >
                  {copiedToken ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setVerifyToken(`ta_academy_meta_verify_${Date.now().toString().slice(-4)}`)}
                  className="absolute right-1.5 px-3 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Tạo lại Token
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Sử dụng token này khi xác minh Webhook với Meta Developer App.
              </p>
            </div>
          </div>

          {/* Section 3: Thông tin Fanpage */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>3. Thông tin Fanpage</span>
              </div>
              <button
                type="button"
                className="text-xs font-bold text-[#DC2626] hover:underline flex items-center gap-1"
              >
                Quản lý nhiều Fanpage <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {/* Page Access Token */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Facebook Page Access Token (Lấy trong mục Messenger Settings của Meta App)
              </label>
              <div className="relative flex items-center">
                <input
                  type={showFbToken ? "text" : "password"}
                  value={fbToken}
                  onChange={(e) => setFbToken(e.target.value)}
                  className="w-full pl-3.5 pr-32 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowFbToken(!showFbToken)}
                  className="absolute right-28 p-1.5 text-slate-400 hover:text-slate-600"
                  aria-label="Xem token Fanpage"
                >
                  {showFbToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  className="absolute right-1.5 px-3 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" /> Kiểm tra quyền
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Yêu cầu cấp quyền: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">pages_messaging</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">pages_read_engagement</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">pages_manage_metadata</code>.
              </p>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              className="px-5 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-xs"
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl transition-all shadow-md active:scale-95"
            >
              <Save className="w-4 h-4" />
              Lưu cấu hình
            </button>
          </div>
        </div>

        {/* Right Column: Status & Realtime Monitoring Widgets (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          {/* Widget 1: Trạng thái hệ thống */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Trạng thái hệ thống</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Tất cả hoạt động tốt
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-red-500" />
                  <span>Gemini API</span>
                </div>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Đã kết nối
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Facebook className="w-3.5 h-3.5 text-blue-600" />
                  <span>Meta Webhook</span>
                </div>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Đã xác minh
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Facebook className="w-3.5 h-3.5 text-blue-600" />
                  <span>Fanpage</span>
                </div>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Hoạt động
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <Activity className="w-3.5 h-3.5 text-purple-600" />
                  <span>Đồng bộ dữ liệu</span>
                </div>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Bình thường
                </span>
              </div>
            </div>

            {/* Switch Toggle: Chatbot đang hoạt động */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between bg-red-50/50 p-3 rounded-xl border border-red-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#DC2626] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Chatbot đang hoạt động
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Tự động trả lời tin nhắn 24/7
                  </div>
                </div>
              </div>

              {/* Red Toggle Switch */}
              <button
                type="button"
                onClick={() => setIsBotActive(!isBotActive)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                  isBotActive ? "bg-[#DC2626]" : "bg-slate-300"
                }`}
                aria-label="Bật tắt chatbot"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    isBotActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Widget 2: Thống kê hôm nay */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <span>Thống kê hôm nay</span>
              </div>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                Hôm nay
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <MessageSquare className="w-4 h-4 text-[#DC2626]" />
                  <span className="text-[10px] font-bold text-emerald-600">↑ 12%</span>
                </div>
                <div className="text-lg font-extrabold text-slate-900">125</div>
                <div className="text-[11px] text-slate-500 font-medium">Hội thoại đã tiếp nhận</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <Send className="w-4 h-4 text-blue-600" />
                  <span className="text-[10px] font-bold text-emerald-600">↑ 18%</span>
                </div>
                <div className="text-lg font-extrabold text-slate-900">238</div>
                <div className="text-[11px] text-slate-500 font-medium">Tin nhắn AI đã gửi</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-[10px] font-bold text-emerald-600">↑ 8%</span>
                </div>
                <div className="text-lg font-extrabold text-slate-900">42</div>
                <div className="text-[11px] text-slate-500 font-medium">Yêu cầu tư vấn mới</div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center justify-between text-slate-500 mb-1">
                  <UserCheck className="w-4 h-4 text-amber-600" />
                  <span className="text-[10px] font-bold text-slate-400">0%</span>
                </div>
                <div className="text-lg font-extrabold text-slate-900">7</div>
                <div className="text-[11px] text-slate-500 font-medium">Chuyển cho nhân viên</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
