/**
 * LEAD & CALL SERVICE - XỬ LÝ NGHIỆP VỤ HÀNG ĐỢI KHÁCH CHƯA GỌI & CUỘC GỌI XÁC THỰC
 * T.A Academy CRM - Phase 2
 */

import { Customer, CallLog, ActivityLog } from "@/types/crm";

// Database storage mock state (sẽ đồng bộ với Supabase PostgreSQL khi có credentials production)
let mockCustomersDb: Customer[] = [
  {
    id: "lead-01",
    customer_code: "TV-2026-001",
    full_name: "Phạm Thu Hương",
    phone: "0988123456",
    source: "facebook",
    status: "uncalled",
    call_status: "pending",
    first_phone_received_at: new Date(Date.now() - 68 * 60 * 1000).toISOString(), // 68 phút (>60m: Nguy cấp)
    sla_alert_level: "danger_60m",
    assigned_to: "user-binh",
    assigned_to_name: "Trần Văn Bình",
    interested_course_id: "course-model-kids",
    interested_course_title: "Model Kids (Mẫu Nhí)",
    waiting_minutes: 68,
    notes: "Bé 7 tuổi nhút nhát, lưng đi hơi gù, muốn rèn dáng tự tin",
    created_at: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "lead-02",
    customer_code: "TV-2026-002",
    full_name: "Nguyễn Hoàng Nam",
    phone: "0912345888",
    source: "zalo",
    status: "uncalled",
    call_status: "pending",
    first_phone_received_at: new Date(Date.now() - 28 * 60 * 1000).toISOString(), // 28 phút (>15m: Cảnh báo)
    sla_alert_level: "warning_15m",
    assigned_to: "user-trang",
    assigned_to_name: "Lê Minh Trang",
    interested_course_id: "course-phong-thai",
    interested_course_title: "Phong Thái Doanh Nhân",
    waiting_minutes: 28,
    notes: "Quan tâm lịch học ngoài giờ",
    created_at: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "lead-03",
    customer_code: "TV-2026-003",
    full_name: "Hoàng Kiều Trinh",
    phone: "0909555666",
    source: "facebook",
    status: "uncalled",
    call_status: "pending",
    first_phone_received_at: new Date(Date.now() - 8 * 60 * 1000).toISOString(), // 8 phút (Bình thường)
    sla_alert_level: "none",
    assigned_to: "user-binh",
    assigned_to_name: "Trần Văn Bình",
    interested_course_id: "course-catwalk",
    interested_course_title: "Catwalk Chuyên Nghiệp",
    waiting_minutes: 8,
    notes: "Hỏi về cơ hội diễn show thời trang",
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "lead-04",
    customer_code: "TV-2026-004",
    full_name: "Vũ Mai Phương",
    phone: "0934888999",
    source: "hotline",
    status: "registered",
    call_status: "contacted",
    first_phone_received_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    sla_alert_level: "none",
    assigned_to: "user-lan",
    assigned_to_name: "Nguyễn Thị Lan",
    interested_course_title: "Phong Thái Quý Cô",
    last_called_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    notes: "Đã đóng học phí, đã chuyển sang E-learning xếp lớp K26",
    created_at: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "lead-05",
    customer_code: "TV-2026-005",
    full_name: "Trịnh Thùy Linh",
    phone: "0977222333",
    source: "facebook",
    status: "trial_scheduled",
    call_status: "contacted",
    first_phone_received_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    sla_alert_level: "none",
    assigned_to: "user-binh",
    assigned_to_name: "Trần Văn Bình",
    interested_course_title: "Model Kids (Mẫu Nhí)",
    last_called_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    notes: "Hẹn 9h sáng thứ 7 đến học thử",
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let mockCallLogsDb: CallLog[] = [];
let mockActivityLogsDb: ActivityLog[] = [
  {
    id: "act-1",
    customer_id: "lead-01",
    actor_id: "system",
    actor_type: "ai",
    activity_type: "message_received",
    description: "Nhận tin nhắn mới từ Fanpage: Phụ huynh Phạm Thu Hương",
    created_at: "14:31",
  },
  {
    id: "act-2",
    customer_id: "lead-01",
    actor_id: "ai-bot",
    actor_type: "ai",
    activity_type: "phone_extracted",
    description: "AI tự động trích xuất và cập nhật SĐT: 0988123456",
    created_at: "14:32",
  },
  {
    id: "act-3",
    customer_id: "lead-04",
    actor_id: "user-lan",
    actor_name: "Nguyễn Thị Lan",
    actor_type: "human",
    activity_type: "call_logged",
    description: "Xác nhận chốt đơn và tự động chuyển hồ sơ sang E-learning xếp lớp K26",
    created_at: "11:20",
  },
];

// 1. LẤY THỐNG KÊ DASHBOARD (STATS)
export function getDashboardStats() {
  // Tự động tính toán lại SLA cho khách chưa gọi
  recalculateSla();

  const total = mockCustomersDb.length + 1275; // Baseline quy mô
  const newToday = 42;
  const uncalled = mockCustomersDb.filter((c) => c.phone && c.call_status === "pending").length;
  const consulting = mockCustomersDb.filter((c) => c.status === "consulting").length + 94;
  const needCare = 34;
  const registered = mockCustomersDb.filter((c) => c.status === "registered").length + 144;

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

  // Quy tắc cốt lõi: Chỉ lấy khách có SĐT và call_status === 'pending'
  let list = mockCustomersDb.filter(
    (c) => c.phone && (c.call_status === "pending" || c.status === "uncalled")
  );

  if (filterStaff && filterStaff !== "all") {
    list = list.filter((c) => c.assigned_to === filterStaff || c.assigned_to_name === filterStaff);
  }

  // Sắp xếp ưu tiên: Đỏ (>60m) trước -> Vàng (>15m) -> Mới tiếp nhận
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
// Không được ghi nhận cuộc gọi chỉ vì mở xem hoặc bấm số điện thoại.
// Chỉ ghi nhận khi nhân viên gửi Call Log hợp lệ!
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

  // 1. Tạo bản ghi Call Log
  const newCallLog: CallLog = {
    id: `call-${Date.now()}`,
    customer_id: data.customer_id,
    agent_id: "current-user",
    agent_name: data.agent_name || "Trần Văn Bình",
    phone_called: data.phone_called,
    call_result: data.call_result,
    duration_seconds: data.duration_seconds,
    call_summary: data.call_summary,
    recall_at: data.recall_at,
    created_at: new Date().toISOString(),
  };
  mockCallLogsDb.unshift(newCallLog);

  // 2. Cập nhật hồ sơ khách hàng -> Loại khỏi danh sách Khách chưa gọi
  customer.call_status = data.call_result === "connected" ? "contacted" : "unreachable";
  customer.status = data.next_status as any;
  customer.last_called_at = new Date().toISOString();
  customer.sla_alert_level = "none";
  customer.updated_at = new Date().toISOString();

  // 3. Ghi vào nhật ký hoạt động
  mockActivityLogsDb.unshift({
    id: `act-${Date.now()}`,
    customer_id: customer.id,
    actor_id: "agent-id",
    actor_name: data.agent_name || "Trần Văn Bình",
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
