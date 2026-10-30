import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getAiTasks,
  createAiTask,
  toggleAiTask,
  deleteAiTask,
} from "@/lib/services/aiTaskService";

export async function GET() {
  try {
    const tasks = getAiTasks();
    return NextResponse.json({ success: true, data: tasks });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải tác vụ AI" },
      { status: 500 }
    );
  }
}

const createTaskSchema = z.object({
  title: z.string().min(3, "Tên tác vụ tối thiểu 3 ký tự"),
  triggerEvent: z.string().min(3, "Điều kiện kích hoạt bắt buộc"),
  channel: z.enum(["Facebook Messenger", "Zalo OA", "Đa kênh (FB & Zalo)"]),
  frequency: z.string().min(2, "Tần suất thực thi bắt buộc"),
  templateMessage: z.string().min(5, "Nội dung tin nhắn mẫu bắt buộc"),
  isActive: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = createTaskSchema.parse(body);

    const task = createAiTask(validated);
    return NextResponse.json({
      success: true,
      message: "Tạo tác vụ AI tự động thành công",
      data: task,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tạo tác vụ AI" },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;
    if (!id) throw new Error("Thiếu ID tác vụ");

    const updated = toggleAiTask(id);
    return NextResponse.json({
      success: true,
      message: updated.isActive ? "Đã bật kích hoạt tác vụ AI" : "Đã tạm dừng tác vụ AI",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi cập nhật trạng thái tác vụ" },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");
    if (!id) throw new Error("Thiếu ID tác vụ cần xóa");

    deleteAiTask(id);
    return NextResponse.json({
      success: true,
      message: "Đã xóa tác vụ thành công",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi xóa tác vụ" },
      { status: 400 }
    );
  }
}
