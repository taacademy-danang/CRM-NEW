"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { Award, AlertTriangle, CheckCircle2, ShieldAlert, Save } from "lucide-react";

export default function AiEvaluationPage() {
  const [s1, setS1] = useState(19); // Giao tiếp tự nhiên (max 20)
  const [s2, setS2] = useState(18); // Khai thác nhu cầu (max 20)
  const [s3, setS3] = useState(20); // Độ chính xác kiến thức (max 20)
  const [s4, setS4] = useState(18); // Xử lý từ chối (max 20)
  const [s5, setS5] = useState(18); // Dẫn dắt & Chốt lịch (max 20)
  const [hasCriticalError, setHasCriticalError] = useState(false);
  const [saved, setSaved] = useState(false);

  const totalScore = hasCriticalError ? 0 : s1 + s2 + s3 + s4 + s5;

  let grade = "Rất tốt (95 - 100)";
  let gradeColor = "text-emerald-700 bg-emerald-50 border-emerald-200";

  if (hasCriticalError) {
    grade = "KHÔNG ĐẠT (Lỗi nghiêm trọng: Bịa giá / Sai chính sách)";
    gradeColor = "text-red-700 bg-red-50 border-red-300";
  } else if (totalScore < 70) {
    grade = "Chưa đạt (< 70)";
    gradeColor = "text-red-700 bg-red-50 border-red-200";
  } else if (totalScore < 85) {
    grade = "Cần cải thiện (70 - 84)";
    gradeColor = "text-amber-700 bg-amber-50 border-amber-200";
  } else if (totalScore < 95) {
    grade = "Đạt yêu cầu (85 - 94)";
    gradeColor = "text-blue-700 bg-blue-50 border-blue-200";
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Breadcrumb
          items={[
            { label: "Trung tâm đào tạo AI", href: "/ai-training" },
            { label: "Đánh giá năng lực AI (Thang điểm 100)" },
          ]}
        />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Hệ Thống Đánh Giá Năng Lực AI Tuyển Sinh
        </h1>
        <p className="text-xs text-slate-500">
          Chấm điểm 5 tiêu chuẩn nghiệp vụ (mỗi tiêu chuẩn 20 điểm). Áp dụng quy tắc loại trừ nghiêm ngặt nếu phát hiện lỗi bịa giá hoặc cam kết trái phép.
        </p>
      </div>

      {/* Score Summary Card */}
      <div className={`p-6 rounded-2xl border-2 ${gradeColor} flex items-center justify-between shadow-xs`}>
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider">
            Kết Quả Đánh Giá Năng Lực
          </span>
          <div className="text-2xl font-black">{grade}</div>
          <p className="text-xs opacity-90">
            {hasCriticalError
              ? "Quy tắc loại trừ kích hoạt: Mọi câu trả lời sai lệch về học phí hoặc chính sách bị đánh rớt ngay lập tức."
              : "AI đủ điều kiện vận hành tư vấn trực tiếp trên Fanpage T.A Academy."}
          </p>
        </div>

        <div className="text-center bg-white/80 p-4 rounded-xl border border-current shrink-0">
          <div className="text-3xl font-extrabold">{totalScore}</div>
          <div className="text-[10px] font-bold text-slate-500">/ 100 ĐIỂM</div>
        </div>
      </div>

      {/* Scoring Form */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-[#8B1D2C]" />
          <span>Bảng Chấm Điểm 5 Tiêu Chí</span>
        </h3>

        <div className="space-y-4 text-xs">
          {/* Criterium 1 */}
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>1. Giao tiếp tự nhiên, nhã nhặn &amp; đúng phong thái:</span>
              <span className="text-[#8B1D2C] font-mono">{s1} / 20 điểm</span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              value={s1}
              onChange={(e) => setS1(Number(e.target.value))}
              className="w-full accent-[#8B1D2C]"
            />
          </div>

          {/* Criterium 2 */}
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>2. Khai thác nhu cầu &amp; am hiểu tâm lý phụ huynh:</span>
              <span className="text-[#8B1D2C] font-mono">{s2} / 20 điểm</span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              value={s2}
              onChange={(e) => setS2(Number(e.target.value))}
              className="w-full accent-[#8B1D2C]"
            />
          </div>

          {/* Criterium 3 */}
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>3. Độ chính xác kiến thức khóa học &amp; học phí niêm yết:</span>
              <span className="text-[#8B1D2C] font-mono">{s3} / 20 điểm</span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              value={s3}
              onChange={(e) => setS3(Number(e.target.value))}
              className="w-full accent-[#8B1D2C]"
            />
          </div>

          {/* Criterium 4 */}
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>4. Xử lý từ chối khéo léo (giá cao, bé nhút nhát...):</span>
              <span className="text-[#8B1D2C] font-mono">{s4} / 20 điểm</span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              value={s4}
              onChange={(e) => setS4(Number(e.target.value))}
              className="w-full accent-[#8B1D2C]"
            />
          </div>

          {/* Criterium 5 */}
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>5. Dẫn dắt tư vấn &amp; chốt lịch học thử:</span>
              <span className="text-[#8B1D2C] font-mono">{s5} / 20 điểm</span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              value={s5}
              onChange={(e) => setS5(Number(e.target.value))}
              className="w-full accent-[#8B1D2C]"
            />
          </div>

          {/* Critical Error Checkbox */}
          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 cursor-pointer">
              <input
                type="checkbox"
                checked={hasCriticalError}
                onChange={(e) => setHasCriticalError(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-red-900 block">
                  Đánh dấu vi phạm Lỗi Nghiêm Trọng (Critical Error)
                </span>
                <span className="text-red-700">
                  AI tự ý bịa đặt học phí ngoài biểu niêm yết, cam kết 100% học sinh đoạt giải, hoặc phát ngôn sai tôn chỉ của học viện.
                </span>
              </div>
            </label>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#8B1D2C] hover:bg-[#721422] rounded-xl shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            Lưu Kết Quả Đánh Giá
          </button>
        </div>
      </div>
    </div>
  );
}
