"use client";

import React from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { GitPullRequest, Plus, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";

const scenarios = [
  {
    code: "SCENARIO_NEW_PARENT",
    title: "Tiếp Nhận Phụ Huynh Mới (Chung Chung)",
    goal: "Tạo thiện cảm, khai thác độ tuổi của bé và định hướng khóa học",
    stepsCount: 4,
    status: "Đang hoạt động",
  },
  {
    code: "SCENARIO_MODEL_KIDS",
    title: "Tư Vấn Khóa Mẫu Nhí (Model Kids)",
    goal: "Khai thác tính cách bé (nhút nhát/tự tin), giới thiệu giáo trình sân khấu, chốt lịch học thử",
    stepsCount: 5,
    status: "Đang hoạt động",
  },
  {
    code: "SCENARIO_TUITION_INQUIRY",
    title: "Phụ Huynh Hỏi Học Phí & Ưu Đãi",
    goal: "Báo học phí niêm yết chuẩn, nêu bật giá trị giảng viên hoa hậu/siêu mẫu kèm chính sách ưu đãi",
    stepsCount: 3,
    status: "Đang hoạt động",
  },
  {
    code: "SCENARIO_HIGH_PRICE_OBJECTION",
    title: "Xử Lý Từ Chối Khi Phụ Huynh Chê Giá Cao",
    goal: "Đồng cảm, phân tích sự khác biệt về chất lượng đào tạo và cơ hội trình diễn Tuần lễ thời trang",
    stepsCount: 4,
    status: "Đang hoạt động",
  },
  {
    code: "SCENARIO_HANDOFF_HUMAN",
    title: "Kích Hoạt Bàn Giao Tư Vấn Viên",
    goal: "Khách yêu cầu gặp quản lý, đàm phán lịch đặc biệt -> Khóa AI, chuyển nhân viên tiếp quản",
    stepsCount: 2,
    status: "Đang hoạt động",
  },
];

export default function AiScenariosPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Trung tâm đào tạo AI", href: "/ai-training" },
              { label: "Kịch bản tư vấn chuẩn" },
            ]}
          />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Quản Lý Kịch Bản Tư Vấn Chuẩn (Guided Scenarios)
          </h1>
          <p className="text-xs text-slate-500">
            Các kịch bản dẫn dắt có cấu trúc giúp AI luôn kiểm soát mục tiêu hội thoại, hỏi từng câu và không bị lạc đề.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#8B1D2C] hover:bg-[#721422] rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tạo Kịch Bản Mới
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((sc) => (
          <div
            key={sc.code}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {sc.code}
                </span>
                <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {sc.status}
                </span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">{sc.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{sc.goal}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-600">
                {sc.stepsCount} bước dẫn dắt
              </span>
              <button
                type="button"
                className="font-bold text-[#8B1D2C] hover:underline flex items-center gap-0.5"
              >
                Chỉnh sửa <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
