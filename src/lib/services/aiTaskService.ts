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

// XÓA SẠCH TẤT CẢ DỮ LIỆU GIẢ CỦA TÁC VỤ AI - SẴN SÀNG ĐỂ TẠO MỚI
let mockTasks: AiTaskItem[] = [];

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

export function executeAiTaskSimulation(id: string) {
  const task = mockTasks.find((t) => t.id === id);
  if (!task) throw new Error("Không tìm thấy tác vụ");

  task.totalExecutedCount += 1;
  task.lastExecutedTime = "Vừa xong";
  return task;
}

export const executeAiTask = executeAiTaskSimulation;

export function deleteAiTask(id: string) {
  const index = mockTasks.findIndex((t) => t.id === id);
  if (index === -1) throw new Error("Không tìm thấy tác vụ để xóa");
  mockTasks.splice(index, 1);
  return { success: true };
}
