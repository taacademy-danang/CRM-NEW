"use client";

import React, { useState } from "react";
import { UserCheck, X, AlertCircle } from "lucide-react";
import { Customer } from "@/types/crm";

interface ReassignModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedCustomer: Customer) => void;
}

const STAFF_MEMBERS = [
  { id: "user-binh", name: "Trần Văn Bình", role: "Tư vấn viên chính" },
  { id: "user-trang", name: "Lê Minh Trang", role: "Tư vấn viên phong thái" },
  { id: "user-lan", name: "Nguyễn Thị Lan", role: "Quản trị hệ thống & Tuyển sinh" },
  { id: "user-mai", name: "Hoàng Ngọc Mai", role: "Tư vấn viên Model Kids" },
];

export default function ReassignModal({
  customer,
  isOpen,
  onClose,
  onSuccess,
}: ReassignModalProps) {
  const [selectedStaffId, setSelectedStaffId] = useState(STAFF_MEMBERS[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !customer) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const staff = STAFF_MEMBERS.find((s) => s.id === selectedStaffId);
    if (!staff) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/leads/reassign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: customer.id,
          newStaffId: staff.id,
          newStaffName: staff.name,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Lỗi chuyển nhân viên");
      }

      onSuccess(json.data);
      onClose();
    } catch (err: any) {
      setError(err.message || "Không thể thực hiện chuyển giao");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-white" />
            <h3 className="font-bold text-sm">Chuyển Nhân Viên Phụ Trách</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
            <p className="text-slate-500">Khách hàng cần bàn giao:</p>
            <p className="font-bold text-slate-900 text-sm">{customer.full_name}</p>
            <p className="text-slate-600">SĐT: {customer.phone || "Chưa có"} | Phụ trách hiện tại: <span className="font-semibold text-[#DC2626]">{customer.assigned_to_name || "Chưa phân công"}</span></p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">
              Chọn nhân viên tiếp nhận mới <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {STAFF_MEMBERS.map((staff) => (
                <label
                  key={staff.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    selectedStaffId === staff.id
                      ? "border-[#DC2626] bg-red-50/50 text-[#DC2626] ring-1 ring-[#DC2626]"
                      : "border-slate-200 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="staff_selection"
                      value={staff.id}
                      checked={selectedStaffId === staff.id}
                      onChange={() => setSelectedStaffId(staff.id)}
                      className="accent-[#DC2626]"
                    />
                    <div>
                      <p className="font-bold">{staff.name}</p>
                      <p className="text-[11px] text-slate-500">{staff.role}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#DC2626] hover:bg-[#B91C1C] rounded-xl shadow-md disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              {isSubmitting ? "Đang xử lý..." : "Xác Nhận Chuyển Giao"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
