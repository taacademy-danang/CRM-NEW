/**
 * LEAD & CALL SERVICE - XỬ LÝ NGHIỆP VỤ HÀNG ĐỢI KHÁCH CHƯA GỌI & CUỘC GỌI XÁC THỰC
 * T.A Academy CRM - Phase 2
 */

import { Customer, CallLog, ActivityLog } from "@/types/crm";

// Database storage (ĐÃ XÓA SẠCH DỮ LIỆU GIẢ - KHỞI TẠO RỖNG CHỜ DỮ LIỆU THỰC TẾ)
let mockCustomersDb: Customer[] = [];
let mockCallLogsDb: CallLog[] = [];
let mockActivityLogsDb: ActivityLog[] = [];

// 1. LẤY THỐNG KÊ DASHBOARD (STATS) THỰC TẾ
export function getDashboardStats() {
  recalculateSla();

  const total = mockCustomersDb.length;
  const newToday = mockCustomersDb.filter((c) => {
    try {
      const d = new Date(c.created_at);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    } catch {
      return false;
    }
  }).length;

  const uncalled = mockCustomersDb.filter(
    (c) => c.phone && (c.call_status === "pending" || c.status === "uncalled")
  ).length;

  const consulting = mockCustomersDb.filter((c) => c.status === "consulting").length;
  const needCare = mockCustomersDb.filter(
    (c) => c.status === "trial_scheduled" || c.call_status === "unreachable"
  ).length;
  const registered = mockCustomersDb.filter((c) => c.status === "registered").length;

  return {
    total_customers: total,
    new_today: newToday,
    uncalled_count: uncalled,
    consulting_count: consulting,
    need_care_count: needCare,
    registered_count: registered,
  };
}

// 2. HÀNG ĐỢI KHÁCH CHƯA GỌI (PRIORITY QUEUE) VỚI QUY TẮC SLA CHẶT CHẼ
export function getUncalledLeads(filterStaff?: string) {
  recalculateSla();

  let list = mockCustomersDb.filter(
    (c) => c.phone && (c.call_status === "pending" || c.status === "uncalled")
  );

  if (filterStaff && filterStaff !== "all") {
    list = list.filter((c) => c.assigned_to === filterStaff || c.assigned_to_name === filterStaff);
  }

  return list.sort((a, b) => (b.waiting_minutes || 0) - (a.waiting_minutes || 0));
}

// 3. TÍNH TOÁN LẠI THỜI GIAN CHỜ VÀ CẢNH BÁO SLA
export function recalculateSla() {
  const now = Date.now();
  mockCustomersDb.forEach((c) => {
    if (c.phone && c.call_status === "pending" && c.first_phone_received_at) {
      const diffMs = now - new Date(c.first_phone_received_at).getTime();
      const minutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
      c.waiting_minutes = minutes;

      if (minutes >= 60) {
        c.sla_alert_level = "danger_60m";
      } else if (minutes >= 15) {
        c.sla_alert_level = "warning_15m";
      } else {
        c.sla_alert_level = "none";
      }
    }
  });
}

// 4. GHI NHẬN CUỘC GỌI HỢP LỆ (CALL LOG MUTATION)
export function createCallLog(data: {
  customer_id: string;
  phone_called: string;
  call_result: "connected" | "unreachable" | "busy" | "wrong_number" | "recall_requested";
  duration_seconds: number;
  call_summary: string;
  recall_at?: string | null;
  next_status: string;
  agent_name?: string;
}) {
  const customer = mockCustomersDb.find((c) => c.id === data.customer_id);
  if (!customer) {
    throw new Error("Không tìm thấy khách hàng trong cơ sở dữ liệu");
  }

  const newCallLog: CallLog = {
    id: `call-${Date.now()}`,
    customer_id: data.customer_id,
    agent_id: "current-user",
    agent_name: data.agent_name || "Tư vấn viên",
    phone_called: data.phone_called,
    call_result: data.call_result,
    duration_seconds: data.duration_seconds,
    call_summary: data.call_summary,
    recall_at: data.recall_at,
    created_at: new Date().toISOString(),
  };
  mockCallLogsDb.unshift(newCallLog);

  customer.call_status = data.call_result === "connected" ? "contacted" : "unreachable";
  customer.status = data.next_status as any;
  customer.last_called_at = new Date().toISOString();
  customer.sla_alert_level = "none";
  customer.updated_at = new Date().toISOString();

  mockActivityLogsDb.unshift({
    id: `act-${Date.now()}`,
    customer_id: customer.id,
    actor_id: "agent-id",
    actor_name: data.agent_name || "Tư vấn viên",
    actor_type: "human",
    activity_type: "call_logged",
    description: `Thực hiện cuộc gọi (${data.duration_seconds}s) - Kết quả: ${
      data.call_result === "connected" ? "Đã liên hệ" : "Không nghe máy"
    }. Tóm tắt: ${data.call_summary}`,
    created_at: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  });

  return { customer, callLog: newCallLog };
}

// 5. CHUYỂN NHÂN VIÊN TƯ VẤN PHỤ TRÁCH (REASSIGN LEAD)
export function reassignLead(customerId: string, newStaffId: string, newStaffName: string) {
  const customer = mockCustomersDb.find((c) => c.id === customerId);
  if (!customer) throw new Error("Không tìm thấy khách hàng");

  const oldStaff = customer.assigned_to_name;
  customer.assigned_to = newStaffId;
  customer.assigned_to_name = newStaffName;
  customer.updated_at = new Date().toISOString();

  mockActivityLogsDb.unshift({
    id: `act-${Date.now()}`,
    customer_id: customer.id,
    actor_type: "human",
    actor_name: "Quản trị viên",
    activity_type: "lead_reassigned",
    description: `Chuyển quyền phụ trách khách hàng từ ${oldStaff || "Chưa giao"} sang ${newStaffName}`,
    created_at: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
  });

  return customer;
}

// 6. NHẬT KÝ HOẠT ĐỘNG REALTIME
export function getActivityLogs() {
  return mockActivityLogsDb.slice(0, 10);
}
