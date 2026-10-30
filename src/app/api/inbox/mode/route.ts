import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateConversationMode } from "@/lib/services/inboxService";

const modeSchema = z.object({
  conversationId: z.string().min(1),
  mode: z.enum(["ai_auto", "human_takeover", "ai_copilot", "return_to_ai", "closed"]),
  agentName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, mode, agentName } = modeSchema.parse(body);

    const updated = updateConversationMode(conversationId, mode, agentName);

    const modeLabels: Record<string, string> = {
      ai_auto: "Đã bật AI Tự Động tư vấn 24/7",
      human_takeover: "Nhân viên đã tiếp quản! Khóa AI dừng trả lời tự động.",
      ai_copilot: "Đã kích hoạt chế độ AI Trợ lý gợi ý câu trả lời",
      return_to_ai: "Đã bàn giao lại quyền tư vấn cho AI An An",
      closed: "Đã đóng hội thoại tư vấn",
    };

    return NextResponse.json({
      success: true,
      message: modeLabels[mode] || "Đã cập nhật chế độ hội thoại",
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi cập nhật chế độ" },
      { status: 400 }
    );
  }
}
