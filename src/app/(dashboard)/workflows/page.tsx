"use client";

import React from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { GitFork, Plus, Play, CheckCircle2, Clock, Bell, UserPlus } from "lucide-react";

const workflows = [
  {
    id: "wf-1",
    name: "Tiếp Nhận Lead Mới & Phân Bổ Xoay Vòng (Round Robin)",
    trigger: "Lead mới từ Facebook Messenger / Zalo OA",
    action: "Kiểm tra trùng số, tạo hồ sơ và gán nhân viên tư vấn theo lượt",
    isActive: true,
  },
  {
    id: "wf-2",
    name: "Kiểm Soát SLA Khách Chưa Gọi (15 Phút & 60 Phút)",
    trigger: "Khách có SĐT nhưng chưa có bản ghi Call Log xác nhận",
    action: "Sau 15m cảnh báo vàng, sau 60m cảnh báo đỏ nguy cấp và gửi thông báo",
    isActive: true,
  },
  {
    id: "wf-3",
    name: "AI Tiếp Nhận & Tư Vấn Tự Động Ngoài Giờ Hành Chính",
    trigger: "Khách nhắn tin sau 21:00 hoặc trước 08:00 sáng",
    action: "AI chủ động chào đón, giới thiệu thông tin và hẹn giờ nhân viên liên hệ lại",
    isActive: true,
  },
  {
    id: "wf-4",
    name: "Tự Động Bàn Giao Khi Phụ Huynh Yêu Cầu Gặp Chuyên Viên",
    trigger: "Phụ huynh gửi tin nhắn có ý định gặp trực tiếp hoặc thắc mắc nâng cao",
    action: "Chuyển trạng thái sang Human Takeover, khóa AI gửi tin và ping chuông nhân viên",
    isActive: true,
  },
];

export default function WorkflowsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Tổng quan", href: "/" },
              { label: "Quy trình tư vấn & Automation" },
            ]}
          />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Quy Trình Tuyển Sinh &amp; Workflow Automation
          </h1>
          <p className="text-xs text-slate-500">
            Tự động hóa toàn bộ chu trình: Tiếp nhận lead, Phân bổ xoay vòng, Quét SLA cảnh báo chưa gọi và Bàn giao AI.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#8B1D2C] hover:bg-[#721422] rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tạo Quy Trình Mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workflows.map((wf) => (
          <div
            key={wf.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 bg-rose-50 text-[#8B1D2C] rounded-xl border border-rose-100">
                  <GitFork className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Đang chạy tự động
                </span>
              </div>

              <h3 className="font-bold text-sm text-slate-900">{wf.name}</h3>

              <div className="text-xs space-y-1.5 pt-1 text-slate-600">
                <div>
                  <strong className="text-slate-800">Khi kích hoạt (Trigger):</strong> {wf.trigger}
                </div>
                <div>
                  <strong className="text-slate-800">Hành động thực thi (Action):</strong> {wf.action}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Đã chạy: 420 lần tuần này</span>
              <button
                type="button"
                className="font-bold text-[#8B1D2C] hover:underline"
              >
                Cấu hình các khối →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
