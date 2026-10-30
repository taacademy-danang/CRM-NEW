"use client";

import React from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Layers, Plus, CheckCircle2, AlertTriangle, BookCheck } from "lucide-react";

const situations = [
  {
    id: "sit-1",
    title: "Phụ huynh thắc mắc: 'Bé nhà chị rất nhút nhát, sợ không theo kịp các bạn'",
    category: "Tâm lý học viên",
    idealResponse:
      "Dạ Mẹ hoàn toàn yên tâm nhé ạ! Đây chính là lý do rất nhiều phụ huynh gửi gắm các bé đến T.A Academy. Giáo trình Model Kids được thiết kế từ các bài tập giải phóng hình thể nhẹ nhàng, giảng viên sẽ kèm cặp riêng từng bé để giúp con mở lòng, tự tin hơn qua từng buổi học mà không hề có áp lực thi cử ạ.",
    mistakeAvoid: "Không nói 'con nhút nhát vậy phải tập nhiều mới được' làm phụ huynh lo lắng.",
    isApproved: true,
  },
  {
    id: "sit-2",
    title: "Phụ huynh so sánh: 'Học phí bên em cao hơn trung tâm X gấp đôi'",
    category: "Xử lý học phí",
    idealResponse:
      "Dạ em rất hiểu trăn trở của Chị ạ! Sự khác biệt lớn nhất tại T.A Academy là đội ngũ giảng viên trực tiếp đứng lớp đều là các Siêu mẫu, Hoa hậu chuyên nghiệp có bằng sư phạm, sĩ số lớp giới hạn chỉ 8–10 học viên để đảm bảo chất lượng, và 100% các bé đều được tham gia trình diễn tại các Tuần lễ thời trang lớn sau khóa học ạ.",
    mistakeAvoid: "Không chê bai trung tâm đối thủ, không tự ý giảm giá khi chưa có chính sách.",
    isApproved: true,
  },
  {
    id: "sit-3",
    title: "Phụ huynh từ chối để lại số điện thoại",
    category: "Khai thác thông tin",
    idealResponse:
      "Dạ không sao đâu Chị ơi! Em xin phép gửi Chị bản lịch khai giảng và hình ảnh lớp học qua tin nhắn này để Chị tham khảo trước nhé ạ. Nếu Chị cần hỗ trợ thêm thông tin gì, em luôn sẵn sàng tư vấn cho Chị nha!",
    mistakeAvoid: "Không gặng hỏi ép buộc lấy số điện thoại nhiều lần liên tiếp.",
    isApproved: true,
  },
];

export default function AiSituationsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Trung tâm đào tạo AI", href: "/ai-training" },
              { label: "Thư viện tình huống" },
            ]}
          />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Thư Viện Tình Huống Thực Tế Đã Phê Duyệt
          </h1>
          <p className="text-xs text-slate-500">
            Tập hợp các câu hỏi hóc búa, lời từ chối của phụ huynh kèm câu trả lời mẫu mực và lỗi tối kỵ cần tránh.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#8B1D2C] hover:bg-[#721422] rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm Tình Huống Mới
        </button>
      </div>

      <div className="space-y-4">
        {situations.map((sit) => (
          <div
            key={sit.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                {sit.category}
              </span>
              <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đã duyệt vào quy tắc AI
              </span>
            </div>

            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BookCheck className="w-4 h-4 text-[#8B1D2C] shrink-0" />
              <span>{sit.title}</span>
            </h3>

            {/* Ideal response */}
            <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl">
              <span className="text-[11px] font-bold text-[#8B1D2C] uppercase tracking-wider block mb-1">
                Câu trả lời chuẩn mẫu (Ideal Response):
              </span>
              <p className="text-xs text-slate-800 leading-relaxed italic">
                "{sit.idealResponse}"
              </p>
            </div>

            {/* Mistake to avoid */}
            <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl flex items-start gap-2 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Lỗi tối kỵ cần tránh: </span>
                <span>{sit.mistakeAvoid}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
