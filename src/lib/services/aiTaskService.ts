/**
 * AI TASK SERVICE - QUẢN LÝ VÀ MÔ PHỎNG THỰC THI TÁC VỤ AI LẶP LẠI TỰ ĐỘNG
 * T.A Academy CRM - Phase 2
 */

export interface AiTaskItem {
  id: string;
  title: string;
  triggerEvent: string;
  channel: "Facebook Messenger" | "Zalo OA" | "Đa kênh (FB & Zalo)";
  frequency: string;
  templateMessage: string;
  isActive: boolean;
  totalExecutedCount: number;
  lastExecutedTime: string;
}

let mockTasks: AiTaskItem[] = [
  {
    id: "task-1",
    title: "Tự động nhắn tin nhắc lịch học thử trước 24h",
    triggerEvent: "Khi trạng thái là 'Hẹn học thử' và trước giờ hẹn 24 giờ",
    channel: "Đa kênh (FB & Zalo)",
    frequency: "Tự động quét mỗi 30 phút",
    templateMessage:
      "Dạ em Tiểu Mỹ xin phép nhắc Mẹ lịch hẹn học thử của bé tại Học viện T.A Academy vào lúc {gio_hen} ngày mai {ngay_hen} ạ. Mẹ cho bé mặc trang phục thoải mái để con tự tin tập dáng đi nha Mẹ!",
    isActive: true,
    totalExecutedCount: 148,
    lastExecutedTime: "Hôm nay 10:00",
  },
  {
    id: "task-2",
    title: "Tự động nhắn tin hỏi thăm sau 48h khách không phản hồi",
    triggerEvent: "Khách đã xem học phí nhưng im lặng quá 48 tiếng",
    channel: "Facebook Messenger",
    frequency: "Tự động chạy lúc 14:00 hàng ngày",
    templateMessage:
      "Dạ Mẹ ơi, em Tiểu Mỹ gửi thông tin học phí khóa Model Kids hôm trước không biết Mẹ đã xem qua chưa ạ? Nếu Mẹ còn phân vân về thời gian học hay đưa đón bé, em luôn sẵn sàng hỗ trợ sắp xếp lịch thuận tiện nhất cho Mẹ nha!",
    isActive: true,
    totalExecutedCount: 86,
    lastExecutedTime: "Hôm nay 14:00",
  },
  {
    id: "task-3",
    title: "Tự động gửi cẩm nang trang phục & Chào mừng khi Đã đăng ký",
    triggerEvent: "Khách hàng chuyển trạng thái 'Đã đăng ký (E-learning)'",
    channel: "Zalo OA",
    frequency: "Kích hoạt tức thì ngay khi chốt đơn",
    templateMessage:
      "Chúc mừng Chị và bé đã chính thức trở thành học viên của T.A Academy! Em Tiểu Mỹ gửi Chị Cẩm nang hướng dẫn chuẩn bị trang phục và lộ trình buổi học đầu tiên tại đây nhé ạ...",
    isActive: true,
    totalExecutedCount: 215,
    lastExecutedTime: "Hôm qua 18:30",
  },
  {
    id: "task-4",
    title: "Tự động gửi lời chúc sinh nhật học viên & Tặng voucher quà tặng",
    triggerEvent: "Đến ngày sinh nhật của học viên ghi nhận trong hồ sơ",
    channel: "Zalo OA",
    frequency: "Tự động chạy lúc 08:30 sáng mỗi ngày",
    templateMessage:
      "Học viện T.A Academy thương chúc bé một tuổi mới luôn tỏa sáng, tự tin và rạng rỡ như một ngôi sao nhí! T.A Academy xin gửi tặng bé món quà đặc biệt là voucher ưu đãi...",
    isActive: false,
    totalExecutedCount: 39,
    lastExecutedTime: "15/10/2026",
  },
];

export function getAiTasks() {
  return [...mockTasks];
}

export function toggleAiTask(id: string) {
  const task = mockTasks.find((t) => t.id === id);
  if (!task) throw new Error("Không tìm thấy tác vụ AI");
  task.isActive = !task.isActive;
  return task;
}

export function createAiTask(data: Omit<AiTaskItem, "id" | "totalExecutedCount" | "lastExecutedTime">) {
  const newTask: AiTaskItem = {
    ...data,
    id: `task-${Date.now()}`,
    totalExecutedCount: 0,
    lastExecutedTime: "Chưa kích hoạt",
  };
  mockTasks.unshift(newTask);
  return newTask;
}

export function executeAiTask(id: string) {
  const task = mockTasks.find((t) => t.id === id);
  if (!task) throw new Error("Không tìm thấy tác vụ AI");
  task.totalExecutedCount += 1;
  task.lastExecutedTime = "Vừa xong (Mô phỏng kích hoạt thành công)";
  return task;
}

export function deleteAiTask(id: string) {
  const index = mockTasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Không tìm thấy tác vụ");
  mockTasks.splice(index, 1);
  return { success: true };
}
