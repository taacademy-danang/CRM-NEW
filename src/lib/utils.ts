import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Hàm hợp nhất class name cho Tailwind CSS chống xung đột style
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Định dạng tiền tệ VNĐ (Việt Nam Đồng)
 */
export function formatCurrencyVN(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Định dạng ngày giờ chuẩn Việt Nam (DD/MM/YYYY HH:mm)
 */
export function formatDateTimeVN(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "--:--";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Định dạng giờ ngắn (HH:mm)
 */
export function formatTimeVN(dateString: string | Date): string {
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "--:--";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Tính số phút đã trôi qua kể từ một mốc thời gian
 */
export function getMinutesElapsed(startTime: string | Date): number {
  const start = typeof startTime === "string" ? new Date(startTime).getTime() : startTime.getTime();
  const now = Date.now();
  const diffMs = now - start;
  return Math.max(0, Math.floor(diffMs / (1000 * 60)));
}
