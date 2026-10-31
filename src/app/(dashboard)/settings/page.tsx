"use client";

import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import {
  Settings,
  BookOpen,
  Bot,
  Facebook,
  MessageCircle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Save,
  Check,
  X,
  RefreshCw,
  Eye,
  EyeOff,
  Copy,
  ShieldCheck,
  HelpCircle,
  Clock,
  Sparkles,
  Zap,
  Send,
  MessageSquare,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { CourseItem } from "@/lib/services/courseService";
import { AiConfigData, AiZaloConfigData } from "@/lib/services/aiTrainingService";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"courses" | "facebook_ai" | "zalo_ai">("courses");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // --- TAB 1: DANH MỤC KHÓA HỌC STATE ---
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSessions, setCourseSessions] = useState<number>(12);
  const [courseDesc, setCourseDesc] = useState("");

  // --- TAB 2: CẤU HÌNH AI FANPAGE STATE ---
  const [fbConfig, setFbConfig] = useState<AiConfigData>({
    apiKey: "AIzaSyB_dummy_production_gemini_key_for_ta_academy",
    selectedModel: "gemini-1.5-flash",
    webhookUrl: "https://crm.taacademy.vn/api/webhook/facebook",
    verifyToken: "ta_academy_meta_verify_2026",
    fbToken: "EAAXvOfcbO9ABSzhfXHzLZCH8sp4gDZB2Wre7P7MeLqltp3CEhU5kYcZAEVhjBegFPeo8z9arvburBTkuKTHqFCHZBf7gZAYUrTWxnICYQKUZAxjKGBZA6qZAJL9zejMRlVi21lQhv3vZCOUZCcTSwhcKFZCpRRCqMCxeKnZAeOWs84ewbbm9ZBXcStFj9nKO17v12kfMdaZCZCR",
    isBotActive: true,
    lastTestedAt: "Hôm nay 08:30",
    metaStatus: "connected",
    geminiStatus: "connected",
    fanpageStatus: "active",
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [showFbToken, setShowFbToken] = useState(false);
  const [copiedFbWebhook, setCopiedFbWebhook] = useState(false);
  const [copiedFbToken, setCopiedFbToken] = useState(false);
  const [isFbSaving, setIsFbSaving] = useState(false);

  // --- BỘ THỬ NGHIỆM FANPAGE & AI TƯ VẤN (SIMULATOR) ---
  const [testCustomerName, setTestCustomerName] = useState("Phụ huynh Mai Phương");
  const [testMessage, setTestMessage] = useState(
    "Chào viện, bé nhà mình 7 tuổi nhút nhát và đi hơi gù lưng, có lớp Model Kids học thử cuối tuần không? Số mình 0988776655, gọi tư vấn giúp mình nhé"
  );
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [testWebhookResult, setTestWebhookResult] = useState<any>(null);

  // --- TAB 3: CẤU HÌNH AI ZALO STATE ---
  const [zaloConfig, setZaloConfig] = useState<AiZaloConfigData>({
    oaId: "2489103984920194",
    appId: "4820192840192",
    secretKey: "zk_live_ta_academy_secret_key_prod",
    accessToken: "zalo_oa_live_token_ta_academy_2026",
    refreshToken: "zalo_oa_refresh_token_ta_academy",
    webhookUrl: "https://crm.taacademy.vn/api/webhooks/zalo",
    isBotActive: true,
    lastTestedAt: "Hôm nay 09:15",
    status: "connected",
  });
  const [showZaloSecret, setShowZaloSecret] = useState(false);
  const [showZaloToken, setShowZaloToken] = useState(false);
  const [copiedZaloWebhook, setCopiedZaloWebhook] = useState(false);
  const [isZaloSaving, setIsZaloSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Fetch courses
  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      const res = await fetch("/api/courses");
      if (res.ok) {
        const json = await res.json();
        if (json.success) setCourses(json.data);
      }
    } catch (err) {
      console.error("Lỗi tải danh mục khóa học:", err);
    } finally {
      setLoadingCourses(false);
    }
  };

  // 2. Fetch FB AI config
  const fetchFbConfig = async () => {
    try {
      const res = await fetch("/api/ai/config");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) setFbConfig(json.data);
      }
    } catch (err) {
      console.error("Lỗi tải cấu hình FB AI:", err);
    }
  };

  // 3. Fetch Zalo config
  const fetchZaloConfig = async () => {
    try {
      const res = await fetch("/api/ai/zalo");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) setZaloConfig(json.data);
      }
    } catch (err) {
      console.error("Lỗi tải cấu hình Zalo:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchFbConfig();
    fetchZaloConfig();
  }, []);

  // --- COURSE ACTIONS ---
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseCode("");
    setCourseTitle("");
    setCourseSessions(12);
    setCourseDesc("");
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (c: CourseItem) => {
    setEditingCourse(c);
    setCourseCode(c.code);
    setCourseTitle(c.title);
    setCourseSessions(c.totalSessions);
    setCourseDesc(c.description || "");
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseTitle.trim()) return;

    try {
      if (editingCourse) {
        // Update
        const res = await fetch("/api/courses", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingCourse.id,
            code: courseCode.trim(),
            title: courseTitle.trim(),
            totalSessions: Number(courseSessions),
            description: courseDesc.trim() || undefined,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message);
        setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? json.data : c)));
        showToast(`Đã cập nhật khóa học "${courseTitle}" (${courseCode})!`);
      } else {
        // Add
        const res = await fetch("/api/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: courseCode.trim(),
            title: courseTitle.trim(),
            totalSessions: Number(courseSessions),
            description: courseDesc.trim() || undefined,
          }),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message);
        setCourses([...courses, json.data]);
        showToast(`Đã thêm khóa học "${courseTitle}" (${courseCode})!`);
      }
      setIsCourseModalOpen(false);
    } catch (err: any) {
      alert(err.message || "Lỗi lưu khóa học");
    }
  };

  const handleDeleteCourse = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa khóa học "${name}" khỏi hệ thống?`)) return;
    try {
      const res = await fetch(`/api/courses?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setCourses(courses.filter((c) => c.id !== id));
      showToast(`Đã xóa khóa học "${name}" thành công!`);
    } catch (err: any) {
      alert(err.message || "Lỗi xóa khóa học");
    }
  };

  // --- FB AI ACTIONS ---
  const handleTestFanpageWebhook = async () => {
    if (!testMessage.trim()) return;
    try {
      setIsTestingWebhook(true);
      setTestWebhookResult(null);
      const res = await fetch("/api/webhook/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: testCustomerName.trim() || "Khách Facebook Test",
          messageText: testMessage.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);
      setTestWebhookResult(json.data);
      showToast("Đã bắn tin nhắn Webhook Fanpage & AI đã phản hồi!");
    } catch (err: any) {
      alert(err.message || "Lỗi thử nghiệm Webhook Fanpage");
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const handleSaveFbConfig = async () => {
    try {
      setIsFbSaving(true);
      const res = await fetch("/api/ai/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fbConfig),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Đã lưu và đồng bộ Cấu hình AI Fanpage thành công!");
      }
    } catch (err) {
      alert("Lỗi lưu cấu hình Fanpage");
    } finally {
      setIsFbSaving(false);
    }
  };

  // --- ZALO AI ACTIONS ---
  const handleSaveZaloConfig = async () => {
    try {
      setIsZaloSaving(true);
      const res = await fetch("/api/ai/zalo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zaloConfig),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        showToast("Đã lưu và đồng bộ Cấu hình AI Zalo Official Account thành công!");
      }
    } catch (err) {
      alert("Lỗi lưu cấu hình Zalo");
    } finally {
      setIsZaloSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#DC2626] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-3 duration-200">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: "Tổng quan", href: "/" }, { label: "Cài đặt hệ thống" }]} />
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-[#DC2626]" />
            <span>CÀI ĐẶT HỆ THỐNG</span>
          </h1>
          <p className="text-xs text-slate-500">
            Quản trị danh mục khóa học, cấu hình Chatbot AI Facebook Fanpage và Zalo Official Account.
          </p>
        </div>
      </div>

      {/* 3 Main Tabs Toggle */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-2 max-w-2xl border border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("courses")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === "courses"
              ? "bg-[#DC2626] text-white shadow-md shadow-red-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>DANH MỤC KHÓA HỌC</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("facebook_ai")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === "facebook_ai"
              ? "bg-[#DC2626] text-white shadow-md shadow-red-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <Facebook className="w-4 h-4" />
          <span>CẤU HÌNH AI FANPAGE</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("zalo_ai")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 ${
            activeTab === "zalo_ai"
              ? "bg-[#DC2626] text-white shadow-md shadow-red-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>CẤU HÌNH AI ZALO</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: DANH MỤC KHÓA HỌC                                */}
      {/* ========================================================= */}
      {activeTab === "courses" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#DC2626]" />
                <span>Danh Mục Khóa Học &amp; Quy Định Mã Khóa</span>
              </h2>
              <p className="text-xs text-slate-500">
                Thiết lập Mã khóa học, Tên khóa và Số buổi học chuẩn. Mã này được dùng trực tiếp khi khách hàng chuyển sang Khách Hàng Trung Tâm.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddCourse}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              Thêm Khóa Học Mới
            </button>
          </div>

          {/* Courses Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-black border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-4 py-3.5">Mã Khóa</th>
                  <th className="px-5 py-3.5">Tên Khóa Học</th>
                  <th className="px-4 py-3.5">Số Buổi</th>
                  <th className="px-4 py-3.5">Mô Tả / Đối Tượng</th>
                  <th className="px-4 py-3.5 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-mono font-black text-sm text-[#DC2626] bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                        {c.code}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900 text-sm">
                      {c.title}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-lg">
                        {c.totalSessions} buổi
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600 max-w-md">
                      {c.description || "Chưa có mô tả"}
                    </td>
                    <td className="px-4 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEditCourse(c)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                        title="Chỉnh sửa khóa học"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(c.id, c.title)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-[#DC2626] font-bold rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                        title="Xóa khóa học"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: CẤU HÌNH AI FANPAGE                              */}
      {/* ========================================================= */}
      {activeTab === "facebook_ai" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-5">
              {/* Box 1: Thông tin kết nối AI */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Sparkles className="w-4 h-4 text-[#DC2626]" />
                    <span>1. Thông tin kết nối AI (Google Gemini / OpenAI)</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Đã kết nối
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-700">Google Gemini / OpenAI API Key</label>
                  <div className="relative flex items-center">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={fbConfig.apiKey}
                      onChange={(e) => setFbConfig({ ...fbConfig, apiKey: e.target.value })}
                      className="w-full pl-3.5 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-700">Chọn mô hình AI</label>
                  <select
                    value={fbConfig.selectedModel}
                    onChange={(e) => setFbConfig({ ...fbConfig, selectedModel: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800"
                  >
                    <option value="gemini-1.5-flash">Gemini 1.5 Flash (Khuyến nghị - Tốc độ cao &amp; Chi phí thấp)</option>
                    <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
                    <option value="gpt-4o-mini">OpenAI GPT-4o-mini</option>
                    <option value="gpt-4o">OpenAI GPT-4o</option>
                  </select>
                </div>
              </div>

              {/* Box 2: Meta Webhook */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <Facebook className="w-4 h-4 text-blue-600" />
                    <span>2. Thông tin kết nối Facebook Messenger (Webhook)</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-700">Meta Webhook URL (Dán vào developers.facebook.com)</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      readOnly
                      value={fbConfig.webhookUrl}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(fbConfig.webhookUrl);
                        setCopiedFbWebhook(true);
                        setTimeout(() => setCopiedFbWebhook(false), 2000);
                      }}
                      className="absolute right-3 p-1 text-slate-500 hover:text-slate-800"
                    >
                      {copiedFbWebhook ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-700">Verify Token</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={fbConfig.verifyToken}
                      onChange={(e) => setFbConfig({ ...fbConfig, verifyToken: e.target.value })}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(fbConfig.verifyToken);
                        setCopiedFbToken(true);
                        setTimeout(() => setCopiedFbToken(false), 2000);
                      }}
                      className="absolute right-3 p-1 text-slate-500 hover:text-slate-800"
                    >
                      {copiedFbToken ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-700">Facebook Page Access Token</label>
                  <div className="relative flex items-center">
                    <input
                      type={showFbToken ? "text" : "password"}
                      value={fbConfig.fbToken}
                      onChange={(e) => setFbConfig({ ...fbConfig, fbToken: e.target.value })}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowFbToken(!showFbToken)}
                      className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
                    >
                      {showFbToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveFbConfig}
                  disabled={isFbSaving}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isFbSaving ? "Đang lưu..." : "Lưu Cấu Hình Fanpage"}
                </button>
              </div>
            </div>

            {/* Right Column: Toggle & Status */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Trạng thái Chatbot Fanpage</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    24/7 Hoạt động
                  </span>
                </div>
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Tự động trả lời Fanpage</span>
                  <button
                    type="button"
                    onClick={() => setFbConfig({ ...fbConfig, isBotActive: !fbConfig.isBotActive })}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                      fbConfig.isBotActive ? "bg-[#DC2626]" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                        fbConfig.isBotActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Khi bật, Tiểu Mỹ sẽ tự động phân tích và phản hồi ngay lập tức cho phụ huynh nhắn tin vào Fanpage mà không cần nhân viên gõ tay.
                </p>
              </div>

              {/* Hướng Dẫn Nhanh Kết Nối Fanpage Thật */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-md space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-red-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-red-400" />
                  <span>Cách kết nối Fanpage Thật</span>
                </div>
                <div className="space-y-2 text-[11px] text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-white">Bước 1:</strong> Mở cổng HTTPS từ máy bằng lệnh: <code className="bg-black/40 px-1 py-0.5 rounded text-amber-300">ngrok http 3000</code>
                  </p>
                  <p>
                    <strong className="text-white">Bước 2:</strong> Vào <strong className="text-white">developers.facebook.com</strong> &gt; Webhooks &gt; Chọn Messenger.
                  </p>
                  <p>
                    <strong className="text-white">Bước 3:</strong> Dán Callback URL: <code className="bg-black/40 px-1 py-0.5 rounded text-emerald-300">https://.../api/webhook/facebook</code> và Verify Token.
                  </p>
                  <p>
                    <strong className="text-white">Bước 4:</strong> Lấy Page Access Token dán vào ô bên cạnh và bấm <strong className="text-white">Lưu cấu hình</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BỘ THỬ NGHIỆM TIN NHẮN FANPAGE & AI TƯ VẤN (LIVE SIMULATOR) */}
          <div className="bg-white rounded-2xl p-6 border-2 border-red-200 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#DC2626] flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">
                    BỘ THỬ NGHIỆM KẾT NỐI FANPAGE &amp; AI TƯ VẤN (LIVE TEST)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Bắn tin nhắn giả lập từ khách hàng Facebook để kiểm tra toàn bộ luồng Webhook &rarr; Trích xuất SĐT &rarr; Tiểu Mỹ tư vấn tự động &rarr; Đồng bộ vào CRM
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-[#DC2626]">
                Thử nghiệm tức thì
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tên khách hàng Facebook</label>
                <input
                  type="text"
                  value={testCustomerName}
                  onChange={(e) => setTestCustomerName(e.target.value)}
                  placeholder="VD: Phụ huynh Mai Phương"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                />
              </div>

              <div className="md:col-span-8 space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Nội dung tin nhắn khách gửi vào Fanpage
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    placeholder="Nhập câu hỏi, số điện thoại..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]"
                  />
                  <button
                    type="button"
                    onClick={handleTestFanpageWebhook}
                    disabled={isTestingWebhook || !testMessage.trim()}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    {isTestingWebhook ? "Đang xử lý AI..." : "Bắn Tin Nhắn Thử"}
                  </button>
                </div>
              </div>
            </div>

            {/* KẾT QUẢ TEST THỰC TẾ */}
            {testWebhookResult && (
              <div className="p-4 rounded-xl bg-slate-50 border border-emerald-200 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Webhook Facebook đã tiếp nhận &amp; Tiểu Mỹ đã phản hồi thành công!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="/inbox"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] hover:underline"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Xem trong Hộp thư
                    </a>
                    <span className="text-slate-300">•</span>
                    <a
                      href="/consultations"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#DC2626] hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Xem trong Quản lý khách hàng
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider block">
                      Dữ liệu AI trích xuất tự động:
                    </span>
                    <div className="space-y-1">
                      <p className="text-slate-700">
                        <strong>Số điện thoại:</strong>{" "}
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {testWebhookResult.extractedPhone || "Không có (Đang xin thêm)"}
                        </span>
                      </p>
                      <p className="text-slate-700">
                        <strong>Nhu cầu nhận diện:</strong> {testWebhookResult.extractedNeed}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-red-50/50 rounded-xl border border-red-200 space-y-1.5">
                    <span className="font-bold text-[#DC2626] text-[11px] uppercase tracking-wider block flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5" /> Phản hồi từ Tiểu Mỹ (Gửi lại khách):
                    </span>
                    <p className="text-slate-800 italic leading-relaxed text-xs">
                      "{testWebhookResult.aiReply}"
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CẤU HÌNH AI ZALO                                 */}
      {/* ========================================================= */}
      {activeTab === "zalo_ai" && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-5">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                    <MessageCircle className="w-4 h-4 text-blue-500" />
                    <span>Cấu hình kết nối Zalo Official Account (Zalo OA)</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Đã kết nối OA
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Zalo OA ID</label>
                    <input
                      type="text"
                      value={zaloConfig.oaId}
                      onChange={(e) => setZaloConfig({ ...zaloConfig, oaId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Zalo App ID</label>
                    <input
                      type="text"
                      value={zaloConfig.appId}
                      onChange={(e) => setZaloConfig({ ...zaloConfig, appId: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-700">Zalo Secret Key</label>
                  <div className="relative flex items-center">
                    <input
                      type={showZaloSecret ? "text" : "password"}
                      value={zaloConfig.secretKey}
                      onChange={(e) => setZaloConfig({ ...zaloConfig, secretKey: e.target.value })}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowZaloSecret(!showZaloSecret)}
                      className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
                    >
                      {showZaloSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-700">Zalo OA Access Token</label>
                  <div className="relative flex items-center">
                    <input
                      type={showZaloToken ? "text" : "password"}
                      value={zaloConfig.accessToken}
                      onChange={(e) => setZaloConfig({ ...zaloConfig, accessToken: e.target.value })}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowZaloToken(!showZaloToken)}
                      className="absolute right-3 p-1 text-slate-400 hover:text-slate-600"
                    >
                      {showZaloToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <label className="font-bold text-slate-700">Zalo Webhook URL</label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      readOnly
                      value={zaloConfig.webhookUrl}
                      className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(zaloConfig.webhookUrl);
                        setCopiedZaloWebhook(true);
                        setTimeout(() => setCopiedZaloWebhook(false), 2000);
                      }}
                      className="absolute right-3 p-1 text-slate-500 hover:text-slate-800"
                    >
                      {copiedZaloWebhook ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveZaloConfig}
                  disabled={isZaloSaving}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isZaloSaving ? "Đang lưu..." : "Lưu Cấu Hình Zalo OA"}
                </button>
              </div>
            </div>

            {/* Right Column: Toggle */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-900">Trạng thái Chatbot Zalo</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                    Sẵn sàng
                  </span>
                </div>
                <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Tự động trả lời Zalo OA</span>
                  <button
                    type="button"
                    onClick={() => setZaloConfig({ ...zaloConfig, isBotActive: !zaloConfig.isBotActive })}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                      zaloConfig.isBotActive ? "bg-[#DC2626]" : "bg-slate-300"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                        zaloConfig.isBotActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL THÊM / CHỈNH SỬA KHÓA HỌC */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-[#DC2626] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm tracking-tight">
                  {editingCourse ? "Chỉnh Sửa Khóa Học" : "Thêm Khóa Học Mới"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCourseModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mã khóa học <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: MK-01, PT-01, CW-01..."
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold uppercase text-slate-900"
                />
                <p className="text-[10px] text-slate-400">Mã này sẽ hiển thị trong khóa đăng ký của học viên trung tâm.</p>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tên khóa học <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Model Kids Tài Năng..."
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Số buổi học <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min={1}
                  required
                  value={courseSessions}
                  onChange={(e) => setCourseSessions(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Mô tả / Đối tượng tham gia</label>
                <textarea
                  rows={3}
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  placeholder="Nhập thông tin giới thiệu ngắn về khóa học..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-xl shadow-md"
                >
                  {editingCourse ? "Cập Nhật Khóa Học" : "Lưu Khóa Học"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
