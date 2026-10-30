import { NextRequest, NextResponse } from "next/server";
import { executeAiTask } from "@/lib/services/aiTaskService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) throw new Error("Thiếu ID tác vụ");

    const updated = executeAiTask(id);
    return NextResponse.json({
      success: true,
      message: `Đã kích hoạt chạy thử tác vụ: "${updated.title}". AI đã gửi tin nhắn mẫu đến danh sách khách hàng đủ điều kiện!`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi thực thi tác vụ AI" },
      { status: 400 }
    );
  }
}
