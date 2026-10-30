import { NextResponse } from "next/server";
import { getDashboardStats } from "@/lib/services/leadService";

export async function GET() {
  try {
    const stats = getDashboardStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải thống kê" },
      { status: 500 }
    );
  }
}
