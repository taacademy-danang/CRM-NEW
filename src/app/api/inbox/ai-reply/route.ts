import { NextRequest, NextResponse } from "next/server";
import { generateAiResponse } from "@/lib/services/inboxService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { conversationId, isCopilot } = body;
    if (!conversationId) {
      return NextResponse.json({ success: false, message: "Thiếu ID hội thoại" }, { status: 400 });
    }

    const result = generateAiResponse(conversationId, Boolean(isCopilot));
    return NextResponse.json({
      success: true,
      message: isCopilot ? "AI đã tạo gợi ý câu trả lời" : "AI An An đã gửi câu trả lời tự động",
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Lỗi tạo câu trả lời AI" },
      { status: 500 }
    );
  }
}
