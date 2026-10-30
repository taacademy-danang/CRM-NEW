"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/layout/Breadcrumb";
import { BookOpen, Upload, CheckCircle2, Clock, FileText, Check } from "lucide-react";

interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  version: string;
  updatedAt: string;
  isApproved: boolean;
  approvedBy?: string;
  chunksCount: number;
}

const initialDocs: KnowledgeDoc[] = [
  {
    id: "doc-1",
    title: "Chính Sách Học Phí & Ưu Đãi Các Khóa Tuyển Sinh 2026",
    category: "Học phí & Chính sách",
    version: "2.1",
    updatedAt: "28/10/2026",
    isApproved: true,
    approvedBy: "Nguyễn Thị Lan (Admin)",
    chunksCount: 14,
  },
  {
    id: "doc-2",
    title: "Giáo Trình Khóa Model Kids Tài Năng (4-12 Tuổi)",
    category: "Model Kids",
    version: "1.5",
    updatedAt: "25/10/2026",
    isApproved: true,
    approvedBy: "Nguyễn Thị Lan (Admin)",
    chunksCount: 28,
  },
  {
    id: "doc-3",
    title: "Lộ Trình Đào Tạo Phong Thái Quý Cô & Doanh Nhân",
    category: "Phong thái",
    version: "1.2",
    updatedAt: "20/10/2026",
    isApproved: true,
    approvedBy: "Nguyễn Thị Lan (Admin)",
    chunksCount: 32,
  },
  {
    id: "doc-4",
    title: "Bản Dự Thảo Chính Sách Học Bổng Mùa Hè 2027",
    category: "Ưu đãi",
    version: "0.9 (Draft)",
    updatedAt: "Hôm nay 09:30",
    isApproved: false,
    chunksCount: 8,
  },
];

export default function AiKnowledgePage() {
  const [docs, setDocs] = useState<KnowledgeDoc[]>(initialDocs);

  const handleApprove = (id: string) => {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              isApproved: true,
              approvedBy: "Nguyễn Thị Lan (Admin)",
            }
          : d
      )
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb
            items={[
              { label: "Trung tâm đào tạo AI", href: "/ai-training" },
              { label: "Kho kiến thức & RAG" },
            ]}
          />
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#DC2626]" />
            <span>Kho Kiến Thức Nghiệp Vụ &amp; RAG (Retrieval-Augmented Generation)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Tài liệu nghiệp vụ tuyển sinh. Chỉ các tài liệu đã được Phê duyệt mới được đưa vào Vector Index để AI tham chiếu tư vấn.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md transition-colors"
        >
          <Upload className="w-4 h-4" />
          Tải Tài Liệu Mới (PDF / Word)
        </button>
      </div>

      {/* Docs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Tài liệu kiến thức</th>
              <th className="px-4 py-3">Danh mục</th>
              <th className="px-4 py-3">Phiên bản</th>
              <th className="px-4 py-3">Số phân đoạn (Chunks)</th>
              <th className="px-4 py-3">Trạng thái RAG</th>
              <th className="px-4 py-3">Người phê duyệt</th>
              <th className="px-4 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {docs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#DC2626]" />
                    <span>{doc.title}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Cập nhật: {doc.updatedAt}</span>
                </td>
                <td className="px-4 py-3.5 font-semibold text-slate-700">
                  {doc.category}
                </td>
                <td className="px-4 py-3.5 font-mono text-slate-600">
                  {doc.version}
                </td>
                <td className="px-4 py-3.5 font-mono font-bold text-slate-800">
                  {doc.chunksCount} chunks
                </td>
                <td className="px-4 py-3.5">
                  {doc.isApproved ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Đã duyệt (Active)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3.5 h-3.5" /> Chờ duyệt (Chưa dùng)
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-slate-600">
                  {doc.approvedBy || "--"}
                </td>
                <td className="px-4 py-3.5 text-right">
                  {!doc.isApproved ? (
                    <button
                      type="button"
                      onClick={() => handleApprove(doc.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs transition-colors inline-flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Duyệt đưa vào AI
                    </button>
                  ) : (
                    <span className="text-slate-400 text-xs font-medium">Đang tham chiếu</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
