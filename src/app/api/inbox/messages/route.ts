import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getConversationMessages,
  sendInboxMessage,
} from "@/lib/services/inboxService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const conversationId = searchParams.get("conversationId");
    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: "Thiếu ID hội thoại" },
        { status: 400 }
      );
    }

    const messages = await getConversationMessages(conversationId);
    return NextResponse.json({ success: true, data: messages });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tải tin nhắn" },
      { status: 500 }
    );
  }
}

const sendMessageSchema = z.object({
  conversationId: z.string().min(1, "Thiếu ID hội thoại"),
  content: z.string().min(1, "Nội dung tin nhắn không được để trống"),
  senderType: z.enum(["customer", "ai", "human_agent", "system"]),
  senderName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = sendMessageSchema.parse(body);

    const result = sendInboxMessage(validated);
    return NextResponse.json({
      success: true,
      message: "Gửi tin nhắn thành công",
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi gửi tin nhắn" },
      { status: 400 }
    );
  }
}
