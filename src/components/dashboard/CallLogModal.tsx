"use client";

import React, { useState } from "react";
import { Phone, Clock, FileText, X, CheckCircle2, AlertCircle } from "lucide-react";
import { Customer } from "@/types/crm";

interface CallLogModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedCustomer: Customer) => void;
}

export default function CallLogModal({
  customer,
  isOpen,
  onClose,
  onSuccess,
}: CallLogModalProps) {
  const [callResult, setCallResult] = useState<
    "connected" | "unreachable" | "busy" | "wrong_number" | "recall_requested"
  >("connected");
  const [duration, setDuration] = useState<number>(120);
  const [summary, setSummary] = useState("");
  const [recallDate, setRecallDate] = useState("");
  const [nextStatus, setNextStatus] = useState("consulting");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !customer) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) {
      setError("Vui lòng nhập tóm tắt nội dung cuộc gọi để lưu lịch sử chăm sóc tư vấn.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    setTimeout(() => {
      setIsSubmitting(false);
      onSuccess({
        ...customer,
        call_status: callResult === "connected" ? "contacted" : "unreachable",
        status: (nextStatus as any) || "consulting",
        last_called_at: new Date().toISOString(),
        sla_alert_level: "none",
      });
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header - Đỏ tươi */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">
                Xác Nhận Kết Quả Cuộc Gọi Tư Vấn
              </h3>
              <p className="text-[11px] text-white/90">
                Khách hàng: {customer.full_name} ({customer.phone})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Call Result Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Kết quả liên hệ <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "connected", label: "Đã liên hệ thành công" },
                { id: "unreachable", label: "Không nghe máy" },
                { id: "busy", label: "Máy bận" },
                { id: "recall_requested", label: "Khách hẹn gọi lại" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCallResult(item.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                    callResult === item.id
                      ? "border-[#DC2626] bg-red-50 text-[#DC2626] ring-1 ring-[#DC2626]"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Next Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Thời lượng (giây)
              </label>
              <input
                type="number"
                min={0}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Chuyển trạng thái tư vấn
              </label>
              <select
                value={nextStatus}
                onChange={(e) => setNextStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
              >
                <option value="consulting">Đang tư vấn</option>
                <option value="trial_scheduled">Hẹn học thử</option>
                <option value="considering">Đang cân nhắc</option>
                <option value="called_unreachable">Chưa liên hệ được</option>
                <option value="registered">Đã chốt đăng ký</option>
                <option value="lost">Không tiếp tục</option>
              </select>
            </div>
          </div>

          {/* Recall datetime if requested */}
          {callResult === "recall_requested" && (
            <div className="space-y-1 animate-in fade-in duration-150">
              <label className="text-xs font-bold text-slate-700">
                Thời gian hẹn gọi lại
              </label>
              <input
                type="datetime-local"
                value={recallDate}
                onChange={(e) => setRecallDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          )}

          {/* Summary notes */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" /> Tóm tắt nội dung cuộc gọi <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Ví dụ: Phụ huynh trao đổi về khóa Model Kids cho bé 7 tuổi, bé nhút nhát. Hẹn sáng thứ 7 đến học thử..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? "Đang lưu..." : "Lưu & Xác Nhận Cuộc Gọi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
